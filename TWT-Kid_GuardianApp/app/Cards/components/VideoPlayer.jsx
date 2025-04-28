// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

// const VideoPlayer = () => {
//   // Function to handle button press and open the URL
//   const handlePress = () => {
//     const url = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
//     Linking.openURL(url).catch((err) =>
//       console.error("Failed to open URL:", err)
//     );
//   };

//   return (
//     <View style={styles.inputBoxContainer}>
//       <TouchableOpacity onPress={handlePress} style={styles.dateButton}>
//         <Text style={styles.dateButtonText}>Open Video</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   inputBoxContainer: {
//     marginTop: 0,
//   },
//   dateButton: {
//     backgroundColor: "#FF85A1",
//     borderRadius: 10,
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     alignItems: "center",
//   },
//   dateButtonText: {
//     color: "#ffffff",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });

// export default VideoPlayer;
