import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Animated, // Import Animated from React Native
  Easing, // Import Easing for animation
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";
import * as Keychain from "react-native-keychain";
import { decode } from "base-64";
global.atob = decode;

export default function Setup() {
  const router = useRouter();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;

  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation for planets rotating around the sun
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 10000, // 10 seconds for a full circle
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotationInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <ScrollView style={styles.safeArea}>
      <StatusBar
        animated={true}
        backgroundColor="#E1C6C7"
        barStyle="light-content"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Image
              style={[styles.logoImage, { backgroundColor: "transparent" }]} // Set transparent background
              source={require("../asset/icon/TW_Logo_Trust_Black_PNG.png")}
            />
            <Animated.View
              style={[
                styles.planetOrbit,
                { transform: [{ rotate: rotationInterpolation }] },
              ]}
            >
              <View style={styles.planet} />
            </Animated.View>
          </View>

          <Text style={styles.title}>
            Welcome to <Text style={{ color: "#0742fc" }}>Trusted Wearable</Text>
          </Text>

          <Text style={styles.subtitle}>
            Thank you for being a part of TW Family
          </Text>
          <Text style={styles.subtitle}>
            Please ensure the beautiful smartwatch you purchased is near your phone to complete the setup process
          </Text>
        </View>

        <View style={styles.form}>
          {errors.generic && (
            <Text style={styles.errorMessage}>{errors.generic}</Text>
          )}

          <View style={styles.formAction}>
            {loading ? (
              <ActivityIndicator size="large" color="#FFD1DC" />
            ) : (
              <TouchableOpacity onPress={() => router.push("./Validate")}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Continue Setup</Text>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.formActionSpacer} />
          </View>

          <Text style={styles.formFooter}>
            By clicking "Continue setup" above, you agree to TrustedWearable's
            <Text style={{ fontWeight: "600" }}> Terms & Conditions </Text>
            and
            <Text style={{ fontWeight: "600" }}> Privacy Policy</Text>.
          </Text>
        </View>
      </View>
      <StatusBar style="dark" />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8E7E8",
  },
  container: {
    padding: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    marginBottom: 20,
  },
  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#1d1d1d",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },
  header: {
    marginVertical: 36,
  },
  headerIcon: {
    alignSelf: "center",
    width: 100,
    height: 100,
    marginBottom: 69,
    backgroundColor: "transparent", // Set transparent background
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    alignSelf: "center",
    marginRight: 15,
  },
  planetOrbit: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  planet: {
    width: 20,
    height: 20,
    backgroundColor: "#FFA500",
    borderRadius: 10,
  },
  form: {
    marginBottom: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginVertical: 24,
  },
  formActionSpacer: {
    marginBottom: 10,
  },
  btn: {
    paddingVertical: 10,
    backgroundColor: "#FFD1DC",
    borderRadius: 10,
    padding: 40,
  },
  btnText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "700",
  },
  input: {
    marginBottom: 16,
  },
  inputControl: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "transparent",
    color: "#000",
  },
  inputFocused: {
    borderColor: "#ffd1dc",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  formFooter: {
    textAlign: "center",
    marginTop: 40,
    marginBottom: 8,
    color: "#404040",
    fontSize: 12,
  },
  errorMessage: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
});