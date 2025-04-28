import React, { useState } from "react";
import * as Keychain from "react-native-keychain";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "expo-router";
import axios from "axios";
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchProfileData } from "../utils/syncFromCloud";
import { isProfileExist, setProfileData } from "../utils/sqlite";
import useBLE from "../utils/useBLE.js";

export default function Validate() {
  const navigation = useNavigation();
  const [deviceId, setDeviceId] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { connectandsync } = useBLE();


  useEffect(() => {
    try {
      connectandsync(true);
    } catch (error) {
      console.error("Bluetooth data sync error (ignored):", error);
    }
  }, []);


  const checkAndSaveProfile = async (deviceId) => {
    if (deviceId && !(await isProfileExist(deviceId))) {
      const data = await fetchProfileData(deviceId);
      if (Array.isArray(data) && data.length > 0 && data[0]) {
        await setProfileData(data[0]);
      }
    }
  };

  const saveTokenWithLabel = async (token, label) => {
    try {
      await Keychain.setGenericPassword("userToken", token, { service: label });
      console.log(`Token stored successfully with label: ${label}`);
    } catch (error) {
      console.error("Error storing the token:", error);
    }
  };

  const handleValidation = async () => {
    setErrors("");
    const trimmedDeviceId = deviceId.trim();

    if (!trimmedDeviceId) {
      setErrors("Device ID is required.");
      return;
    }

    const deviceIdPattern = /^[A-Za-z0-9\-]+$/;
    if (!deviceIdPattern.test(trimmedDeviceId)) {
      setErrors("Invalid Device ID format.");
      return;
    }

    if (!OCP_APIM_SUBSCRIPTION_KEY) {
      setErrors("Subscription key is not defined.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Subscription Key:", OCP_APIM_SUBSCRIPTION_KEY);
      console.log("Device ID:", trimmedDeviceId);

      const response = await axios.post(
        "https://tw-central-apim.azure-api.net/user-service-twt/validate-device",
        { deviceId: trimmedDeviceId },
        {
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": OCP_APIM_SUBSCRIPTION_KEY,
          },
          timeout: 120000,
        }
      );

      console.log("Validation Response:", response.data);

      // Save tokens
      await saveTokenWithLabel(trimmedDeviceId, "adtoken");
      await saveTokenWithLabel(trimmedDeviceId, "deviceId");

      const { deviceType, registrationComplete } = response.data;

      // **Handle device type properly**
      if (deviceType === "adult") {
        Alert.alert("Login Failed", "Your device is not a kid device.");
        return;
      }

      if (registrationComplete) {
        console.log("Device already in use, navigating to homepage");
        await checkAndSaveProfile(trimmedDeviceId);
        await AsyncStorage.setItem("loginPreference", "fingerprintOrPIN");
        navigation.navigate("LandingScreen/LandingScreen");
      } else {
        // Allow registration for a new device 
          navigation.navigate("Registration/Parent", { data: trimmedDeviceId });
      }
    } catch (error) {
      console.error("Validation error:", error);

      if (error.response) {
        console.error("Error data:", error.response.data);
      }

      const errorMessage =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "An unexpected error occurred. Please try again.";
      setErrors(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar animated backgroundColor="#E1C6C7" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Image
                style={styles.logoImage}
                source={require("../asset/icon/TW_Logo_Trust_Black_PNG.png")}
              />
            </View>
            <Text style={styles.title}>Enter Device ID</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Device ID</Text>
              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                onChangeText={setDeviceId}
                value={deviceId}
              />
            </View>
            {errors ? <Text style={styles.errorText}>{errors}</Text> : null}

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleValidation} disabled={isLoading}>
                <View style={styles.btn}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#000" />
                  ) : (
                    <Text style={styles.btnText}>Submit</Text>
                  )}
                </View>
              </TouchableOpacity>
              <View style={styles.formActionSpacer} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8E7E8",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  container: {
    marginTop: 40,
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
  header: {
    marginVertical: 36,
  },
  headerIcon: {
    alignSelf: "center",
    width: 100,
    height: 100,
    marginBottom: 36,
    backgroundColor: "#fff",
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
    marginVertical: 8,
  },
  input: {
    marginBottom: 8,
  },
  inputLabel: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "500",
    color: "#6b7280",
  },
  inputControl: {
    height: 44,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
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
    color: "#000",
  },
});
