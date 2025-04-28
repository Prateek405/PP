// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";

// import { useRouter } from "expo-router";

// const StartScreen = () => {
//   const router = useRouter();
//   const [isPressed, setIsPressed] = useState(false);

//   const handlePressIn = () => {
//     setIsPressed(true);
//   };

//   const handlePressOut = () => {
//     setIsPressed(false);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//       <View style={styles.container}>
//         {/* Logo */}
//         <Image
//           source={require("../../asset/icon/TW_Logo_Trust_Black_PNG.png")}
//           style={styles.logo}
//         />

//         {/* Title */}
//         <View style={styles.titleContainer}>
//           <Text style={styles.title}>
//             Breathe easy, live freely with TrustedWearTech.
//           </Text>
//         </View>

//         {/* Image */}
//         <Image
//           source={require("../../asset/img/Watch3.png")}
//           style={styles.image}
//         />

//         {/* Description */}
//         <View style={styles.descriptionContainer}>
//           <Text style={styles.description}>
//             Monitor your SpO2 levels accurately. Stay informed about your
//             oxygen saturation whether you're active, resting, or recovering.
//           </Text>
//         </View>

//         {/* Button */}
//         <TouchableOpacity
//           style={[styles.button, isPressed && styles.buttonPressed]}
//           onPress={() => {
//             router.push("./Fifth");
//           }}
//           onPressIn={handlePressIn}
//           onPressOut={handlePressOut}
//         >
//           <Text style={styles.buttonText}>Continue</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollViewContainer: {
//     flexGrow: 1,
//     backgroundColor: "#F8E7E8", // Updated background color to pastel pink
//   },
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logo: {
//     width: 100,
//     height: 100,
//     marginBottom: 20,
//   },
//   titleContainer: {
//     alignItems: "center",
//     marginBottom: 15,
//     marginHorizontal: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "900",
//     color: "#2d3142",
//     textAlign: "center",
//   },
//   image: {
//     width: 280, // Increased width
//     height: 270, // Increased height
//     marginBottom: 20,
//   },
//   descriptionContainer: {
//     alignItems: "center",
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   description: {
//     fontSize: 16,
//     color: "#000", // Updated text color to black
//     textAlign: "center",
//   },
//   button: {
//     backgroundColor: "#FFD1DC", // Updated button background color to pastel pink
//     paddingHorizontal: 25,
//     paddingVertical: 11,
//     borderRadius: 20,
//     borderColor: "#557A95",
//     borderWidth: 1,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000", // Updated text color to black
//   },
//   buttonPressed: {
//     borderWidth: 2,
//     borderColor: "#265077", // Darker shade of blue when pressed
//   },
// });

// export default StartScreen;
