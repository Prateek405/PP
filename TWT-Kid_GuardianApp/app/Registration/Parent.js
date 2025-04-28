import RegistrationForm from './Registeration'; // Ensure the correct path to Registration.js
import React from 'react';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";
import { Alert } from 'react-native'; // Import Alert component

export default function Parent() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();
    const deviceId = params.data;

    const handleOnSubmit = async (data) => {
        const payload = {
            name: data.name,
            country_code: data.countryCode,
            mobile: data.mobile,
            age: data.age,
            email: data.email,
            gender: data.gender,
            deviceId: deviceId,
        };

        const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;
        console.log("Sending payload to Parent Register API:", payload);

        try {
            const response = await axios.post(
                'https://tw-central-apim.azure-api.net/user-service-twt/parent-register',
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Ocp-Apim-Subscription-Key": subscriptionKey,
                    },
                }
            );

            console.log('Registration successful:', response.data);

            // Navigate to the next screen after successful submission
            navigation.navigate('Registration/Child', { data: {...data, deviceId } });

        } catch (error) {
            console.error("Registration error:", error);

            // Detailed error logging
            if (error.response) {
                console.error("Error data:", error.response.data);
                console.error("Error status:", error.response.status);
                console.error("Error headers:", error.response.headers);
            }

            // Extract a user-friendly error message
            let errorMessage = "An unexpected error occurred. Please try again.";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            // Show an alert with the error message
            Alert.alert("Registration Error", errorMessage);
        }
    };

    return (
        <RegistrationForm
            title="PARENT REGISTRATION"
            button="Next->"
            onSubmit={handleOnSubmit}
        />
    );
}