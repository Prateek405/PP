// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, Dimensions } from "react-native";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import { getLatestKidsLocationData } from "../../utils/sqlite";
// import { useAppContext } from "./Card5";
// import { getDeviceID } from "../../utils/sharedData";

// const LocationCard = () => {
//   const [deviceID, setDeviceID] = useState(null);
//   const [locationData, setLocationData] = useState(null);
//   const [error, setError] = useState(null);
//   const { componentsDisabled } = useAppContext();

//   // useEffect to fetch the device ID
//   useEffect(() => {
//     const fetchDeviceID = async () => {
//       try {
//         const id = await getDeviceID();
//         if (id) {
//           console.log("Fetched Device ID:", id);
//           setDeviceID(id);
//         } else {
//           console.error("Device ID not found");
//           setError("Device ID not found");
//         }
//       } catch (err) {
//         console.error("Error fetching Device ID:", err);
//         setError("Unable to fetch device ID");
//       }
//     };

//     fetchDeviceID();
//   }, []);

//   // useEffect to fetch the latest location data when deviceID is available
//   useEffect(() => {
//     const fetchLocationData = async () => {
//       if (deviceID) {
//         try {
//           const data = await getLatestKidsLocationData(deviceID);
//           if (data && data.latitude && data.longitude) {
//             console.log("Fetched Location Data:", data);
//             setLocationData(data);
//             setError(null); // Clear any previous errors
//           } else {
//             console.error("No location data found");
//             setError("No location data found");
//           }
//         } catch (err) {
//           console.error("Error fetching location data:", err);
//           setError(err.message || "Failed to fetch location data");
//         }
//       } else {
//         console.error("Device ID is not set");
//         setError("Device ID is not set");
//       }
//     };

//     fetchLocationData();
//   }, [deviceID]);

//   // Define initial region based on fetched location data or default to San Francisco
//   const initialRegion = locationData && locationData.latitude && locationData.longitude
//     ? {
//         latitude: locationData.latitude,
//         longitude: locationData.longitude,
//         latitudeDelta: 0.005,
//         longitudeDelta: 0.005,
//       }
//     : {
//         latitude: 37.7749, // Default to San Francisco
//         longitude: -122.4194,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//       };

//   return (
//     <>
//       {componentsDisabled && (
//         <View style={styles.card}>
//           <Text style={styles.heading}>Location Tracker</Text>
//           <Text style={styles.subHeading}>
//             <Text style={{ color: "green" }}>Current location</Text> in green,{" "}
//             <Text style={{ color: "red" }}>historic</Text> in red
//           </Text>
//           {error && <Text style={styles.error}>{error}</Text>}
//           <MapView style={styles.map} initialRegion={initialRegion}>
//             {locationData && locationData.latitude && locationData.longitude && (
//               <Marker
//                 coordinate={{
//                   latitude: locationData.latitude,
//                   longitude: locationData.longitude,
//                 }}
//                 title="Current Location"
//                 pinColor="green"
//               />
//             )}
//             {/* If you have historic locations, you can add Polyline or additional Markers here */}
//           </MapView>
//         </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#F3E5AB",
//     padding: 20,
//     margin: 10,
//     borderRadius: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     width: Dimensions.get("window").width * 0.9,
//   },
//   heading: {
//     fontWeight: "bold",
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   subHeading: {
//     marginBottom: 10,
//   },
//   error: {
//     color: "red",
//     marginBottom: 10,
//   },
//   map: {
//     height: 300,
//     borderRadius: 10,
//   },
// });
// export default LocationCard;
