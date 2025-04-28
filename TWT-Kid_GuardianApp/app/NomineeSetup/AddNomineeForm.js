// AddNomineeForm.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import CountryFlag from "react-native-country-flag";
import { getDeviceID, getCountryCodes } from "../../utils/sharedData";
import { insertNominee } from "../../utils/sqlite";
import axios from "axios";
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";
import useBLE from "../../utils/useBLE.js";

const countryCodes = getCountryCodes();
const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;

const sendEmailToNominees = async () => {
  const deviceId = await getDeviceID();

  try {
    await axios.post(
      "https://tw-central-apim.azure-api.net/user-service-twt/send_mail_to_nominee",
      { token: deviceId },
      {
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
        timeout: 120000, // Optional timeout
      }
    );
    Alert.alert(
      "Success",
      "Email sent to nominees successfully that you added him as your TwKids for Emergency."
    );
  } catch (error) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out:", error);
      Alert.alert("Error", "Request timed out. Please try again after 2 minutes.");
    } else {
      console.error("Error sending Email to nominees:", error);
      Alert.alert("Error", "Failed to send Email to nominees. Please try again.");
    }
  }
};

const AddNomineeForm = ({ isModalVisible, setModalVisible, handleAddNominee }) => {
  const [newNominee, setNewNominee] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    countryCode: "+91",
  });
  const [errors, setErrors] = useState({});

  // Call the hook at the top level of the component
  const { connectandsync } = useBLE();

  const validateInputs = () => {
    let validationErrors = {};
    let isValid = true;

    if (!newNominee.name.trim()) {
      validationErrors.name = "Name is required";
      isValid = false;
    } else if (newNominee.name.length > 100) {
      validationErrors.name = "Name must be 100 characters or less";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newNominee.email)) {
      validationErrors.email = "Invalid email format";
      isValid = false;
    } else if (newNominee.email.length > 100) {
      validationErrors.email = "Email must be 100 characters or less";
      isValid = false;
    }

    setErrors(validationErrors);
    return isValid;
  };

  const sendToExternalAPI = async (nominee) => {
    try {
      const payload = {
        token: nominee.Device_Id,
        country_code: nominee.Country_Code,
        mobile_number: nominee.mobileNumber,
        nominee_name: nominee.nomineeName,
        email: nominee.Email_Id,
        consent: 1,
      };
      console.log("Sending payload to server:", payload);
      const response = await fetch(
        "https://tw-central-apim.azure-api.net/user-service-twt/add-or-update-nominee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": subscriptionKey,
          },
          body: JSON.stringify(payload),
          timeout: 120000,
        }
      );

      console.log("Nominee sent to external API successfully");

      sendEmailToNominees();

      Alert.alert("Success", "Nominee added successfully!");

      return true;
    } catch (error) {
      console.error("Error sending nominee to external API:", error);
      return false;
    }
  };

  const handleAddNomineeClick = async () => {
    if (validateInputs()) {
      try {
        const deviceId = await getDeviceID();
        const nominee = {
          Device_Id: deviceId,
          Email_Id: newNominee.email,
          nomineeName: newNominee.name,
          mobileNumber: newNominee.mobileNumber,
          Country_Code: newNominee.countryCode,
        };

        // Send nominee to external API
        const isGlobalSuccess = await sendToExternalAPI(nominee);

        // Save nominee locally if external API call was successful
        if (isGlobalSuccess) {
          try {
            await insertNominee(nominee);
            console.log("Nominee added locally");

            // Update the nominee list in the parent component
            handleAddNominee(nominee);

            // Reset the form and close the modal
            setNewNominee({
              name: "",
              email: "",
              mobileNumber: "",
              countryCode: "+91",
            });
            setModalVisible(false);
          } catch (error) {
            console.error("Error adding nominee locally", error);
          }

          // Syncing added nominees to watch
          Alert.alert(
            "Syncing",
            "We are trying to sync nominees, please make sure your smartwatch is nearby."
          );
          await connectandsync(true);
        } else {
          console.error("Global database operation failed.");
        }
      } catch (error) {
        console.error("Error adding nominee:", error);
        console.error("Failed to add nominee globally or locally.");
      }
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Nominee</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newNominee.name}
            onChangeText={(text) => setNewNominee({ ...newNominee, name: text })}
            maxLength={100}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={newNominee.email}
            onChangeText={(text) => setNewNominee({ ...newNominee, email: text })}
            keyboardType="email-address"
            maxLength={100}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodeContainer}>
              <Picker
                selectedValue={newNominee.countryCode}
                style={styles.countryCodePicker}
                onValueChange={(itemValue) =>
                  setNewNominee({ ...newNominee, countryCode: itemValue })
                }
              >
                {countryCodes.map((country) => (
                  <Picker.Item
                    key={country.code}
                    label={`${country.code} `}
                    value={country.code}
                  />
                ))}
              </Picker>
              <CountryFlag
                isoCode={
                  countryCodes.find((c) => c.code === newNominee.countryCode)
                    ?.country
                }
                size={20}
                style={styles.flag}
              />
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="Mobile Number"
              value={newNominee.mobileNumber}
              onChangeText={(text) =>
                setNewNominee({ ...newNominee, mobileNumber: text })
              }
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
          {errors.mobileNumber && (
            <Text style={styles.errorText}>{errors.mobileNumber}</Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAddNomineeClick}>
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  cancelButtonText: {
    color: "#000",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 10,
  },
  countryCodePicker: {
    width: 50,
    height: 40,
  },
  flag: {
    marginRight: 5,
  },
  phoneInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
});

export default AddNomineeForm;
