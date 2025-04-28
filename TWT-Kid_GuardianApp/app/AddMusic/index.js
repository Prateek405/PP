// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';
// import DocumentPicker from 'react-native-document-picker';

// const defaultAudioImage = require('../../asset/img/musicThumb.jpg');

// const App = () => {
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [saveDisabled, setSaveDisabled] = useState(true);

//   const selectFiles = async () => {
//     try {
//       const results = await DocumentPicker.pick({
//         type: [DocumentPicker.types.audio],
//         allowMultiSelection: true,
//       });

//       // Filter for MP3 files and log for debugging
//       const mp3Files = results.filter(file => file.name.endsWith('.mp3'));
//       console.log('Selected MP3 files:', mp3Files); // Log to check selection

//       // Update selectedFiles with both previous and new files
//       setSelectedFiles([...selectedFiles, ...mp3Files]);

//       if (mp3Files.length > 0) {
//         setSaveDisabled(false);
//       }
//     } catch (error) {
//       if (!DocumentPicker.isCancel(error)) {
//         console.log('Error selecting files:', error);
//       }
//     }
//   };

//   const removeFile = (index) => {
//     const updatedFiles = [...selectedFiles];
//     updatedFiles.splice(index, 1);
//     setSelectedFiles(updatedFiles);
//     if (updatedFiles.length === 0) {
//       setSaveDisabled(true);
//     }
//   };

//   useEffect(() => {
//     if (selectedFiles.length === 0) {
//       setSaveDisabled(true);
//     }
//   }, [selectedFiles]);

//   const playMusic = (fileUrl) => {
//     Linking.openURL(fileUrl);
//   };

//   const formatFileName = (fileName) => {
//     if (fileName.length > 28) {
//       return `${fileName.substring(0, 23)}...\n${fileName.substring(
//         fileName.length - 25
//       )}`;
//     } else {
//       return fileName.padEnd(28, '.');
//     }
//   };

//   const saveChanges = () => {
//     setSaveDisabled(true);
//     console.log('Selected files to save:', selectedFiles); // Log for debugging
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>Select Audio for Watch</Text>
//       <View style={styles.buttonContainer}>
//         <Button title="Select Files" onPress={selectFiles} color="#000000" />
//         <Button title="Upload" onPress={saveChanges} disabled={saveDisabled} color="#000000" />
//       </View>
//       <View style={styles.selectedFilesContainer}>
//         <Text style={styles.selectedFilesHeading}>Selected Files:</Text>
//         {selectedFiles.map((file, index) => (
//           <View key={index} style={[styles.fileContainer, file.selected && styles.fileContainerSelected]}>
//             <Image
//               source={file.hasThumbnail ? { uri: file.thumbnailPath } : defaultAudioImage}
//               style={styles.thumbnail}
//             />
//             <View style={styles.fileNameContainer}>
//               <TouchableOpacity onPress={() => playMusic(file.uri)}>
//                 <Text style={styles.selectedFileName}>{formatFileName(file.name)}</Text>
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity onPress={() => removeFile(index)}>
//               <Text style={styles.removeButton}>Remove</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#e8ecF4',
//     padding: 16,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginLeft:30,
//     marginRight:30,
//     marginBottom: 20,
//   },
//   selectedFilesContainer: {
//     marginTop: 20,
//   },
//   selectedFilesHeading: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//   },
//   fileContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 6,
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
//   },
//   fileContainerSelected: {
//     backgroundColor: '#e0e0e0',
//   },
//   thumbnail: {
//     width: 50,
//     height: 50,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   fileNameContainer: {
//     flex: 1,
//   },
//   selectedFileName: {
//     marginRight: 10,
//     color: '#333',
//     textDecorationLine: 'none',
//   },
//   removeButton: {
//     color: '#E53935',
//   },
// });

// export default App;