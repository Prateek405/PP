// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, Animated, Easing, StyleSheet,Image } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
// // import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import bluetooth_icon from './imageOfComponent/bluetooth.png'
// import { useRouter } from "expo-router";

// const BluetoothVibrateIcon = ({ isConnected }) => {
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   const [showNotification, setShowNotification] = useState(false);
//   const [showText, setShowText] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const startVibration = () => {
//       Animated.loop(
//         Animated.sequence([
//           Animated.timing(scaleAnim, {
//             toValue: 1.1,
//             duration: 1000,
//             easing: Easing.linear,
//             useNativeDriver: true,
//           }),
//           Animated.timing(scaleAnim, {
//             toValue: 0.9,
//             duration: 1000,
//             easing: Easing.linear,
//             useNativeDriver: true,
//           }),
//           Animated.timing(scaleAnim, {
//             toValue: 1,
//             duration: 1000,
//             easing: Easing.linear,
//             useNativeDriver: true,
//           }),
//         ])
//       ).start();
//     };

//     startVibration();
//   }, [scaleAnim, isConnected]);

//   return (
//     <View style={styles.container}>
//       {showText && <Text style={styles.notificationText}>Bluetooth is not connected</Text>}
//       <View style={styles.iconContainer}>
//         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//           <TouchableOpacity
          
//           Style={styles.btn}
//           onPress={() => {
//             router.push("/BluetoothMenu");
//           }}
      
//           >
//             <Image source={bluetooth_icon}  style={styles.icon}  color={isConnected ? '#388E3C':'#D32F2F'} />
//           {/* <Icon
//             name="bluetooth"
//             size={30}
//             color={isConnected ? '#388E3C':'#D32F2F' }
//           /> */}

//           </TouchableOpacity>
//         </Animated.View>
//         {!isConnected && showNotification}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     marginRight: 10,
//     position: 'relative',
//   },
//   notificationDot: {
//     position: 'absolute',
//     top: -5,
//     right: -5,
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: '#D32F2F',
//   },
//   notificationText: {
//     fontSize: 12,
//     color: '#D32F2F',
//     marginRight: 5,
//   },
//   icon: {
   
//     width: 25,
//     height: 25,
    
//   },
// });

// export default BluetoothVibrateIcon;
