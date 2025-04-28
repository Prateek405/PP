// // PushToWatch.js
// import React, { useState, useEffect } from 'react';
// import { View, Button } from 'react-native';
// import { BleManager } from 'react-native-ble-plx';
// import RNFetchBlob from 'rn-fetch-blob'; // For reading the MP3 file

// const PushToWatch = () => {
//     const [device, setDevice] = useState(null);

//     useEffect(() => {
//         // Initialize Bluetooth manager
//         const manager = new BleManager();

//         // Scan for devices
//         const scanForDevices = async () => {
//             try {
//                 const devices = await manager.startDeviceScan(null, null, (error, scannedDevice) => {
//                     if (scannedDevice.name === 'TwKidsWatch') {
//                         // Found the smartwatch, stop scanning
//                         manager.stopDeviceScan();
//                         setDevice(scannedDevice);
//                     }
//                 });
//             } catch (error) {
//                 console.error('Error scanning for devices:', error);
//             }
//         };

//         // Start scanning on mount
//         scanForDevices();

//         // Clean up on unmount
//         return () => {
//             manager.destroy();
//         };
//     }, []);

//     const sendMp3ToDevice = async () => {
//         if (!device) {
//             console.warn('TwKidsWatch not found.');
//             return;
//         }

//         try {
//             // Establish connection with the smartwatch
//             await device.connect();

//             // Read the MP3 file (replace 'path/to/your/file.mp3' with the actual file path)
//             const mp3File = await RNFetchBlob.fs.readFile('path/to/your/file.mp3', 'base64');

//             // Write the MP3 data to the smartwatch (replace 'your_characteristic_uuid' with the actual UUID)
//             await device.writeCharacteristicWithResponseForService(
//                 'your_service_uuid',
//                 'your_characteristic_uuid',
//                 mp3File
//             );

//             // After sending, you can close the connection
//             await device.disconnect();
//         } catch (error) {
//             console.error('Error sending MP3:', error);
//         }
//     };

//     return (
//         <View>
//             <Button title="Send MP3 to TwKidsWatch" onPress={sendMp3ToDevice} />
//         </View>
//     );
// };

// export default PushToWatch;
