// import RegistrationForm from "./Registeration";
// import React from "react";
// import axios from "axios";
// import { useNavigation } from "expo-router";
// import { useLocalSearchParams } from "expo-router";
// import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";


// export default function Self() {
//   const navigation = useNavigation();

//   const params = useLocalSearchParams();
//   const deviceId = params.data;

//   const handleOnSubmit = async (data) => {
//     data.deviceId = deviceId;

//     try {
//       const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;
//       const response = await axios.post(
//         "https://tw-central-apim.azure-api.net/user-service-twt/adult-register",
//         data,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "Ocp-Apim-Subscription-Key": subscriptionKey,
//           },
//         }
//       );
//       console.log("Registration successful:", response.data);

//       // Navigate to the next screen after successful submission
//       navigation.navigate("ProfileSetup/index", { data: data });
//     } catch (error) {
//       console.error("Registration error:", error);
     

//       // Detailed error logging
//       if (error.response) {
//         console.error("Error data:", error.response.data);
//         console.error("Error status:", error.response.status);
//         console.error("Error headers:", error.response.headers);
//       }

//       // Extract a user-friendly error message
//       let errorMessage = "An unexpected error occurred. Please try again.";
//       if (
//         error.response &&
//         error.response.data &&
//         error.response.data.message
//       ) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
//     }
//   };

//   return (
//     <RegistrationForm
//       title="SELF REGISTRATION"
//       button="Sign Up"
//       onSubmit={handleOnSubmit}
//     />
//   );
// }
