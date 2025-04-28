import axios from "axios";
// import { getHeartDataByDevice } from "./sqlite";
// import {
//   updateHeartData,
//   updateStepData,
//   updateSleepData,
//   updateSpo2Data,
//   updateSportsData,
// } from "./updateData";
// import { Alert } from "react-native";
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";
// import * as Keychain from "react-native-keychain";

const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;
// const baseURL = "https://tw-central-apim.azure-api.net/";

export const fetchProfileData = async (deviceId) => {
  const url = `https://tw-central-apim.azure-api.net/user-service-twt/get-profile-data`;
 
  try {
    // const token = await getToken();
    // console.log("subdcription key",deviceId);
    // Make a GET request to the API with Axios
    const response = await axios.post(url, 
     {
         token: deviceId, // Passing device_id as a query parameter
      },{ 
      headers: {
        // Authorization: `Bearer ${token}`,
        'Ocp-Apim-Subscription-Key': subscriptionKey, // Add the subscription key from the environment
        'Content-Type': 'application/json'
      }}
    );

    // Return the profile data from the response
    return response.data;
  } catch (error) {
    console.error('Error fetching profile data:', error);
  }
};
// Function to retrieve token with a label
// async function getTokenWithLabel(label) {
//   try {
//     // Retrieve the token using the label (service name)
//     const credentials = await Keychain.getGenericPassword({ service: label });
//     if (credentials) {
//       console.log(`Token retrieved successfully for label ${label}:`, credentials.password);
//       return credentials.password;
//     } else {
//       console.log(`No token stored for label: ${label}`);
//       return null;
//     }
//   } catch (error) {
//     console.log('Error retrieving the token: ', error);
//     return null;
//   }
// }


// export const fetchHeartData = async (deviceId) => {
//   const now = new Date();
//   const isoString = now.toISOString();
//   console.log("::::::::::::::::fetchHeartData::::::::::::::::", isoString);
//   try {
//     const time = await getLatestHeartDataTimestamp(deviceId);
//     const token = await getTokenWithLabel("adtoken");
//     console.log("token========------------", token);
//     const response = await axios.post(
//       `${baseURL}get-heart-data-kid-LG`,
//       {
//         token: token,
//         lastUpdated: time,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Ocp-Apim-Subscription-Key": subscriptionKey,
//         },
//       }
//     );

//     const heartData = response.data;
//     console.log("response=============", response.status);
//     try {
//       await updateHeartData(heartData[0]);
//       const latestHeartData = await getHeartDataByDevice(deviceId);
//       if (latestHeartData.length > 0) {
//       } else {
//         Alert.alert("No heart data found");
//       }
//     } catch (error) {
//       console.error("Error during transaction:", error);
//     }
//   } catch (error) {
//     console.error("Error fetching heart data:", error);
//   }

//   const now1 = new Date();
//   const isoString1 = now1.toISOString();
// };

// export const fetchStepData = async (deviceId) => {
//   const now = new Date();
//   const isoString = now.toISOString();
//   console.log("::::::::::::::::fetchStepData::::::::::::::::", isoString);
//   try {
//     const time = await getLatestStepDataTimestamp(deviceId);
//     const token = await getTokenWithLabel("adtoken");
//     console.log("time===================================", time);
//     const response = await axios.post(
//       `${baseURL}get-step-data-kid-LG`,
//       {
//         device_id: deviceId,
//         lastUpdated: time,
//       },
//       {
//         headers: {
//           // Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           "Ocp-Apim-Subscription-Key": subscriptionKey,
//         },
//       }
//     );

//     const stepData = response.data;
//     console.log(
//       "stepDatalength=============------------------",
//       stepData[0].length
//     );

//     try {
//       await updateStepData(stepData[0]);
//     } catch (error) {
//       console.error("Error during transaction:", error);
//     }
//   } catch (error) {
//     console.error("Error fetching step data:", error);
//   }

//   const now1 = new Date();
//   const isoString1 = now1.toISOString();
//   console.log("::::::::::::::::fetchStepData::::::::::::::::", isoString1);
// };

// export const fetchSleepData = async (deviceId) => {
//   const now = new Date();
//   const isoString = now.toISOString();
//   console.log("::::::::::::::::sleepData::::::::::::::::", isoString);
//   try {
//     const time = await getLatestSleepDataTimestamp(deviceId);
//     const token = await getTokenWithLabel("adtoken");
//     console.log("time===================================", time);
//     const response = await axios.post(
//       `${baseURL}get-sleep-data-kid-LG`,
//       {
//         device_id: deviceId,
//         lastUpdated: time,
//       },
//       {
//         headers: {
//           // Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           "Ocp-Apim-Subscription-Key": subscriptionKey,
//         },
//       }
//     );

//     const sleepData = response.data;
//     console.log(
//       "sleepDatalength=============------------------",
//       sleepData[0].length
//     );

//     try {
//       await updateSleepData(sleepData[0]);
//     } catch (error) {
//       console.error("Error during transaction:", error);
//     }
//   } catch (error) {
//     console.error("Error fetching sleep data:", error);
//   }

//   const now1 = new Date();
//   const isoString1 = now1.toISOString();
//   console.log("::::::::::::::::fetchSleepData::::::::::::::::", isoString1);
// };

// export const fetchSpo2Data = async (deviceId) => {
//   const now = new Date();
//   const isoString = now.toISOString();
//   console.log("::::::::::::::::spo2Data::::::::::::::::", isoString);
//   try {
//     const time = await getLatestSpo2DataTimestamp(deviceId);
//     const token = await getTokenWithLabel("adtoken");
//     console.log("time===================================", time);
//     const response = await axios.post(
//       `${baseURL}get-spo2-data-kid-LG`,
//       {
//         device_id: deviceId,
//         lastUpdated: time,
//       },
//       {
//         headers: {
//           // Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           "Ocp-Apim-Subscription-Key": subscriptionKey,
//         },
//       }
//     );

//     const spo2Data = response.data;
//     console.log(
//       "spo2Datalength=============------------------",
//       spo2Data[0].length
//     );

//     try {
//       await updateSpo2Data(spo2Data[0]);
//     } catch (error) {
//       console.error("Error during transaction:", error);
//     }
//   } catch (error) {
//     console.error("Error fetching spo2 data:", error);
//   }

//   const now1 = new Date();
//   const isoString1 = now1.toISOString();
//   console.log("::::::::::::::::spo2Data::::::::::::::::", isoString1);
// };

// export const fetchSportsData = async (deviceId) => {
//   const now = new Date();
//   const isoString = now.toISOString();
//   console.log("::::::::::::::::sportsData::::::::::::::::", isoString);
//   try {
//     const time = await getLatestSportsDataTimestamp(deviceId);
//     const token = await getTokenWithLabel("adtoken");
//     console.log("time===================================", time);
//     const response = await axios.post(
//       `${baseURL}get-sport-data-kid-LG`,
//       {
//         device_id: deviceId,
//         lastUpdated: time,
//       },
//       {
//         headers: {
//           // Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//           "Ocp-Apim-Subscription-Key": subscriptionKey,
//         },
//       }
//     );

//     const sportData = response.data;
//     console.log(
//       "sportDatalength=============------------------",
//       sportData[0].length
//     );

//     try {
//       await updateSportsData(sportData[0]);
//     } catch (error) {
//       console.error("Error during transaction:", error);
//     }
//   } catch (error) {
//     console.error("Error fetching sports data:", error);
//   }

//   const now1 = new Date();
//   const isoString1 = now1.toISOString();
//   console.log("::::::::::::::::sportsData::::::::::::::::", isoString1);
// };
