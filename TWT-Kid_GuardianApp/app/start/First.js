import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
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
    <>
      <StatusBar
        animated={true}
        backgroundColor="#E1C6C7"
        barStyle="light-content"
      />

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          {/* Logo */}
          <Image
            source={require("../../asset/icon/TW_Logo_Trust_Black_PNG.png")}
            style={styles.logo}
          />

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>The Long Wait is Over</Text>
            <Text style={styles.subTitle}>TwKids Kids Collection</Text>
          </View>

          {/* Image */}
          <Image
            source={require("../../asset/img/HandWatch.png")}
            style={styles.image}
          />

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>
              Now you can monitor your kids anytime anywhere and have peace of mind.
            </Text>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[styles.button, isPressed && styles.buttonPressed]}
            onPress={() => {
              router.push("start/Sixth");
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
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
    fontSize: 24,
    fontWeight: "900",
    color: "#2d3142",
  },
  subTitle: {
    fontSize: 18,
    color: "#5eab8b",
    fontWeight: "bold",
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  descriptionContainer: {
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: "#000",
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
    color: "#000", // Updated text color to black
  },
  buttonPressed: {
    borderWidth: 2,
    borderColor: "#265077", // Darker shade of blue when pressed
  },
});

export default StartScreen;
