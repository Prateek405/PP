import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { useRouter } from "expo-router";

const StartScreen = () => {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require("../../asset/icon/TW_Logo_Trust_Black_PNG.png")}
          style={styles.logo}
        />

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Secure kids with GPS tracking and geofencing{"\n"}for peace of mind.
          </Text>
        </View>

        {/* Image */}
        <Image
          source={require("../../asset/img/Kid_new.png")}
          style={styles.image}
        />

        {/* Quote */}
        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>
            Empower your child's adventures with enhanced security.
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, isPressed && styles.buttonPressed]}
          onPress={() => {
            router.push("ManageLoginOptions");
          }}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    backgroundColor: "#F8E7E8", // Updated background color to pastel pink
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#000", // Text color set to black
    textAlign: "center",
  },
  image: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  quoteContainer: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  quote: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#000", // Text color set to black
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FFD1DC", // Updated button background color to pastel pink
    paddingHorizontal: 25,
    paddingVertical: 11,
    borderRadius: 20,
    borderColor: "#557A95",
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000", // Button text color set to black
  },
  buttonPressed: {
    borderWidth: 2,
    borderColor: "#265077", // Darker shade of blue when pressed
  },
});

export default StartScreen;
