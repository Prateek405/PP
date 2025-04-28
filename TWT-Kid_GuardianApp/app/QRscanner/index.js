// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Alert } from 'react-native';
// import { Camera } from 'expo-camera';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import { setESimId } from '../../utils/sqlite.js';
// import {  useRouter } from "expo-router";

// const QRScannerComponent = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     requestCameraPermission();
//   }, []);

//   const requestCameraPermission = async () => {
//     try {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     } catch (error) {
//       console.error('Error requesting camera permission:', error);
//       Alert.alert('Error', 'Failed to request camera permission. Please try again.');
//     }
//   };

//   const handleBarCodeScanned = async ({ data }) => {
//     console.error('scanned data',data);
//     if (!scanned) {
//       setScanned(true);

//       // Assuming you have an API endpoint to store the QR code data
//       if (isValidESIMData(data)) {
//         try {
//          await setESimId(data);
//           console.log('Scanned eSIM Information:', data);
           
//           Alert.alert('eSIM is updated' );
//           router.push("/HomePage");
           

//         } catch (error) {
//           console.error('Error storing data:', error);
//           Alert.alert('Error', 'Failed to store eSIM data. Please try again.',error);
//         }
//       } else {
//         Alert.alert('Invalid QR Code', 'The scanned QR code does not contain valid eSIM data.');
//       }
//     }
//   };

//   // Helper function to check if the scanned data is valid eSIM data
//   const isValidESIMData = (data) => {
//     // logic to confirm or check  the scanned qr  is esim profile qr// commentout the below code or impliment new logic
//     // {
//     // const esimRegex = /^LPA:1\$prod\.smdp-plus\.rsp\.goog\$[A-Za-z0-9-]+$/;
//     // return esimRegex.test(data);
// //     }
//     return true;
//   };

//   const handleCameraPermissionDenied = () => {
//     Alert.alert(
//       'Camera Permission Denied',
//       'You have denied camera permissions. Please enable them in your device settings.'
//     );
//   };

//   if (hasPermission === null) {
//     return <View />;
//   }
//   if (hasPermission === false) {
//     return (
//       <View>
//         <Text>No access to camera</Text>
//         <TouchableOpacity onPress={() => requestCameraPermission()}>
//           <Text>Request Camera Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 20, color: '#3498db', fontWeight: 'bold' }}>
//         Center your QR-Code in frame
//       </Text>
//       { console.log('check log')}
//       <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} style={{ flex: 1 }} />

//       <TouchableOpacity
//         onPress={() => setScanned(false)}
//         style={{
//           padding: 15,
//           backgroundColor: '#3498db',
//           borderRadius: 10,
//           alignItems: 'center',
//           margin: 20,
//         }}
//       >
//         <Text style={{ color: 'white' }}>Scan Again</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default QRScannerComponent;
