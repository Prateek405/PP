// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, StyleSheet, Animated } from 'react-native';
// // import SplashScreenLib from 'react-native-splash-screen'; // Renamed to avoid confusion
// // import Logo from './logofile'; // Adjust the path to your logo file

// const SplashScreen = () => {
//   const [isLoading, setIsLoading] = useState(true);

//   const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity
//   const scaleAnim = useRef(new Animated.Value(0.5)).current; // Initial value for scale

//   useEffect(() => {
//     // Start the animation sequence
//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1500,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 3,
//         tension: 40,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       // Hide the splash screen after a brief delay
//       setTimeout(() => {
//         SplashScreenLib.hide();
//         setIsLoading(false);
//       }, 500);
//     });
//   }, [fadeAnim, scaleAnim]);

//   if (isLoading) {
//     return (
//       <View style={styles.container}>
//         <Animated.View
//           style={[
//             styles.logoContainer,
//             {
//               opacity: fadeAnim,
//               transform: [{ scale: scaleAnim }],
//             },
//           ]}
//         >
//           <Logo width={200} height={200} /> 
//         </Animated.View>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Welcome to the Main App!</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#FFD1DC', // pastel pink background
//   },
//   logoContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default SplashScreen;
