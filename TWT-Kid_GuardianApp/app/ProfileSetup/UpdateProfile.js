import { updateProfileData, getProfileData } from "../../utils/sqlite.js";
import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { Alert } from "react-native";
import { getDeviceID } from "../../utils/sharedData";

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
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";

export default function ProfileSetup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [fitnessFactor, setFitnessFactor] = useState(1.0);
  const [errors, setErrors] = useState({});
  const deviceId = getDeviceID();

  // Fetch profile data on component mount
  useEffect(() => {
    const ProfileData = async () => {
      try {
        const data = await getProfileData(null);
        if (data) {
          setName(data.name);
          setAge(data.age);
          setGender(data.gender);
          setHeight(data.height);
          setWeight(data.weight);
        }
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };
    ProfileData();
  }, []);

  const handleSubmit = async () => {
    const errors = {};
    if (!name) errors.name = "Please enter your name.";
    if (!age) errors.age = "Please enter your age.";
    if (!gender) errors.gender = "Please select your gender.";
    if (!weight) errors.weight = "Please enter your weight.";
    if (!height) errors.height = "Please enter your height.";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const data = {
      name,
      age: Number(age), // Ensure age is a number
      gender,
      weight: Number(weight), // Ensure weight is a number
      height: Number(height), // Ensure height is a number
      fitnessFactor: Number(fitnessFactor), // Ensure fitnessFactor is a number
      deviceId: deviceId._j
    };

    console.log("Sending payload:", data); // Log the payload

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
        updateProfileData(data)
          .then((data) => {
            console.log("Profile set successfully: ", data);

            Alert.alert(
              "Profile Updated",
              "Your profile has been updated successfully!",
              [
                {
                  text: "OK",
                  onPress: () => router.back(), // Navigate back after pressing OK
                },
              ]
            );

            // Toast.show({
            //   type: "success",
            //   text1: "Profile Updated",
            //   text2: "Your profile has been updated successfully!",
            //   visibilityTime: 750
            // });

            // setTimeout(() => {
            //   router.back();
            // }, 500);
          })
          .catch((error) => {
            console.error("Error setting profile: ", error);
          });
      }
    } catch (error) {
      console.error("Error storing user data in UpdateProfile", error);
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
            <View style={styles.input}>
              <Text style={styles.inputLabel}>What is your kid name?</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={name}
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
              />
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>What is your kid age?</Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                placeholder="Enter your age"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                keyboardType="numeric"
              />
              {errors.age && <Text style={styles.error}>{errors.age}</Text>}
            </View>

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
