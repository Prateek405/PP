// // this component is udsed for device validation 

// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Alert } from 'react-native';
// import { Camera } from 'expo-camera';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import {  useNavigation } from "expo-router";
// import axios from 'axios';
// import * as Keychain from "react-native-keychain";



// const QRScannerComponent = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const navigation = useNavigation();

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

//   const handleBarCodeScanned = async ( deviceIdData ) => {
//     console.error('scanned data' ,deviceIdData.data);
    
//     if (!scanned) {
//       setScanned(true);
//       const data =  deviceIdData.data ;
//       // alert(JSON.stringify(data, null, 2));

//       // Assuming you have an API endpoint to validate the QR code data
      
//         try {
//           const response = await axios.post(
//             'https://tw-central-apim.azure-api.net/user-service-twt/validate-device',
//             { device_id: deviceIdData.data },
//             {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             }
//         );
  
//         console.log('validation  successful:', response.data);
  
//         // Navigate to the next screen after successful submission
        
//         navigation.navigate("Registration/Parent", { data });
           

//         } catch (error) {
//           console.error('Error scanning device id:', error);
//           Alert.alert('Error', 'Failed to validate the device. Please try again.',error);
//         }
      
//     }
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
