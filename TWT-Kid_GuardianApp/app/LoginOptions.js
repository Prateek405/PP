import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";
import * as Keychain from "react-native-keychain";
import useBLE from "../utils/useBLE.js";

const { connectandsync } = useBLE();


  useEffect(() => {
    try {
      connectandsync(true);
    } catch (error) {
      console.error("Bluetooth data sync error (ignored):", error);
    }
  }, []);

const LoginOptionsPage = ({ onSuccessfulLogin }) => {
  const router = useRouter();
  const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;

  // Flag to indicate that the authentication capability check is complete.
  const [authChecked, setAuthChecked] = useState(false);
  // Track the current security level on the device.
  const [authLevel, setAuthLevel] = useState(
    LocalAuthentication.SecurityLevel.NONE
  );
  // For easily referencing the enum.
  const { NONE, SECRET, BIOMETRIC, MULTIPLE_BIOMETRICS } =
    LocalAuthentication.SecurityLevel;

  // Check for hardware, enrollment, and then the enrolled security level.
  useEffect(() => {
    (async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (hasHardware && isEnrolled) {
          // Get the enrolled security level.
          const level = await LocalAuthentication.getEnrolledLevelAsync();
          setAuthLevel(level);
        } else {
          // If no hardware or enrollment exists, set authLevel to NONE to skip auth.
          setAuthLevel(NONE);
        }
      } catch (error) {
        console.error("Error checking authentication capabilities:", error);
        setAuthLevel(NONE);
      } finally {
        // Mark the authentication check as complete.
        setAuthChecked(true);
      }
    })();
  }, []);

  // If no security is enabled on the device (after checking), skip authentication and navigate.
  useEffect(() => {
    if (authChecked && authLevel === NONE) {
      getandsettoken();
     
      router.push("LandingScreen/LandingScreen");
    }
  }, [authLevel, authChecked]);

  // Removed auto-triggering of authentication.
  // Now, authentication will only be initiated when the user clicks the rendered button.

  // Trigger the authentication process.
  const handleAuthenticate = async () => {
    try {
      // Configure the prompt message based on the enrolled security type.
      const config = {
        promptMessage:
          authLevel === SECRET
            ? "Enter device passcode"
            : "Authenticate with Biometrics",
        disableDeviceFallback: false, // Allow fallback (PIN/pattern) if needed.
      };

      const result = await LocalAuthentication.authenticateAsync(config);
      if (result.success) {
        // On success, retrieve token, sync BLE, and navigate.
        getandsettoken();

        router.push("LandingScreen/LandingScreen");
      } else {
        Alert.alert("Authentication failed", "Please try again");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      Alert.alert("Error", "An error occurred during authentication");
    }
  };

  // Stub for token retrieval. Replace with your actual token logic.
  const getandsettoken = () => {
    // Example:
    // const storedCredentials = await Keychain.getGenericPassword({ service: 'your_service' });
    // ...
  };

  // Render button text based on the security level.
  const renderAuthButton = () => {
    switch (authLevel) {
      case SECRET:
        return "Unlock with PIN/Pattern/Password";
      case BIOMETRIC:
      case MULTIPLE_BIOMETRICS:
        return "Unlock with Biometric";
      default:
        return null;
    }
  };

  // Optionally, render a loading state while checking authentication capabilities.
  if (!authChecked) {
    return null;
  }

  // If no security is enabled, navigation is handled in useEffect, so return null.
  if (authLevel === NONE) {
    return null;
  }

  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor="#E1C6C7"
        barStyle="light-content"
      />
      <ScrollView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Image
                style={styles.logoImage}
                source={require("../asset/icon/TW_Logo_Trust_Black_PNG.png")}
              />
            </View>
            <Text style={styles.title}>
              Welcome to{" "}
              <Text style={{ color: "#0742fc" }}>Trusted Wearable</Text>
            </Text>
            <Text style={styles.subtitle}>
              Thank you for being a part of TW Family
            </Text>
          </View>

          {/* Button to trigger authentication popup manually */}
          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleAuthenticate}>
              <View style={[styles.btn, { marginBottom: 20 }]}>
                <Text style={styles.btnText}>{renderAuthButton()}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

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
    marginBottom: 36,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 16,
    marginRight: 15,
  },
  formAction: {
    marginVertical: 24,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#FFD1DC",
    borderColor: "#FFD1DC",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#000000",
  },
});

export default LoginOptionsPage;
