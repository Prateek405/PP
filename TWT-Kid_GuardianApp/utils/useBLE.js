/* eslint-disable no-bitwise */
import { useEffect, useMemo, useState, useRef } from "react";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import { BleManager } from "react-native-ble-plx";
import * as ExpoDevice from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import base64 from "react-native-base64";
import { getAllNominees, markNomineeAsSynced,getAllNameAndMobileFromContact,markContactAsSynced } from "./sqlite";


// UUIDs for the watch data service and characteristics.
const WATCH_DATA_UUID = "cfa7a8d4-2d4e-4b9a-9a84-9b3d30cf6e1a";
const WATCH_DATA_CHARACTERISTIC = "e98c1a52-7d6b-4a18-bf4c-182f3b5dce2f";
const APP_ACK_CHARACTERISTIC = "a45d1c68-fd1c-441a-ae6c-7c2b5a1f98f3";

// New writable characteristics for sending lists.
const Nominee_LIST_CHARACTERISTIC = "7a9b8c7d-6e5f-4d3c-2b1a-0f9e8d7c6b5a";
const APPROVED_CONTACTS_CHARACTERISTIC = "1a2b3c4d-5e6f-4789-abcd-0123456789ab";

// ─── NEW: End‐of‐transmission markers ─────────────────────────────────────────
const NOMINEE_LIST_END_MARKER      = "nomineelist_end";
const APPROVED_CONTACTS_END_MARKER = "approvedContacts_end";
// ────────────────────────────────────────────────────────────────────────────────


const negotiateMTU = async (device) => {
  try {
    const requestedMTU = 247; // Typical maximum supported by most Android devices
    const updatedDevice = await device.requestMTU(requestedMTU);
    console.log("Negotiated MTU:", updatedDevice.mtu);
    return updatedDevice; // Return to update your connected device reference if needed
  } catch (error) {
    console.log("MTU negotiation failed:", error);
    return device; // fallback
  }
};

export default function useBLE() {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [heartRate, setHeartRate] = useState(0);

  // For receiving long notifications, we accumulate incoming chunks
  const messageBufferRef = useRef("");  
  const EXPECTED_MESSAGE_LENGTH = 28; // e.g. 16-byte key + 12-byte device ID

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Bluetooth Low Energy requires Location",
        buttonPositive: "OK",
      }
    );
    return (
      bluetoothScanPermission === "granted" &&
      bluetoothConnectPermission === "granted" &&
      fineLocationPermission === "granted"
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "Bluetooth Low Energy requires Location",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return await requestAndroid31Permissions();
      }
    }
    return true;
  };

  const isDuplicateDevice = (devices, nextDevice) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = (duration = 30000) => {
    setAllDevices([]);
    console.log(`Starting BLE scan for ${duration / 1000} seconds...`);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan error:", error);
        return;
      }
      if (!device) return;
      setAllDevices((prevState) => {
        if (!isDuplicateDevice(prevState, device)) {
          console.log(
            "Device discovered:",
            device.name,
            device.id,
            "Services:",
            device.serviceUUIDs
          );
          return [...prevState, device];
        }
        return prevState;
      });
    });
    setTimeout(() => {
      bleManager.stopDeviceScan();
      console.log("Stopped scanning after timeout.");
    }, duration);
  };

  // ─── NEW HELPER: send end‐of‐nominees marker ────────────────────────────────
  const sendNomineeListEnd = async () => {
    if (!connectedDevice) return;
    try {
      const marker = NOMINEE_LIST_END_MARKER + "\n";
      const encoded = base64.encode(marker);
      await connectedDevice.writeCharacteristicWithResponseForService(
        WATCH_DATA_UUID,
        Nominee_LIST_CHARACTERISTIC,
        encoded
      );
      console.log("Sent nominee list END marker.");
    } catch (e) {
      console.error("Failed to send nominee END marker:", e);
    }
  };

  // ─── NEW HELPER: send end‐of‐contacts marker ────────────────────────────────
  const sendApprovedContactsEnd = async () => {
    if (!connectedDevice) return;
    try {
      const marker = APPROVED_CONTACTS_END_MARKER + "\n";
      const encoded = base64.encode(marker);
      await connectedDevice.writeCharacteristicWithResponseForService(
        WATCH_DATA_UUID,
        APPROVED_CONTACTS_CHARACTERISTIC,
        encoded
      );
      console.log("Sent approved contacts END marker.");
    } catch (e) {
      console.error("Failed to send contacts END marker:", e);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const connectandsync = async (sync = false) => {
    const permissionsGranted = await requestPermissions();
    if (!permissionsGranted) {
      console.error("Permissions not granted");
      return;
    }
    try {
      let deviceConnection = null;
      const storedDeviceId = await AsyncStorage.getItem("bondedDeviceId");
      if (storedDeviceId) {
        console.log("Attempting to reconnect to stored device:", storedDeviceId);
        try {
          deviceConnection = await bleManager.connectToDevice(storedDeviceId);
          if (Platform.OS === "android") {
            await bleManager.bondDevice(deviceConnection.id);
          }
        } catch (error) {
          console.warn("Failed to reconnect to stored device:", error);
        }
      }
      if (!deviceConnection && allDevices.length > 0) {
        console.log("Attempting to connect to a device from the scanned list with WATCH_DATA_UUID...");
        const watchDevice = allDevices.find(
          (d) => d.serviceUUIDs && d.serviceUUIDs.includes(WATCH_DATA_UUID)
        );
        if (watchDevice) {
          try {
            deviceConnection = await bleManager.connectToDevice(watchDevice.id);
            if (Platform.OS === "android") {
              await bleManager.bondDevice(watchDevice.id);
            }
            await AsyncStorage.setItem("bondedDeviceId", watchDevice.id);
            console.log("Bonded device saved:", watchDevice.id);
          } catch (error) {
            console.warn("Failed to connect to scanned device with WATCH_DATA_UUID:", error);
          }
        } else {
          console.log("No scanned device with WATCH_DATA_UUID found.");
        }
      }
      if (!deviceConnection) {
        console.log("No stored or scanned device available. Starting a new scan...");
        deviceConnection = await new Promise((resolve, reject) => {
          bleManager.startDeviceScan(null, null, async (error, device) => {
            if (error) {
              console.error("Scan error:", error);
              reject(error);
              return;
            }
            if (device?.serviceUUIDs && device.serviceUUIDs.includes(WATCH_DATA_UUID)) {
              bleManager.stopDeviceScan();
              try {
                const conn = await bleManager.connectToDevice(device.id);
                if (Platform.OS === "android") {
                  await bleManager.bondDevice(conn.id);
                }
                await AsyncStorage.setItem("bondedDeviceId", device.id);
                console.log("Bonded device saved during scan:", device.id);
                resolve(conn);
              } catch (connectError) {
                console.error("Failed to connect to device during scan:", connectError);
                reject(connectError);
              }
            }
          });
          setTimeout(() => {
            bleManager.stopDeviceScan();
            reject(new Error("Scan timeout: No device with WATCH_DATA_UUID found"));
          }, 30000);
        });
      }
      if (deviceConnection) {
        const mtuNegotiatedDevice = await negotiateMTU(deviceConnection);
        // Start all your characteristic monitors:
        await startStreamingData(mtuNegotiatedDevice);

        setConnectedDevice(mtuNegotiatedDevice);
        Alert.alert(
          "Verify Passcode",
          "A passcode is displayed in the native pairing dialog on your phone. Please compare it with the one on your smartwatch and confirm they match.",
          [{ text: "OK" }]
        );
        if (sync) {
          // Syncing Nominees (one at a time)
          const allNominees = await getAllNominees();
          console.log("Nominees being synced:", allNominees);
          for (const nominee of allNominees) {
            await sendNominee(nominee);
            await markNomineeAsSynced(nominee);
          }
           // ─── AFTER SENDING ALL NOMINEES ────────────────────────────────────────
          await sendNomineeListEnd();
          // ────────────────────────────────────────────────────────────────────────
          console.log("All selected nominees have been marked as synced.");

          // Syncing Approved Contacts (one at a time)
          const contacts = await getAllNameAndMobileFromContact();
          console.log("Contacts being synced:", contacts);
          for (const contact of contacts) {
            await sendApprovedContacts(contact);
            await markContactAsSynced(contact);
          }

          // ─── AFTER SENDING ALL CONTACTS ───────────────────────────────────────
          await sendApprovedContactsEnd();
          // ────────────────────────────────────────────────────────────────────────
          
        }
      } else {
        console.error("No device found or connected.");
      }
    } catch (error) {
      console.error("Error during connectandsync:", error);
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      await bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      await AsyncStorage.removeItem("bondedDeviceId");
      console.log("Bonded device information cleared.");
    }
  };

  const pairAgain = async (sync = false) => {
    try {
      console.log("Starting pair again process...");
      await disconnectFromDevice();
      bleManager.stopDeviceScan();
      scanForPeripherals();
      await connectandsync(sync);
    } catch (error) {
      console.error("Error during pair again:", error);
    }
  };

  // ---------- Helper: Send Long Characteristic (split into 20-byte chunks) ----------
  const sendLongCharacteristic = async (characteristicUUID, dataString) => {
    if (!connectedDevice) return;
    // Convert the string into raw bytes using TextEncoder
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString); // Uint8Array
    const chunkSize = 20; // Maximum payload per write (for MTU=23)
    for (let i = 0; i < dataBuffer.length; i += chunkSize) {
      const chunk = dataBuffer.slice(i, i + chunkSize);
      // Convert the chunk (Uint8Array) to a string for base64 encoding
      // Note: For small chunks, spread operator works fine.
      const chunkStr = String.fromCharCode(...chunk);
      const encodedChunk = base64.encode(chunkStr);
      // Write the current chunk
      await connectedDevice.writeCharacteristicWithResponseForService(
        WATCH_DATA_UUID,
        characteristicUUID,
        encodedChunk
      );
      // Optional: wait a short while between writes
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };

  // ---------- Modified: Sending Lists ----------
  // If the encoded JSON exceeds 20 bytes, use sendLongCharacteristic.
  const sendNominee = async (nominee) => {
    if (!connectedDevice) {
      console.log("No device connected. Cannot send Nominee list.");
      return;
    }
    try {
      const jsonStr = JSON.stringify(nominee) + "\n";
      // Check if the JSON string length is greater than our chunk size threshold.
      if (jsonStr.length > 20) {
        await sendLongCharacteristic(Nominee_LIST_CHARACTERISTIC, jsonStr);
      } else {
        const dataToSend = base64.encode(jsonStr);
        await connectedDevice.writeCharacteristicWithResponseForService(
          WATCH_DATA_UUID,
          Nominee_LIST_CHARACTERISTIC,
          dataToSend
        );
      }
      console.log("Sent Nominee to watch.");
    } catch (error) {
      console.log("Failed to send Nominee:", error);
    }
  };

  const sendApprovedContacts = async (contact) => {
    if (!connectedDevice) {
      console.log("No device connected. Cannot send approved contacts.");
      return;
    }
    try {
      // Append newline at the end to mark record termination
      const jsonStr = JSON.stringify(contact) + "\n";
      if (jsonStr.length > 20) {
        await sendLongCharacteristic(APPROVED_CONTACTS_CHARACTERISTIC, jsonStr);
      } else {
        const dataToSend = base64.encode(jsonStr);
        await connectedDevice.writeCharacteristicWithResponseForService(
          WATCH_DATA_UUID,
          APPROVED_CONTACTS_CHARACTERISTIC,
          dataToSend
        );
      }
      console.log("Sent approved contacts to watch.");
    } catch (error) {
      console.log("Failed to send approved contacts:", error);
    }
  };
  

  // ---------- Monitoring Multiple Characteristics ----------
  // This function sets up monitors for each characteristic.
  const startStreamingData = async (device) => {
    if (!device) {
      console.log("No device connected");
      return;
    }
    // Monitor for watch data characteristic (for incoming notifications)
    device.monitorCharacteristicForService(
      WATCH_DATA_UUID,
      WATCH_DATA_CHARACTERISTIC,
      onWatchDataUpdate
    );

    // Monitor for nominee list acknowledgement characteristic
    device.monitorCharacteristicForService(
      WATCH_DATA_UUID,
      Nominee_LIST_CHARACTERISTIC,
      onNomineeListUpdate
    );

    // Monitor for approved contacts acknowledgement characteristic
    device.monitorCharacteristicForService(
      WATCH_DATA_UUID,
      APPROVED_CONTACTS_CHARACTERISTIC,
      onApprovedContactsUpdate
    );
  };

  // ---------- Modified: onWatchDataUpdate to accumulate and merge long notifications ----------
  const onWatchDataUpdate = async (error, characteristic) => {
    if (error) {
      console.log("Error receiving watch data:", error);
      return;
    }
    if (!characteristic?.value) {
      console.log("No data received for watch data.");
      return;
    }
    // Decode the new incoming chunk
    const chunk = base64.decode(characteristic.value);
    console.log("Received notification chunk:", chunk);
    
    // Append the new chunk to our buffer
    messageBufferRef.current += chunk;
    console.log("Current merged buffer:", messageBufferRef.current);
    
    // Check if we have received a complete message
    if (messageBufferRef.current.length >= EXPECTED_MESSAGE_LENGTH) {
      // Extract complete message (if extra data exists, preserve it for next message)
      const completeMessage = messageBufferRef.current.slice(0, EXPECTED_MESSAGE_LENGTH);
      
      // Process the complete message (for example, split into key and device id)
      const KEY_LENGTH = 16;
      const DEVICE_ID_LENGTH = 12;
      const watchKey = completeMessage.slice(0, KEY_LENGTH);
      const watchDeviceId = completeMessage.slice(KEY_LENGTH, KEY_LENGTH + DEVICE_ID_LENGTH);
      console.log("Merged Watch key and device id:", { key: watchKey, deviceId: watchDeviceId });
      
      // Clear the processed part of the buffer
      messageBufferRef.current = messageBufferRef.current.slice(EXPECTED_MESSAGE_LENGTH);
      
      // Send client acknowledgement once full message is received
      await sendClientAcknowledgement();
    }
  };

  // Callback for nominee list acknowledgement.
  const onNomineeListUpdate = async (error, characteristic) => {
    if (error) {
      console.log("Error receiving nominee list acknowledgement:", error);
      return;
    }
    if (!characteristic?.value) {
      console.log("No data received for nominee list acknowledgement.");
      return;
    }
    const rawData = base64.decode(characteristic.value);
    if (rawData === "nomineelist_ack") {
      console.log("Watch acknowledged receipt of Nominee list.");
    } else {
      console.log("Unexpected data on Nominee list characteristic:", rawData);
    }
  };

  // Callback for approved contacts acknowledgement.
  const onApprovedContactsUpdate = async (error, characteristic) => {
    if (error) {
      console.log("Error receiving approved contacts acknowledgement:", error);
      return;
    }
    if (!characteristic?.value) {
      console.log("No data received for approved contacts acknowledgement.");
      return;
    }
    const rawData = base64.decode(characteristic.value);
    if (rawData === "approvedContacts_ack") {
      console.log("Watch acknowledged receipt of approved contacts.");
    } else {
      console.log("Unexpected data on approved contacts characteristic:", rawData);
    }
  };

  // Function to send a client acknowledgement back to the watch.
  const sendClientAcknowledgement = async () => {
    if (!connectedDevice) return;
    try {
      await connectedDevice.writeCharacteristicWithResponseForService(
        WATCH_DATA_UUID,
        APP_ACK_CHARACTERISTIC,
        base64.encode("client_received")
      );
      console.log("Sent client acknowledgement to watch.");
    } catch (error) {
      console.log("Failed to send client acknowledgement:", error);
    }
  };

  useEffect(() => {
    (async () => {
      const permissions = await requestPermissions();
      if (permissions) {
        const storedDeviceId = await AsyncStorage.getItem("bondedDeviceId");
        if (storedDeviceId) {
          console.log("Stored device found. Attempting to reconnect...");
          try {
            const deviceConnection = await bleManager.connectToDevice(storedDeviceId);
            setConnectedDevice(deviceConnection);
          } catch (error) {
            console.error("Failed to reconnect to stored device:", error);
            scanForPeripherals();
          }
        } else {
          console.log("No stored device. Starting scan...");
          scanForPeripherals();
        }
      } else {
        console.log("Permissions not granted.");
      }
    })();
  }, []);

  return {
    scanForPeripherals,
    connectandsync,
    disconnectFromDevice,
    pairAgain,
    connectedDevice,
    allDevices,
  };
}
