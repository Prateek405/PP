import React, { useState,  useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation, useLocalSearchParams } from'expo-router'; // Import corrected
import axios from 'axios';
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";

export default function Child() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const deviceId = params.data.deviceId;

  const [form, setForm] = useState({
    name: "", // Use the same field name for consistency
    age: "",
  });
  

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // Validation for Child Name
    if (!form.name) { // Changed from fullname to name
      errors.name = "Name is required"; // Changed from fullname to name
      isValid = false;
    }

    // Validation for Age
    if (!form.age) {
      errors.age = "Age is required";
      isValid = false;
    } else if (!/^\d+$/.test(form.age)) {
      errors.age = "Age must be a number";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = async(form) => { // Changed parameter name from data to form
    if (validateForm()) {
      try {

        const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;
        form.deviceId = deviceId;
        // alert(JSON.stringify(form, null, 2));
        console.log("Sending payload to kid-register API: ", form)
        const response = await axios.post(
          'https://tw-central-apim.azure-api.net/user-service-twt/kid-register',
          form,
          {
              headers: {
                  'Content-Type': 'application/json',
                  "Ocp-Apim-Subscription-Key": subscriptionKey,
              }
          }
      );

        console.log('Registration successful:', response.data);
        // Navigate to the next screen after successful submission
    age: "",
        navigation.navigate('ProfileSetup/index', { name: form.name, age:form.age,deviceId: form.deviceId});
      } catch (error) {
        console.error('Registration error:', error); // Handle errors
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f1f5f9" }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>CHILD DETAILS</Text> 
          <Text style={styles.subtitle}>Create an account to continue</Text>
        </View>

        <KeyboardAwareScrollView>
          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Child Name</Text>
              <TextInput
                onChangeText={(name) => setForm({ ...form, name })} // Changed from fullname to name
                placeholder="Name"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.name} // Changed from fullname to name
              />
              {/* Display error message if exists */}
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text> // Changed from fullname to name
              )}
            </View>


            <View style={styles.input}>
              <Text style={styles.inputLabel}>Age</Text>
              <TextInput
                onChangeText={(age) => setForm({ ...form, age })}
                placeholder="Enter Age"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                keyboardType="numeric"
                value={form.age}
              />
              {/* Display error message if exists */}
              {errors.age && (
                <Text style={styles.errorText}>{errors.age}</Text>
              )}
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity  onPress={() => handleSubmit(form)}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Submit</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.formFooter}>
                <Text style={{ textDecorationLine: "underline" }}>Help?</Text>
              </Text>
            </TouchableOpacity>
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 4,
  },
  formAction: {
    marginVertical: 24,
  },
  formFooter: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    textAlign: "center",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: "black",
    borderColor: "#007aff",
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "600",
    color: "#fff",
  },
});
