// import React, { useState, useEffect, useCallback, useRef } from "react";
// import {
//   View,
//   Modal,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
// } from "react-native";
// import Clipboard from "@react-native-clipboard/clipboard";
// import { useRouter } from "expo-router";
// import {
//   RTCPeerConnection,
//   RTCSessionDescription,
//   mediaDevices,
// } from "react-native-webrtc";

// const configuration = {
//   iceServers: [
//     { urls: "stun:stun.l.google.com:19302" },
//     { urls: "stun:stun1.l.google.com:19302" },
//     { urls: "stun:stun2.l.google.com:19302" },
//     { urls: "stun:stun3.l.google.com:19302" },
//     { urls: "stun:stun4.l.google.com:19302" },
//   ],
// };
// // const iceServers = [
// //   { urls: "stun:bn-turn2.xirsys.com" },
// //   {
// //     urls: [
// //       "turn:bn-turn2.xirsys.com:80?transport=udp",
// //       "turn:bn-turn2.xirsys.com:3478?transport=udp",
// //       "turn:bn-turn2.xirsys.com:80?transport=tcp",
// //       "turn:bn-turn2.xirsys.com:3478?transport=tcp",
// //       "turns:bn-turn2.xirsys.com:443?transport=tcp",
// //       "turns:bn-turn2.xirsys.com:5349?transport=tcp",
// //     ],
// //     username:
// //       "CmuzOjzz6rF22e532rDyWG9xztn5VOiJHosrUUavii_Q1-E39RNdjDEG5AVuX4aFAAAAAGb7iKRBeXVzaA==",
// //     credential: "14f0eaac-7fb6-11ef-a4eb-0242ac140004",
// //   },
// // ];

// const HomeScreen = () => {
//   const [isJoinModalVisible, setIsJoinModalVisible] = useState(false);
//   const [offerSdp, setOfferSdp] = useState("");
//   const [localStream, setLocalStream] = useState(null);
//   const [remoteStream, setRemoteStream] = useState(null);
//   const router = useRouter();

//   const peerConnectionRef = useRef(null);
//   const isMounted = useRef(true);

//   const log = (...args) => console.log("WebRTC Log:", ...args);

//   const createPeerConnection = useCallback(() => {
//     const log = (...args) => console.log("[PeerConnection]", ...args);
//     log("Creating peer connection");

//     const pc = new RTCPeerConnection(configuration);

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         log("New ICE candidate:", event.candidate);
//       } else {
//         log("ICE candidate gathering completed");
//       }
//     };

//     pc.ontrack = (event) => {
//       log("Received remote track", event.track.kind);
//       setRemoteStream(event.streams[0]);
//     };

//     pc.onnegotiationneeded = () => {
//       log("Negotiation needed");
//       // You might want to start the offer process here
//     };

//     pc.oniceconnectionstatechange = () => {
//       log("ICE connection state:", pc.iceConnectionState);
//       // Handle different states if needed
//       switch (pc.iceConnectionState) {
//         case "failed":
//           log("ICE connection failed, you might want to restart ICE");
//           break;
//         case "disconnected":
//           log("ICE connection disconnected");
//           break;
//         case "closed":
//           log("ICE connection closed");
//           break;
//       }
//     };

//     pc.onsignalingstatechange = () => {
//       log("Signaling state:", pc.signalingState);
//     };

//     // Adding missing events
//     pc.onconnectionstatechange = () => {
//       log("Connection state:", pc.connectionState);
//       if (pc.connectionState === "failed") {
//         log("Connection failed, you might want to handle this");
//       }
//     };

//     pc.onicegatheringstatechange = () => {
//       log("ICE gathering state:", pc.iceGatheringState);
//     };

//     pc.onicecandidateerror = (event) => {
//       log("ICE candidate error:", event);
//     };

//     pc.ondatachannel = (event) => {
//       log("Data channel received:", event.channel.label);
//       // Handle the newly created data channel
//     };

//     peerConnectionRef.current = pc;
//     return pc;
//   }, [configuration, setRemoteStream]);

//   useEffect(() => {
//     isMounted.current = true;

//     return () => {
//       isMounted.current = false;
//       log("Component unmounting, cleaning up");
//       setTimeout(() => {
//         if (!isMounted.current && peerConnectionRef.current) {
//           peerConnectionRef.current.close();
//           peerConnectionRef.current = null;
//         }
//         if (!isMounted.current && localStream) {
//           localStream.getTracks().forEach((track) => track.stop());
//         }
//       }, 500);
//     };
//   }, [localStream]);

//   const getMedia = async () => {
//     try {
//       log("Getting user media");
//       const stream = await mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });
//       setLocalStream(stream);
//       return stream;
//     } catch (err) {
//       console.error("Error accessing media devices:", err);
//     }
//   };

//   const [isStartingCall, setIsStartingCall] = useState(false);

//   const startCall = async () => {
//     setIsStartingCall(true);
//     try {
//       log("Starting call");

//       if (peerConnectionRef.current) {
//         log("Previous connection found, closing it");
//         peerConnectionRef.current.close();
//         peerConnectionRef.current = null;
//       }

//       const pc = createPeerConnection();
//       const stream = await getMedia();

//       log("Adding tracks to peer connection");
//       stream.getTracks().forEach((track) => {
//         if (pc.signalingState !== "closed") {
//           pc.addTrack(track, stream);
//         }
//       });

//       log("Creating offer");
//       const offer = await pc.createOffer();

//       if (!isMounted.current) {
//         log("Component unmounted, aborting");
//         return;
//       }

//       log("Setting local description");
//       await pc.setLocalDescription(offer);

//       log("Offer created:", offer.sdp);
//       Clipboard.setString(offer.sdp);
//       alert("SDP offer copied to clipboard. Share it with the peer.");

//       router.push({
//         pathname: "VideoCall/VideoCallScreen",
//         params: {
//           localStream: stream.toURL(),
//           remoteStream: remoteStream ? remoteStream.toURL() : null,
//         },
//       });
//     } catch (error) {
//       console.error("Error starting the call:", error);
//       if (peerConnectionRef.current) {
//         log("Closing peer connection due to error");
//         peerConnectionRef.current.close();
//         peerConnectionRef.current = null;
//       }
//     } finally {
//       setIsStartingCall(false);
//     }
//   };

//   const joinCall = async () => {
//     if (!offerSdp) {
//       alert("SDP Offer is empty. Please paste a valid SDP offer.");
//       return;
//     }

//     try {
//       log("Joining call");
//       const pc = createPeerConnection();

//       const stream = await getMedia();
//       log("Adding tracks to peer connection");
//       stream.getTracks().forEach((track) => {
//         if (pc.signalingState !== "closed") {
//           pc.addTrack(track, stream);
//         }
//       });

//       log("Setting remote description");
//       const offer = new RTCSessionDescription({
//         type: "offer",
//         sdp: offerSdp,
//       });
//       await pc.setRemoteDescription(offer);

//       log("Creating answer");
//       const answer = await pc.createAnswer();
//       log("Setting local description");
//       await pc.setLocalDescription(answer);

//       log("Answer created:", answer.sdp);
//       Clipboard.setString(answer.sdp);
//       alert("Answer SDP copied to clipboard. Share it with the caller.");

//       router.push({
//         pathname: "VideoCall/VideoCallScreen",
//         params: {
//           localStream: stream.toURL(),
//           remoteStream: remoteStream ? remoteStream.toURL() : null,
//         },
//       });
//     } catch (error) {
//       console.error("Failed to join call:", error);
//       if (peerConnectionRef.current) {
//         log("Closing peer connection due to error");
//         peerConnectionRef.current.close();
//         peerConnectionRef.current = null;
//       }
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         <View style={styles.headerCard}>
//           <Text style={styles.headerText}>Video Call</Text>
//         </View>

//         <TouchableOpacity style={styles.mainButton} onPress={startCall}>
//           <Text style={styles.mainButtonText}>Start Call</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.mainButton, styles.bottomButton]}
//           onPress={() => setIsJoinModalVisible(true)}
//         >
//           <Text style={styles.mainButtonText}>Join Call</Text>
//         </TouchableOpacity>

//         <Modal visible={isJoinModalVisible} transparent={true}>
//           <View style={styles.modalContainer}>
//             <ScrollView style={styles.scrollContainer}>
//               <TextInput
//                 placeholder="Paste Offer SDP here"
//                 value={offerSdp}
//                 onChangeText={setOfferSdp}
//                 style={styles.input}
//                 multiline
//                 numberOfLines={4}
//                 textAlignVertical="top"
//               />
//             </ScrollView>
//             <TouchableOpacity style={styles.modalButton} onPress={joinCall}>
//               <Text style={styles.modalButtonText}>Join Call</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => {
//                 setIsJoinModalVisible(false);
//                 setOfferSdp("");
//               }}
//             >
//               <Text style={styles.modalButtonText}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </Modal>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//     backgroundColor: "#F5F7F8",
//   },
//   headerCard: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   headerText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//     textAlign: "center",
//   },
//   mainButton: {
//     backgroundColor: "#005EB8",
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 10,
//   },
//   mainButtonText: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: 18,
//   },
//   modalContainer: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     flex: 1,
//   },
//   scrollContainer: {
//     width: "100%",
//     maxHeight: "70%",
//   },
//   input: {
//     width: "100%",
//     padding: 10,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginBottom: 10,
//     height: 100,
//     textAlignVertical: "top",
//   },
//   modalButton: {
//     backgroundColor: "#005EB8",
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 10,
//     width: "100%",
//   },
// });

// export default HomeScreen;
