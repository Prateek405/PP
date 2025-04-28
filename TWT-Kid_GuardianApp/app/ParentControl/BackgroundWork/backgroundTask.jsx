// BackgroundTaskModule.js
import BackgroundService from "react-native-background-actions";
import notifee from "@notifee/react-native";
import * as geolib from "geolib";
import { OCP_APIM_SUBSCRIPTION_KEY } from "@env";

const sleep = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(), time));

// Define the geofence coordinates
const geofenceCoords = [
  { latitude: 28.6134, longitude: 77.2293 }, // Geofence Vertex 1
  { latitude: 28.6134, longitude: 77.2303 }, // Geofence Vertex 2
  { latitude: 28.6144, longitude: 77.2303 }, // Geofence Vertex 3
  { latitude: 28.6144, longitude: 77.2293 }, // Geofence Vertex 4
];

// Function to check if the location is inside the geofence
const isLocationInsideGeofence = (location) => {
  return geolib.isPointInPolygon(
    {
      latitude: location["Latitude"],
      longitude: location["Longitude"],
    },
    geofenceCoords
  );
};

// Fetch the latest location from the backend API
const fetchLatestLocation = async (deviceId) => {
  const subscriptionKey = OCP_APIM_SUBSCRIPTION_KEY;
  try {
    const response = await fetch(
      `https://tw-central-apim.azure-api.net/user-service-twt/get-latest-gps-data-guardian`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": subscriptionKey,
        },
        body: JSON.stringify({ token: deviceId }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      throw new Error("No location data found for this device.");
    }
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};

// The intensive task that runs in the background
const veryIntensiveTask = async (taskDataArguments) => {
  const { delay, deviceId } = taskDataArguments;

  await new Promise(async (resolve) => {
    while (BackgroundService.isRunning()) {
      // Fetch the child's current location from the API
      const location = await fetchLatestLocation(deviceId);

      if (location) {
        // Check if the location is inside the geofence
        const isInsideGeofence = isLocationInsideGeofence(location);

        if (!isInsideGeofence) {
          console.log("Child is outside the geofence.");
          await notifee.displayNotification({
            title: "⚠️ URGENT: Child Safety Alert",
            body: "Your child has left the safe zone! Tap to check their location.",
            data: {
              url: "guardianapp://home"
            },
            android: {
              channelId: "default-channel-id",
              pressAction: {
                id: "default",
              },
              importance: 4, // Ensures it appears as a high-priority notification
              priority: "high", // Makes sure it pops up
              category: "alarm",
              sound: "default",
              vibration: true,
              lights: true,
              ongoing: false,  // ✅ Allows the user to clear it
              autoCancel: true, // ✅ Removes notification when clicked
            },
          });
          
        }
      } else {
        console.log("Failed to fetch location or no location data available.");
      }

      // Wait for 5 minutes (300 seconds) before checking again
      await sleep(delay);
    }
  });
};

// Setup push notifications
const setupPushNotifications = async () => {
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: "default-channel-id",
    name: "Child Safety Alerts",
    description: "Important alerts about your child's location",
    importance: 4, // High importance for heads-up notifications
    sound: 'default',
    vibration: true,
    lights: true,
    badges: true,
  });

  console.log(`Create channel returned '${channelId}'`);
};

// Start the background task
const startBackgroundTask = async (deviceId) => {
  await setupPushNotifications();

  const options = {
    taskName: "ParentControl",
    taskTitle: "Guardian App Active",
    taskDesc: "Monitoring your child's location",
    taskIcon: {
      name: "ic_launcher",
      type: "mipmap",
    },
    color: "#4CAF50",
    parameters: {
      delay: 300000, // 5 minutes (300 seconds)
      deviceId: deviceId,
    },
    notification: {
      channelId: "default-channel-id",
      title: "Guardian App Active",
      text: "Monitoring your child's location",
      color: "#4CAF50",
      visibility: "public",
      priority: "high",
      importance: "high",
      ongoing: true,
      intent: {
        component: "com.twt_kid_guardianapp.MainActivity",
        type: "activity",
      }
    }
  };

  // Start background task
  await BackgroundService.start(veryIntensiveTask, options);
};

// Stop the background task
const stopBackgroundTask = async () => {
  // Stop background task
  await BackgroundService.stop();
};

export { startBackgroundTask, stopBackgroundTask };
