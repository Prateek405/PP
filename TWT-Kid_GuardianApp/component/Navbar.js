// import { Link } from "expo-router";
// import { StyleSheet, TouchableOpacity } from "react-native";
// import { View, Text, Image } from "react-native";
// import { bgColor, textColor } from "../app/constant/Color";

// const Navbar= ({setShowNav, survillianceNav})=>{
//     return (
//     <>
//         <View style={styles.navbarContainer} >
//             <Text  style={{...styles.links, ...styles.linkButton}}  onPress={()=>{setShowNav(false)}} href={'/HomePage'} > Home </Text> 
//             <Text  style={{...styles.links, ...styles.linkButton}}  onPress={survillianceNav} > Survilliance </Text> 
//             <TouchableOpacity style={styles.links} onPress={()=>{setShowNav(false)}} >
//             <Link  style={styles.linkButton} href={'/Update_password'} > Change Password </Link> 
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.links} onPress={()=>{setShowNav(false)}} >
//             <Link   style={styles.linkButton}  href={'/Login'} > Logout </Link> 
//             </TouchableOpacity>
//             <TouchableOpacity onPress={()=>{ setShowNav(false) }} >
//             <Image  style={styles.close} source={require('../asset/icon/close.png')} />
//             </TouchableOpacity>
//         </View>
//     </>
//     )
// }

// export default Navbar;

// const styles= StyleSheet.create({
//     navbarContainer: {
//         display: "flex",
//         width: "100%",
//         height: "100%",
//         backgroundColor: bgColor,
//         justifyContent: "center",
//         alignItems: "center",
//         gap: 20,
//     },
//     links: {
//         width: "80%",
//         padding: 10,
//         backgroundColor: "black",
//         borderRadius: 10,
//     },
//     linkButton: {
//         textAlign: "center",
//         color: textColor,
//         fontSize: 17,
//     },
//     close: {
//         // marginBottom: 50,
//         width: 50,
//         height: 50,
//         tintColor: "black",
//         borderColor: "white",
//         backgroundColor: "white",
//         borderRadius: 25,
//     }
// })