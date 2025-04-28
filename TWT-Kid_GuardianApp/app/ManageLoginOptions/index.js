import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const SetupFingerprintOrPIN = () => {
  const router = useRouter();

  const handleSetup = async () => {
    try {
      // Silently set the login preference.
      await AsyncStorage.setItem("loginPreference", "fingerprintOrPIN");
      // Navigate to LandingScreen.
      router.push("LandingScreen/LandingScreen");
    } catch (error) {
      console.error("Error saving login preference:", error);
      Alert.alert("Error", "There was a problem setting up device security.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../asset/icon/TW_Logo_Trust_Black_PNG.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Effortless and secure login—all in one convenient place!
          </Text>
        </View>

        <TouchableOpacity onPress={handleSetup}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Setup Biometric or PIN</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: "#F8E7E8",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 70,
    marginBottom: 20,
    marginRight: 20,
  },
  logo: {
    width: 100,
    height: 100,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 23,
    fontWeight: "900",
    color: "#2d3142",
    paddingHorizontal: 11,
    textAlign: "justify",
  },
  button: {
    backgroundColor: "#FFD1DC",
    paddingHorizontal: 25,
    paddingVertical: 11,
    borderRadius: 20,
    borderColor: "#557A95",
    borderWidth: 1,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

export default SetupFingerprintOrPIN;
