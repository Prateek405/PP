// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   StatusBar,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";

// const SetupFingerprintOrPIN = () => {
//   const router = useRouter();

//   const handleSetup = async () => {
//     // Show confirmation dialog
//     Alert.alert(
//       "Confirm",
//       "Setting up fingerprint and PIN will grant access to anyone whose fingerprint is registered on the phone's setting. Do you want to confirm?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "OK",
//           onPress: async () => {
//             try {
//               await AsyncStorage.setItem("loginPreference", "fingerprintOrPIN");
//               Alert.alert("Success", "Fingerprint or PIN setup is complete!", [
//                 { text: "OK", onPress: () => console.log("Setup complete") },
//               ]);
//               router.push("./LandingScreen/LandingScreen");
//             } catch (error) {
//               console.error("Error saving login preference:", error);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleRemove = async () => {
//     // Show confirmation dialog
//     Alert.alert(
//       "Confirm",
//       "Removing Fingerprint or PIN will remove your finger unlock feature. You need User_Id and Password for Login. Do you want to confirm?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "OK",
//           onPress: async () => {
//             try {
//               await AsyncStorage.setItem("loginPreference", "no");
//               Alert.alert(
//                 "Success",
//                 "Fingerprint or PIN Removed Successfully",
//                 [{ text: "OK", onPress: () => console.log("Setup complete") }]
//               );
//               router.push("./LandingScreen/LandingScreen");
//             } catch (error) {
//               console.error("Error saving login preference:", error);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const dontShowAgain = async () => {
//     try {
//       await AsyncStorage.setItem("wantToSee", "No");
//       router.push("./LandingScreen/LandingScreen");
//     } catch (error) {
//       console.error("Error saving login preference:", error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.scrollViewContainer}>
//       <StatusBar
//         animated={true}
//         backgroundColor="#E1C6C7"
//         barStyle="light-content"
//       />
//       <View style={styles.container}>
//         <View style={styles.logoContainer}>
//           {/* Logo */}
//           <Image
//             source={require("../asset/icon/TW_Logo_Trust_Black_PNG.png")}
//             style={styles.logo}
//           />
//         </View>

//         <View style={styles.titleContainer}>
//           <Text style={styles.title}>
//             Effortless and secure login—all in one convenient place!
//           </Text>
//         </View>

//         {/* <View style={styles.quoteContainer}>
//           <Text style={styles.quote}>
//             To avoid future reminders, click{" "}
//             <Text style={{ color: "#0742fc" }}>Do not show again</Text>. For
//             hassle-free login next time, click{" "}
//             <Text style={{ color: "#0742fc" }}>Setup Fingerprint and PIN</Text>{" "}
//             or Login. To remove fingerprint login, click{" "}
//             <Text style={{ color: "#0742fc" }}>Remove Fingerprint and PIN</Text>
//             . You will then only have the userid and password login option.
//           </Text>
//         </View> */}

//         {/* Buttons */}
//         <TouchableOpacity onPress={dontShowAgain}>
//           <View style={styles.button}>
//             <Text style={styles.buttonText}>Do not show again</Text>
//           </View>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleSetup}>
//           <View style={styles.button}>
//             <Text style={styles.buttonText}>Setup Fingerprint or PIN</Text>
//           </View>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={handleRemove}>
//           <View style={styles.button}>
//             <Text style={styles.buttonText}>
//               Remove Fingerprint or PIN Setup
//             </Text>
//           </View>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollViewContainer: {
//     flexGrow: 1,
//     backgroundColor: "#F8E7E8", // Pastel pink background
//   },
//   container: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logoContainer: {
//     alignItems: "center",
//     marginTop: 70,
//     marginBottom: 20,
//     marginRight: 20,
//   },
//   logo: {
//     width: 100,
//     height: 100,
//   },
//   titleContainer: {
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   title: {
//     fontSize: 23,
//     fontWeight: "900",
//     color: "#2d3142",
//     paddingHorizontal: 11,
//     textAlign: "justify",
//   },
//   subTitle: {
//     fontSize: 19,
//     color: "#5eab8b",
//     fontWeight: "bold",
//   },
//   image: {
//     width: 230,
//     height: 220,
//     marginBottom: 20,
//   },
//   quoteContainer: {
//     alignItems: "center",
//     marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   quote: {
//     fontSize: 17,
//     fontStyle: "italic",
//     color: "#000", // Black text color
//     paddingHorizontal: 13,
//     textAlign: "justify",
//   },
//   button: {
//     backgroundColor: "#FFD1DC", // Pastel pink button background
//     paddingHorizontal: 25,
//     paddingVertical: 11,
//     borderRadius: 20,
//     borderColor: "#557A95",
//     borderWidth: 1,
//     marginBottom: 10,
//   },
//   buttonText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000", // Black text color
//   },
// });

// export default SetupFingerprintOrPIN;
