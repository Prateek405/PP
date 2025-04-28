// import React, { useEffect, useState, useRef } from "react";
// import { View, TouchableOpacity, StyleSheet } from "react-native";

// import {
//   RTCView,
//   mediaDevices,
//   ScreenCapturePickerView,
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   MediaStream,
//   MediaStreamTrack,
//   registerGlobals,
// } from "react-native-webrtc";
// import { useLocalSearchParams } from "expo-router";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { useRouter } from "expo-router";

// const VideoCallScreen = () => {
//   const router = useRouter();
//   const { remoteStream } = useLocalSearchParams(); // Only use remoteStream here
//   const [localStreamState, setLocalStreamState] = useState(null);
//   const [remoteStreamState, setRemoteStreamState] = useState(null);

//   const localStreamRef = useRef(null);
//   const remoteStreamRef = useRef(null);

//   let mediaConstraints = {
//     audio: true,
//     video: {
//       frameRate: 30,
//       facingMode: "user",
//     },
//   };

//   useEffect(() => {
//     const startLocalStream = async () => {
//       const stream = await mediaDevices.getUserMedia(mediaConstraints);
//       localStreamRef.current = stream; // Reference to local stream
//       setLocalStreamState(stream); // Set local stream state
//     };

//     startLocalStream();

//     // Clean up the local stream on component unmount
//     return () => {
//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   // Handle remote stream when available
//   useEffect(() => {
//     if (remoteStream) {
//       remoteStreamRef.current = remoteStream; // Reference to remote stream
//       setRemoteStreamState(remoteStream); // Set remote stream state
//     }
//   }, [remoteStream]);

//   const endCall = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => track.stop());
//     }
//     if (remoteStreamRef.current) {
//       remoteStreamRef.current.getTracks().forEach((track) => track.stop());
//     }

//     console.log("Call ended");
//     router.push("VideoCall/HomeScreen");
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.videoContainer}>
//         {remoteStreamState ? (
//           <>
//             <RTCView
//               streamURL={remoteStreamState.toURL()}
//               style={styles.remoteVideo}
//               objectFit="cover"
//             />
//             {localStreamState && (
//               <View style={styles.localVideoContainer}>
//                 <RTCView
//                   streamURL={localStreamState.toURL()}
//                   style={styles.localVideo}
//                   objectFit="cover"
//                 />
//               </View>
//             )}
//           </>
//         ) : (
//           localStreamState && (
//             <RTCView
//               streamURL={localStreamState.toURL()}
//               style={styles.fullscreenVideo}
//               objectFit="cover"
//             />
//           )
//         )}
//       </View>

//       <View style={styles.controls}>
//         <TouchableOpacity onPress={endCall} style={styles.iconButton}>
//           <FontAwesome name="phone" size={30} color="white" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000",
//   },
//   videoContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   fullscreenVideo: {
//     width: "100%",
//     height: "100%",
//     backgroundColor: "#000",
//   },
//   remoteVideo: {
//     width: "100%",
//     height: "100%",
//     backgroundColor: "#000",
//   },
//   localVideoContainer: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//     width: 120,
//     height: 160,
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   localVideo: {
//     width: "100%",
//     height: "100%",
//     backgroundColor: "#000",
//   },
//   controls: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     paddingVertical: 15,
//     backgroundColor: "#333",
//   },
//   iconButton: {
//     padding: 15,
//     borderRadius: 50,
//     backgroundColor: "#555",
//   },
// });

// export default VideoCallScreen;
