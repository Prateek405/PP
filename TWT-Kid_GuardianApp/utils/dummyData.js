import { db } from "./sqlite"; // Ensure you have a proper db export from this module
import { DateTime } from "luxon";
 import { getDeviceID } from "./sharedData";



const insertDummyKidsLocationData = async (deviceId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const currentDateUTC = DateTime.utc(); // Get current date and time in UTC
      const startDateUTC = currentDateUTC.minus({ days: 30 }); // Start date 30 days ago

      const insertPromises = [];

      // Loop through each day from the start date to the current date
      for (
        let dateCursor = startDateUTC;
        dateCursor <= currentDateUTC;
        dateCursor = dateCursor.plus({ days: 1 })
      ) {
        // Insert 30 entries for each day
        for (let j = 0; j < 30; j++) {
          // Generate random latitude and longitude within Delhi, India
          const latitude = (Math.random() * (28.9 - 28.4) + 28.4).toFixed(6); // Random latitude between 28.40 and 28.90
          const longitude = (Math.random() * (77.4 - 76.9) + 76.9).toFixed(6); // Random longitude between 76.90 and 77.40
          const timestampUTC = dateCursor.toISO({ includeOffset: false });

          insertPromises.push(
            new Promise((resolve, reject) => {
              tx.executeSql(
                `INSERT INTO Kids_Location_Data (latitude, longitude, timestamp, device_id)
                 VALUES (?, ?, ?, ?)`,
                [latitude, longitude, timestampUTC, deviceId], // Adjust or provide the appropriate device_id if necessary
                (_, result) => {
                  console.log(
                    `Dummy Kids Location data inserted for ${timestampUTC}`
                  );
                  resolve(result);
                },
                (_, error) => {
                  console.error(
                    `Error inserting dummy Kids Location data for ${timestampUTC}:`,
                    error
                  );
                  reject(error);
                }
              );
            })
          );
        }
      }

      Promise.all(insertPromises)
        .then(() => {
          console.log(
            "Dummy Kids Location data inserted for the last 30 days with 30 entries per day."
          );
          resolve();
        })
        .catch((error) => {
          console.error("Error inserting dummy Kids Location data:", error);
          reject(error);
        });
    });
  });
};

const insertDummyBatteryLevelData = async (deviceId) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const batteryLevel = Math.floor(Math.random() * 100); // Random battery level between 0 and 100

      tx.executeSql(
        `UPDATE Battery_Level_Data SET battery_level = ? WHERE device_id IS NULL`,
        [batteryLevel],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) {
            console.log(`Dummy Battery Level data updated successfully`);
          } else {
            console.log(`No row found to update. Inserting new data instead.`);
            tx.executeSql(
              `INSERT INTO Battery_Level_Data (battery_level, device_id) VALUES (?, ?)`,
              [batteryLevel, deviceId],
              () => {
                console.log(`Dummy Battery Level data inserted successfully`);
                resolve();
              },
              (_, error) => {
                console.log("Error inserting dummy Battery Level data:", error);
                reject(error);
              }
            );
          }
          resolve();
        },
        (_, error) => {
          console.log("Error updating dummy Battery Level data:", error);
          reject(error);
        }
      );
    });
  });
};

export const insertDummyData = async () => {
  const  deviceId = await getDeviceID(); 
  try {
  
     insertDummyKidsLocationData(deviceId);
     insertDummyBatteryLevelData(deviceId);

    console.log("Dummy data inserted into all tables");
  } catch (error) {
    console.error("Error inserting dummy data:", error);
  }
};
``