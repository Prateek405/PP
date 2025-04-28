// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Image } from 'react-native';
// import BluetoothVibrateIcon from './BluetoothVibrate';
// import { useRouter } from "expo-router";
// import closeIcon from './imageOfComponent/close-icon.png'; // Make sure the path is correct

// const BluetoothNotification = ({ connectedDevice, connectedDeviceFromDB }) => {
//   const [showNotification, setShowNotification] = useState(false);
//   const [isDismissed, setIsDismissed] = useState(false);
//   const slideAnim = useRef(new Animated.Value(-200)).current;
//   const router = useRouter();

//   useEffect(() => {
//     if (!isDismissed && !connectedDevice && !connectedDeviceFromDB) {
//       setShowNotification(true);
//       Animated.timing(slideAnim, {
//         toValue: 0,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [connectedDevice, connectedDeviceFromDB, isDismissed, slideAnim]);

//   return (
//     <Modal
//       transparent={true}
//       visible={showNotification}
//       onRequestClose={() => setShowNotification(false)}
//     >
//       <View style={styles.modalBackground}>
//         <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
//           <TouchableOpacity
//             style={styles.closeIcon}
//             onPress={() => {
//               setIsDismissed(true);
//               setShowNotification(false);
//             }}
//           >
//             <Image source={closeIcon} style={styles.icon} />
//           </TouchableOpacity>
//           <View style={styles.stripContent}>
//             <BluetoothVibrateIcon style={styles.bluetoothIcon} />
//             <View style={styles.textContainer}>
//               <TouchableOpacity>
//                 <Text style={styles.errorStripSubtitle}>
//                   Your Bluetooth is not connected
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//           <TouchableOpacity
//             style={styles.btn}
//             onPress={() => {
//               router.push("/BluetoothMenu");
//             }}
//           >
//             <Text style={styles.errorBtnText}>Connect</Text>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     backgroundColor: '#FFF5F5',
//     borderRadius: 10,
//     padding: 20,
//     marginHorizontal: 10,
//     marginTop: 40,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     width: '87%',
//     position: 'relative',
//   },
//   closeIcon: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 1,
//   },
//   stripContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 7,
//     marginTop: 2,
//   },
//   bluetoothIcon: {
//     marginRight: 10,
//   },
//   textContainer: {
//     flex: 1,
//     marginLeft: 0,
//   },
//   errorStripSubtitle: {
//     fontSize: 14,
//     color: '#D32F2F',
//     paddingVertical: 5,
//     textAlign: 'center',
//   },
//   btn: {
//     backgroundColor: '#D32F2F',
//     borderRadius: 20,
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     marginVertical: 20,
//     alignSelf: 'center',
//   },
//   errorBtnText: {
//     color: '#FFF',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   icon: {
//     width: 20,
//     height: 20,
//   },
// });

// export default BluetoothNotification;
