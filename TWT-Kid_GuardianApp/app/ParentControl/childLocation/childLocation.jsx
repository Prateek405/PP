import React, { useState, useEffect } from "react";
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Text, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRouter } from "expo-router"; // Import useRouter
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";
import { getDeviceID } from "../../../utils/sharedData";

const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;

const ChildLocation = ({ navigation }) => {
  const [latitude, setLatitude] = useState(28.7041);
  const [longitude, setLongitude] = useState(77.1025);
  const [deviceId, setDeviceId] = useState(getDeviceID());
  const [loading, setLoading] = useState(false);

  // Custom marker view
  const customMarkerView = () => (
    <Image
      source={require("../../../asset/img/Marker.png")}
      style={styles.customMarker}
    />
  );

  // Fetch location data from the API
  const fetchLocation = async () => {
    if (loading) return; // Prevent multiple simultaneous calls
    setLoading(true);

    try {
      payload=JSON.stringify({ token: deviceId["_j"] })
      console.log("Sending payload: ", payload)
      const response = await fetch(
        `https://tw-central-apim.azure-api.net/user-service-twt/get-latest-gps-data-guardian`,
        {
          method: "POST", // Use POST method as per backend
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
          },
          body: payload, // Send deviceId as token
        }
      );

      // Parse the JSON response
      const data = await response.json();

      // Check HTTP response status

      if (response.status === 400) {
        throw new Error(data.message || "Invalid input. Please check your Device ID.");
      } else if (response.status === 404) {
        throw new Error(data.message || "No GPS data found for this device.");
      } else if (response.status !== 200) {
        throw new Error(data.message || "An unexpected error occurred.");
      }

      // Validate API response
      if (data && typeof data.Latitude === "number" && typeof data.Longitude === "number") {
        setLatitude(data.Latitude);
        setLongitude(data.Longitude);
      } else {
        throw new Error("Invalid data received from the server.");
      }
    } catch (error) {
      console.error("Error fetching location:", error.message);
      Alert.alert("Error", error.message); // Show user-friendly error message
    } finally {
      setLoading(false);
    }
  };

  // Fetch location on component mount and every 30 seconds
  useEffect(() => {
    fetchLocation(); // Fetch initial location on component mount
    const intervalId = setInterval(fetchLocation, 30000); // Fetch location every 30 seconds
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../../../asset/icon/chevron-left.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>

      {/* Map View */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: latitude, longitude: longitude }}
          title="Guardians of Joy"
          description="Your joy, your heart, your little star – your kid is here, a treasure held dear."
        >
          {customMarkerView()}
        </Marker>
      </MapView>

      {/* Update Location Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={fetchLocation}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Update Location"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCE4EC", // Pastel pink background
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  customMarker: {
    width: 40,
    height: 50,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    borderColor: "#F8BBD0", // Pastel pink border
    borderWidth: 2,
  },
  button: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#FF4081", // Hot pink button
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ChildLocation;