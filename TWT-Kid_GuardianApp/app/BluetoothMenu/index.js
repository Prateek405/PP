import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";
import { useRouter } from "expo-router";
import useBLE from "../../utils/useBLE.js";

function BluetoothMenu() {
  // Destructure `pairAgain` from the hook along with existing functions/state.
  const { connectandsync, connectedDevice, pairAgain } = useBLE();
  const navigation = useRouter();

  // UI states
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusText, setStatusText] = useState("No device connected");

  // (Optional) Spinner animation commented out below:
  // const spinValue = useRef(new Animated.Value(0)).current;
  // useEffect(() => {
  //   const spinAnimation = () => {
  //     spinValue.setValue(0);
  //     Animated.timing(spinValue, {
  //       toValue: 1,
  //       duration: 5000,
  //       easing: Easing.linear,
  //       useNativeDriver: true,
  //     }).start(spinAnimation);
  //   };
  //   spinAnimation();
  // }, [spinValue]);

  // const spin = spinValue.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ["0deg", "360deg"],
  // });

  // Function to attempt connection with a timeout
  const attemptConnection = async () => {
    setIsConnecting(true);
    setErrorMessage("");
    setStatusText("Attempting to connect...");

    // Optional: set up a 10-second timeout
    let connectTimeout = setTimeout(() => {
      if (!connectedDevice) {
        setIsConnecting(false);
        setErrorMessage("Connection timed out. Please ensure your watch is in range.");
        setStatusText("Connection failed");
      }
    }, 10000);

    try {
      await connectandsync();
      clearTimeout(connectTimeout);
      setStatusText("Connected");
    } catch (err) {
      clearTimeout(connectTimeout);
      console.log("Connection error in UI:", err);
      setIsConnecting(false);
      setErrorMessage(err.message || "Connection failed");
      setStatusText("Connection failed");
    }
  };

  // Auto-connect on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      attemptConnection();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // If we detect that `connectedDevice` has been set, show status text
  useEffect(() => {
    if (connectedDevice) {
      setIsConnecting(false);
      setStatusText("Connected to " + (connectedDevice.name || "Unknown device"));
    }
  }, [connectedDevice]);

  // Handler to reconnect (or initially connect)
  const handleReconnect = () => {
    attemptConnection();
  };

  // Handler to trigger pair again which clears existing bond and scans for a new connection
  const handlePairAgain = async () => {
    try {
      // Passing 'true' if you need to sync data as soon as pairing is complete.
      await pairAgain(true);
    } catch (err) {
      console.error("Pair again error:", err);
      setErrorMessage(err.message || "Pairing failed");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Bluetooth Settings</Text>
          <View style={{ width: 24, height: 24 }} />
        </View>

        <View style={styles.container}>
          <Text style={styles.status}>{statusText}</Text>

          {/* Display current paired device details if available */}
          {connectedDevice && (
            <View style={styles.deviceDetails}>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Device Name: </Text>
                {connectedDevice.name || "Unknown"}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.label}>Device ID: </Text>
                {connectedDevice.id}
              </Text>
            </View>
          )}

          {/* Show error message if any */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Optionally show spinner while connecting */}
          {/* {isConnecting && (
            <View style={styles.loadingContainer}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Svg width={60} height={60} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M6 4C7.67 2.75 9.75 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 10.19 2.48 8.49 3.33 7.02L12 12"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    opacity="0.4"
                    d="M6.83 8.96C6.3 9.85 6 10.89 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6C11.09 6 10.22 6.2 9.45 6.57"
                    stroke="#292D32"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </Animated.View>
            </View>
          )} */}

          {/* Show the Reconnect button if not connecting and no device connected */}
          {!isConnecting && !connectedDevice && (
            <TouchableOpacity style={styles.button} onPress={handleReconnect}>
              <Text style={styles.buttonText}>Reconnect</Text>
            </TouchableOpacity>
          )}

          {/* Show "Pair Again" button if a device is already connected */}
          {connectedDevice && (
            <TouchableOpacity style={styles.button} onPress={handlePairAgain}>
              <Text style={styles.buttonText}>Pair Again</Text>
            </TouchableOpacity>
          )}

          {/* Example: Show a button to request watch data if connected */}
          {connectedDevice && (
            <TouchableOpacity style={styles.button} onPress={() => console.log("Request Watch Data")}>
              <Text style={styles.buttonText}>Request Watch Data</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default BluetoothMenu;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8E7E8",
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#444",
  },
  container: {
    paddingHorizontal: 20,
  },
  status: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 10,
  },
  deviceDetails: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  detailText: {
    fontSize: 16,
    marginVertical: 2,
  },
  label: {
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "#FFE6E6",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: "#D00",
    fontSize: 16,
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#ff85a2",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
