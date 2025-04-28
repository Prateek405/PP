import { setProfileData, getProfileData } from "../../utils/sqlite.js";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";

export default function ProfileSetup() {
  const router = useRouter();
  const params = useLocalSearchParams();
  console.log(params);
  const deviceId = params.deviceId;
  const [name, setName] = useState(params.name);
  const [age, setAge] = useState(params.age);
  const [gender, setGender] = useState("male");
  // Removed: weight, height, fitnessFactor
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    // Clear previous errors
    const newErrors = {};

    // Validation checks
    if (!name) newErrors.name = "Please enter the name of your kid.";
    if (!age) newErrors.age = "Please enter the age of your kid.";
    // Removed: weight and height validation

    // If there are errors, update the state and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Submitting data:");
    console.log("Name:", name);
    console.log("Age:", age);
    console.log("Gender:", gender);
    // Removed: Weight, Height, FitnessFactor logs
    console.log("DeviceId:", deviceId);

    const data = {
      name,
      age,
      gender,
      deviceId,
      // Removed: weight, height, fitnessFactor
    };

    try {
      const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;
      const response = await axios.post(
        "https://tw-central-apim.azure-api.net/user-service-twt/profile-setup",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
          },
        }
      );
      if (response.status === 200) {
        setProfileData(data)
          .then(() => {
            console.log("Your profile is set:\n", data);
            router.push("start/First");
          })
          .catch((error) => {
            console.log(data);
            console.log("Error setting profile: " + error);
          });
      }
    } catch (error) {
      console.error("Error storing user data", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8E7E8" }}>
      <StatusBar
        animated={true}
        backgroundColor="#E1C6C7"
        barStyle="light-content"
      />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile Setup</Text>
          {/* Removed the subtitle line */}
        </View>
        <KeyboardAwareScrollView>
          <View style={styles.form}>
            {/* Name Field */}
            <View style={styles.input}>
              <Text style={styles.inputLabel}>What is your kid name?</Text>
              <TextInput
                onChangeText={setName}
                placeholder={name}
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                editable={false}
              />
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}
            </View>

            {/* Age Field */}
            <View style={styles.input}>
              <Text style={styles.inputLabel}>What is your kid age?</Text>
              <TextInput
                autoCapitalize="none"
                placeholder={String(age)} // Ensure age is passed as a string
                autoCorrect={false}
                keyboardType="numeric"
                onChangeText={setAge}
                style={styles.inputControl}
                editable={false}
              />
              {errors.age && <Text style={styles.error}>{errors.age}</Text>}
            </View>

            {/* Gender Field */}
            <View style={styles.input}>
              <Text style={styles.inputLabel}>What is your kid gender?</Text>
              <Picker
                style={styles.PickerControl}
                selectedValue={gender}
                onValueChange={(itemValue) => setGender(itemValue)}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
              {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
            </View>

            {/* Removed: Fitness Factor, Weight, and Height Fields */}

            {/* Submit Button */}
            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleSubmit}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Submit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  PickerControl: {
    height: 44,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 45,
    fontSize: 15,
    color: "#222",
  },
  header: {
    marginVertical: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1d1d1d",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#929292",
  },
  form: {
    paddingHorizontal: 24,
  },
  formAction: {
    marginVertical: 24,
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "#FFD1DC", // Button background color
    borderColor: "#007aff",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#000", // Button text color
  },
});