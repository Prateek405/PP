// YourNominees.js
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import FeatherIcon from "react-native-vector-icons/Feather";
import AddNomineeForm from "./AddNomineeForm";
import NomineeList from "./NomineeList";
import useBLE from "../../utils/useBLE.js";
import { getDeviceID } from "../../utils/sharedData";
import { deleteNominee } from "../../utils/sqlite";

const subscriptionKey = "6fc2de400ce34d76859ba9c725464f97";

const YourNominees = () => {
  const [nominees, setNominees] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingNominee, setLoadingNominee] = useState(false);
  const [error, setError] = useState(null);

  const { connectedDevice, connect } = useBLE();
  const [status, setStatus] = useState(
    "Not connected to Bluetooth. Please connect to add TwKidss."
  );

  useEffect(() => {
    if (connectedDevice) {
      setStatus(`Connected to Bluetooth: ${connectedDevice.name}`);
    }
  }, [connectedDevice]);

  // Fetch nominees from external API when the component mounts.
  const fetchNominees = async (deviceId) => {
    setLoadingNominee(true);
    try {
      const response = await axios.post(
        "https://tw-central-apim.azure-api.net/user-service-twt/fetch_nominee_details",
        { token: deviceId },
        {
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
          },
          timeout: 120000, // 2 minutes timeout
        }
      );
  
      // Validate the response data
      if (!Array.isArray(response.data)) {
        console.error("No data present in database.");
      }
  
      // Filter nominees with valid name and mobile number
      const validNominees = response.data.filter(
        (nominee) => nominee.nomineeName && nominee.mobileNumber
      );
      setNominees(validNominees);
      setError(null);
    } catch (err) {
      console.error("Error fetching nominees:", err);
  
      // Handle specific errors
      if (err.message === "Network Error") {
        setError("No internet connection. Please check your network.");
      } else {
        setError("Error fetching nominees. Please try again.");
      }
    } finally {
      setLoadingNominee(false);
    }
  };

  useEffect(() => {
    const loadNominees = async () => {
      try {
        const deviceId = await getDeviceID();
        fetchNominees(deviceId);
      } catch (err) {
        console.error("Error getting device ID:", err);
      }
    };
    loadNominees();
  }, []);

  const handleAddNominee = (nominee) => {
    // If the nominee already exists (has both name and mobile number), add it.
    if (nominee.nomineeName && nominee.mobileNumber) {
      setNominees((prev) => [...prev, {nomineeName: nominee.nomineeName, mobileNumber: nominee.mobileNumber}]);
    }
  };

  const sendDeleteRequestToAPI = async (deviceId, mobileNumber) => {
    try {
      const payload = {
        token: deviceId,
        mobileNumber: mobileNumber,
      };
      console.log("Sending payload to DELETE API:", payload);
  
      const response = await fetch(
        "https://tw-central-apim.azure-api.net/user-service-twt/delete-nominee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
          },
          body: JSON.stringify(payload),
          timeout: 120000, // 2 minutes timeout
        }
      );
  
      // Read the response body as text (only once)
      const responseBody = await response.text();
  
      console.log(responseBody);
  
      // Success case
      console.log("Nominee deletion request sent to API successfully");
    } catch (error) {
      console.error("Error sending delete request to API:", error);
  
      // Handle specific network errors
      if (error.name === "AbortError") {
        console.error("Error", "Request timed out. Please try again.");
      } else if (error.message === "Network request failed") {
        console.error("Error", "No internet connection. Please check your network.");
      } else {
        console.error("Error", "Failed to send delete request to server.");
      }
    }
  };

  const handleDeleteNominee = async (index) => {
    const nomineeToDelete = nominees[index];
    const deviceId = connectedDevice?.id || (await getDeviceID());
    Alert.alert("Delete Nominee", "Are you sure you want to delete this nominee?", [
      {
        text: "Yes",
        onPress: async () => {
          try {
            // Send delete request to external API.
            await sendDeleteRequestToAPI(deviceId, nomineeToDelete.mobileNumber);
            // Delete nominee from local SQLite.
            await deleteNominee(deviceId, nomineeToDelete.mobileNumber);
            // Update state to remove nominee from UI.
            setNominees((prev) => prev.filter((_, i) => i !== index));
            console.log("Nominee deleted successfully");
          } catch (err) {
            console.error("Error deleting nominee:", err);
            Alert.alert("Error", "Failed to delete nominee.");
          }
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  const handleConnect = async () => {
    try {
      await connect();
      setStatus("Connecting...");
    } catch (error) {
      Alert.alert("Connection Failed", "Unable to connect to Bluetooth device.");
      setStatus("Not connected to Bluetooth. Please connect to add TwKidss.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Bluetooth Connection Status */}
      <View style={styles.connectionStatusContainer}>
        <Text style={connectedDevice ? styles.connectedText : styles.disconnectedText}>
          {status}
        </Text>
        {!connectedDevice && (
          <TouchableOpacity onPress={handleConnect} style={styles.connectButton}>
            <Text style={styles.connectButtonText}>Connect</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAction}></View>
        <Text style={styles.headerTitle}>Your Nominees</Text>
        <View style={styles.headerAction}></View>
      </View>

      {loadingNominee && <ActivityIndicator size="large" color="#000" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Nominee List */}
      <View style={styles.content}>
        <NomineeList nominees={nominees} handleDeleteNominee={handleDeleteNominee} />
      </View>

      {/* Add Nominee Button */}
      <View style={styles.contentFooter}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[
            styles.btn,
            !connectedDevice && { backgroundColor: "#ccc" }
          ]}
          disabled={!connectedDevice}
        >
          <Text style={styles.btnText}>
            Add Nominee
          </Text>
        </TouchableOpacity>
      </View>
      {/* Modal for Adding Nominee */}
      <AddNomineeForm
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
        handleAddNominee={handleAddNominee}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F8E6E6",
    padding: 0,
  },
  connectionStatusContainer: {
    padding: 16,
    backgroundColor: "#F6DADA",
    margin: 16,
    borderRadius: 10,
  },
  connectedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2A9D8F",
  },
  disconnectedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E63946",
    marginBottom: 10,
  },
  connectButton: {
    backgroundColor: "#F6B5B5",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  connectButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F6DADA",
    borderRadius: 10,
    margin: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },
  content: {
    padding: 16,
  },
  contentFooter: {
    marginTop: 24,
    alignItems: "center",
  },
  btn: {
    backgroundColor: "#F6B5B5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  btnText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
});

export default YourNominees;
