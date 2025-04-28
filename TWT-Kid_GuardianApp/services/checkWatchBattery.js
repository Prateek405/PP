// import { useEffect } from "react";
// import * as TaskManager from "expo-task-manager";
// import * as Notifications from "expo-notifications";
// import { getWatchBatteryLevel } from "../utils/sqlite";


// const INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// const sendNotification = async () => {
//   console.log("Sending notification");
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Watch Battery Low",
//       body: "Your watch battery is low. Please charge it soon.",
//     },
//     trigger: null,
//   });
// };

// const [deviceId, setDeviceId] = useState(null);
//   useEffect(() => {
//     const fetchDeviceID = async () => {
//       const id = await getDeviceID(); // Call the function and await the result
//       setDeviceId(id); // Save the result to state
//     };

//     fetchDeviceID(); // Call the function when the component loads
//   }, []);

// const checkBatteryAndNotify = async () => {
//   try {
//     console.log("Checking battery status");
//     const batteryStatus = await getWatchBatteryLevel();
//     console.log("Battery status:", batteryStatus);
//     if (batteryStatus < 15) {
//       console.log("Battery is low. Sending notification.");
//       await sendNotification();
//     }
//   } catch (error) {
//     console.error("Error checking battery status:", error);
//   }
// };

// TaskManager.defineTask("batteryCheckTask", async () => {
//   console.log("Running batteryCheckTask");
//   await checkBatteryAndNotify();
//   return TaskManager.TaskManagerExecutionResult.Success;
// });

// const startBatteryChecker = async () => {
//   TaskManager.defineTask("batteryCheckTask", async () => {
//     console.log("Running batteryCheckTask");
//     await checkBatteryAndNotify();
//     return TaskManager.TaskManagerExecutionResult.Success;
//   });
//   TaskManager.scheduleTaskAsync("batteryCheckTask", {
//     interval: INTERVAL,
//   });


//   TaskManager.isTaskRegisteredAsync("batteryCheckTask").then((isRegistered) => {
//     if (!isRegistered) {
//       console.log("Registering batteryCheckTask");
//       TaskManager.defineTask("batteryCheckTask", async () => {
//         console.log("Running batteryCheckTask");

//         await checkBatteryAndNotify();
//         return TaskManager.TaskManagerExecutionResult.Success;
//       });
//       TaskManager.scheduleTaskAsync("batteryCheckTask", {
//         interval: INTERVAL,
//       });
//     }
//   });
// };

// export { startBatteryChecker };
