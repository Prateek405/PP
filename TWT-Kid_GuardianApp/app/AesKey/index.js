// import React, { useState, useEffect } from 'react';
// import { View, Text, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// import axios from 'axios';
// import * as Keychain from 'react-native-keychain';
// import { randomBytes } from 'react-native-randombytes';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";

// const App = () => {
//   const [deviceId, setDeviceId] = useState('');
//   const [nominees, setNominees] = useState([]);
//   const [aesKey, setAESKey] = useState(null);
//   const [loadingNominee, setLoadingNominee] = useState(false);
//   const [loadingAES, setLoadingAES] = useState(false);
//   const [error, setError] = useState(null);
//   const [showFullKey, setShowFullKey] = useState(false);
//   const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;

//   useEffect(() => {
//     const fetchDeviceIdFromKeyStore = async () => {
//       try {
//         const credentials = await Keychain.getGenericPassword({ service: 'deviceService' });
//         if (credentials) {
//           setDeviceId(credentials.password);
//           fetchNominees(credentials.password);
//         } else {
//           setDeviceId('1653435331');
//           fetchNominees('1653435331');
//         }
//       } catch (error) {
//         console.error('Error fetching deviceId from Keychain:', error);
//         setError('Failed to fetch DeviceId from Keychain');
//       }
//     };

//     const fetchAESKeyFromKeyStore = async () => {
//       try {
//         const aesCredentials = await Keychain.getGenericPassword({ service: 'aesService' });
//         if (aesCredentials) {
//           setAESKey(aesCredentials.password);
//         } else {
//           setAESKey(null); // No key exists
//         }
//       } catch (error) {
//         console.error('Error fetching AES key from Keychain:', error);
//         setError('Failed to fetch AES key from Keychain');
//       }
//     };

//     fetchDeviceIdFromKeyStore();
//     fetchAESKeyFromKeyStore();
//   }, []);

//   const fetchNominees = async (deviceId) => {
//     setLoadingNominee(true);
//     try {
//       const response = await axios.post(
//         'https://tw-central-apim.azure-api.net/user-service-twt/fetch_nominee_details',
//         { token: deviceId },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             "Ocp-Apim-Subscription-Key": subscriptionKey,
//           },
//           timeout: 120000, // 2 minutes timeout
//         }
//       );
//       setNominees(response.data);
//       setError(null);
//     } catch (error) {
//       if (error.code === 'ECONNABORTED') {
//         // Handle timeout specifically
//         console.error('Request timed out:', error);
//         setError('Request timed out. Please try again after 2 minutes.');
//       } else {
//         console.error('Error fetching nominees:', error);
//         setError('Error fetching nominees. Please try again.');
//       }
//     } finally {
//       setLoadingNominee(false);
//     }
//   };

//   const checkIfAESKeyExists = async () => {
//     try {
//       const key = await Keychain.getGenericPassword({ service: 'aesService' });
//       return key ? key.password : null;
//     } catch (error) {
//       console.error('Error checking for AES key:', error);
//       return null;
//     }
//   };

//   const generateAESKey = async () => {
//     const keyExists = await checkIfAESKeyExists();
//     if (keyExists) {
//       Alert.alert(
//         'Generate New Key',
//         'Generating a new key will delete all previous data. Are you sure you want to proceed?',
//         [
//           {
//             text: 'Cancel',
//             style: 'cancel',
//           },
//           {
//             text: 'Yes',
//             onPress: async () => {
//               await deleteAESKey(); // Delete the existing AES key
//               createAESKeyAndStore(); // Generate and store a new AES key
//             },
//           },
//         ]
//       );
//     } else {
//       createAESKeyAndStore(); // No key exists, generate and store a new one
//     }
//   };

//   const createAESKeyAndStore = async () => {
//     setLoadingAES(true);
//     try {
//       const randomBytesBuffer = await randomBytes(32);
//       const secretKey = Array.from(randomBytesBuffer)
//         .map(b => b.toString(16).padStart(2, '0'))
//         .join('');
//       await Keychain.setGenericPassword('aesKey', secretKey, { service: 'aesService' });
//       setAESKey(secretKey);
//       Alert.alert('Success', 'AES Key generated successfully.');
//     } catch (error) {
//       console.error('Error generating AES key:', error);
//       setError('Failed to generate AES key. Please try again.');
//     } finally {
//       setLoadingAES(false);
//     }
//   };

//   const deleteAESKey = async () => {
//     try {
//       await Keychain.resetGenericPassword({ service: 'aesService' });
//       setAESKey(null);
//       console.log('AES Key deleted successfully');
//     } catch (error) {
//       console.error('Error deleting AES key:', error);
//     }
//   };

//   const sendAESKeyToNominees = async () => {
//     if (!aesKey) {
//       Alert.alert('Error', 'No AES key available to send.');
//       return;
//     }
  
//     const message = `${aesKey}`;
  
//     Alert.alert(
//       'Send AES Key',
//       'Your AES key will be sent to all your nominees, which they can use to access Video and Audio in case of an emergency. Do you want to proceed?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Yes',
//           onPress: async () => {
//             try {
//               await axios.post(
//                 'https://tw-central-apim.azure-api.net/user-service-twt/send_mail_to_nominee',
//                 { token: deviceId, message },
//                 {
//                   headers: {
//                     'Content-Type': 'application/json',
//                     "Ocp-Apim-Subscription-Key": subscriptionKey,
//                   },
//                   timeout: 120000, // Optional: You can also set timeout here if needed
//                 }
//               );
//               Alert.alert('Success', 'AES Key sent to nominees successfully.');
//             } catch (error) {
//               if (error.code === 'ECONNABORTED') {
//                 // Handle timeout specifically
//                 console.error('Request timed out:', error);
//                 Alert.alert('Error', 'Request timed out. Please try again after 2 minutes.');
//               } else {
//                 console.error('Error sending AES key to nominees:', error);
//                 Alert.alert('Error', 'Failed to send AES key to nominees. Please try again.');
//               }
//             }
//           },
//         },
//       ]
//     );
//   };
  
//   const AESKeyDisplay = ({ aesKey }) => {
//     const obscuredKey = aesKey ? `${aesKey.slice(0, 4)}${'*'.repeat(aesKey.length - 8)}${aesKey.slice(-4)}` : '';
    
//     return (
//       <View style={styles.aesKeyContainer}>
//         <Text style={styles.aesKeyText}>
//           AES Key: {showFullKey ? aesKey : obscuredKey}
//         </Text>
//         <TouchableOpacity onPress={() => setShowFullKey(!showFullKey)} style={styles.viewIcon}>
//           <Icon name={showFullKey ? "eye-off" : "eye"} size={24} color="#333" />
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Nominee Details</Text>
//       {loadingNominee ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         nominees.length > 0 ? (
//           <View>
//             {nominees.map((nominee, index) => (
//               <View key={index} style={styles.nominee}>
//                 <Text style={styles.nomineeText}>Name: {nominee.nomineeName}</Text>
//                 <Text style={styles.nomineeText}>Email: {nominee.email}</Text>
//                 <Text style={styles.nomineeText}>Mobile: {nominee.mobileNumber}</Text>
//               </View>
//             ))}
//           </View>
//         ) : (
//           <Text>No Nominees Found</Text>
//         )
//       )}

//       {aesKey ? (
//         <AESKeyDisplay aesKey={aesKey} />
//       ) : (
//         <Text>No AES Key Available</Text>
//       )}

//       <TouchableOpacity style={styles.button} onPress={generateAESKey}>
//         <Text style={styles.buttonText}>Generate AES Key</Text>
//       </TouchableOpacity>

//       <TouchableOpacity 
//         style={[styles.button, !aesKey && { backgroundColor: '#ccc' }]} 
//         onPress={sendAESKeyToNominees} 
//         disabled={!aesKey}
//       >
//         <Text style={styles.buttonText}>Send AES Key to Nominees</Text>
//       </TouchableOpacity>

//       {loadingAES && <ActivityIndicator size="small" color="#0000ff" />}
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8E7E8',
//     padding: 16,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     marginTop: 10,
//     color: '#333',
//   },
//   nominee: {
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.18,
//     shadowRadius: 1.0,
//     elevation: 1,
//     marginBottom: 10,
//   },
//   nomineeText: {
//     color: '#333',
//   },
//   aesKeyContainer: {
//     marginTop: 20,
//   },
//   aesKeyText: {
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#FFD1DC',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 8,
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   errorText: {
//     color: 'red',
//     marginTop: 10,
//   },
//   aesKeyContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 8,
//     marginVertical: 10,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.23,
//     shadowRadius: 2.62,
//     elevation: 4,
//   },
//   aesKeyText: {
//     flex: 1,
//     fontWeight: 'bold',
//     color: '#333',
//     fontSize: 17,
//   },
//   viewIcon: {
//     padding: 5,
//   },
// });

// export default App;
