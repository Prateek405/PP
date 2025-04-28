import * as SQLite from "expo-sqlite";
import { DateTime } from "luxon";
import {db} from "./sqliteTables";



export function getLatestKidsLocationData(deviceId) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const currentDateUTC = DateTime.utc().toISODate(); // Get the current UTC date in yyyy-mm-dd format

      let query = `SELECT * FROM Kids_Location_Data WHERE strftime('%Y-%m-%d', timestamp) = ?`;
      let params = [currentDateUTC];

      // Filter by null device_id if deviceId is null
      if (deviceId === null) {
        query += ` AND device_id IS NULL`;
      } else {
        // Otherwise, filter by the specific deviceId
        query += ` AND device_id = ?`;
        params.push(deviceId);
      }

      query += ` ORDER BY timestamp DESC LIMIT 1`;

      tx.executeSql(
        query,
        params,
        (_, { rows }) => {
          if (rows.length > 0) {
            const record = rows.item(0);
            const utcTimestamp = DateTime.fromISO(record.timestamp, {
              zone: "utc",
            });
            const localTimestamp = utcTimestamp
              .setZone(DateTime.local().zoneName)
              .toISO();
            const formattedLocalTimestamp = utcTimestamp
              .setZone(DateTime.local().zoneName)
              .toFormat("yyyy-MM-dd HH:mm:ss");

            const result = {
              ...record,
              localTimestamp: localTimestamp,
              formattedLocalTimestamp: formattedLocalTimestamp,
            };

            console.log("Latest data with local timestamp:", result);
            resolve(result);
          } else {
            console.log("No Kids Location data records found");
            resolve(null);
          }
        },
        (_, error) => {
          console.log("Error retrieving Kids Location data:", error);
          reject(error);
        }
      );
    });
  });
}

export function setKidsLocationData(
  latitude,
  longitude,
  timestamp,
  deviceId = null
) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Insert data into the table
      tx.executeSql(
        `INSERT INTO Kids_Location_Data (latitude, longitude, timestamp, device_id)
                VALUES (?, ?, ?, ?);`,
        [latitude, longitude, timestamp, deviceId],
        () => {
          console.log(
            "Data inserted into Kids_Location_Data table successfully"
          );
          resolve();
        },
        (error) => {
          console.error(
            "Error inserting data into Kids_Location_Data table:",
            error
          );
          reject(error);
        }
      );
    });
  });
}

const currentDate = new Date();
const currentHeartRate = Math.floor(Math.random() * (120 - 60 + 1)) + 60; // Random heart rate between 60 and 120
const currentHeartRateTimestamp = currentDate.toISOString();
export function isProfileExist(deviceId) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Query to check if the profile exists using deviceId
      tx.executeSql(
        `SELECT COUNT(*) as count FROM Profile_Data WHERE device_id = ?`,
        [deviceId],
        (_, { rows }) => {
          const count = rows.item(0).count;
          if (count > 0) {
            // Profile exists
            resolve(true);
          } else {
            // Profile does not exist
            resolve(false);
          }
        },
        (error) => {
          console.log("Error checking profile existence:", error);
          reject(error);
        }
      );
    });
  });
}

export function getESimId() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT E_Sim_Id FROM Device_Data LIMIT 1",
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows._array[0].E_Sim_Id);
          } else {
            reject("No E_Sim_Id found");
          }
        },
        (_, error) => {
          console.error("Error retrieving eSIM ID:", error);
          reject(error);
        }
      );
    });
  });
}

export function setESimId(id) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Device_Data SET E_Sim_Id = ? WHERE device_id IS NULL",
        [id],
        () => {
          console.log("eSIM ID updated successfully");
          resolve();
        },
        (error) => {
          console.error("Error updating eSIM ID:", error);
          reject(error);
        }
      );
    });
  });
}

export async function getStoredBluetoothDevice() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT Bluetooth_Device FROM Device_Data WHERE device_id IS NULL",
        [],
        (_, { rows }) => {
          const storedDevice = rows._array[0]?.Bluetooth_Device;
          resolve(storedDevice ? JSON.parse(storedDevice) : null);
        },
        (_, error) => {
          console.error("Error retrieving stored Bluetooth device:", error);
          reject(null);
        }
      );
    });
  });
}

export async function setStoredBluetoothDevice(device) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Device_Data SET Bluetooth_Device = ? WHERE device_id IS NULL",
        [JSON.stringify(device)],
        (_, { rowsAffected }) => {
          resolve(rowsAffected > 0);
        },
        (_, error) => {
          console.error("Error setting stored Bluetooth device:", error);
          reject(false);
        }
      );
    });
  });
}

export async function getBatteryLevel(device_id) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT battery_level FROM Battery_Level_Data WHERE device_id  =?",
        [deviceId],
        (_, { rows }) => {
          if (rows.length > 0) {
            resolve(rows.item(0).battery_level);
          } else {
            reject("No battery level found");
          }
        },
        (_, error) => {
          console.error("Error retrieving battery level:", error);
          reject(error);
        }
      );
    });
  });
}

export async function setBatteryLevel(newBatteryLevel) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE Battery_Level_Data SET battery_level = ? WHERE device_id IS NULL",
        [newBatteryLevel],
        (_, { rowsAffected }) => {
          resolve(rowsAffected > 0);
        },
        (_, error) => {
          console.error("Error setting battery level:", error);
          reject(false);
        }
      );
    });
  });
}

export async function updateProfileData(data) {
  return new Promise((resolve, reject) => {
    // Convert numeric fields to numbers
    const age = Number(data.age); // Explicitly convert to number
    const weight = Number(data.weight);
    const height = Number(data.height);
    const fitnessFactor = Number(data.fitnessFactor);

    // Data validation
    if (
      !data.name ||
      isNaN(age) || age <= 0 || // Check if age is a valid number
      !data.gender ||
      isNaN(weight) || weight <= 0 || // Check if weight is a valid number
      isNaN(height) || height <= 0 || // Check if height is a valid number
      isNaN(fitnessFactor) || fitnessFactor <= 0 || // Check if fitnessFactor is a valid number
      !data.deviceId
    ) {
      console.log("Invalid profile data for update:", data);
      reject(new Error("Invalid profile data. Please check your input."));
      return;
    }

    db.transaction(
      (tx) => {
        // Update query to modify existing profile data
        tx.executeSql(
          `UPDATE Profile_Data 
            SET name = ?, age = ?, gender = ?, weight = ?, height = ?, fitnessFactor = ?
            WHERE device_id = ?;`,
          [
            data.name,
            age, // Use the converted number
            data.gender,
            weight, // Use the converted number
            height, // Use the converted number
            fitnessFactor, // Use the converted number
            data.deviceId
          ],
          (tx, result) => {
            if (result.rowsAffected > 0) {
              console.log("Profile data updated successfully", data);
              resolve();
            } else {
              console.log("No profile data found with this device ID", data.deviceId);
              reject(new Error("Profile not found for update."));
            }
          },
          (error) => {
            console.log("Error updating profile data:", error);
            reject(error);
          }
        );
      },
      (error) => {
        console.log("Transaction error:", error);
        reject(error);
      },
      () => {
        console.log("Update transaction completed");
      }
    );
  });
}

export async function setProfileData(data) {
  return new Promise((resolve, reject) => {
    // Convert numeric fields to numbers
    const age = Number(data.age); // Explicitly convert to number
    const weight = Number(data.weight);
    const height = Number(data.height);
    const fitnessFactor = Number(data.fitnessFactor);

    // Data validation
    if (
      !data.name ||
      isNaN(age) || age <= 0 || // Check if age is a valid number
      !data.gender ||
      isNaN(weight) || weight <= 0 || // Check if weight is a valid number
      isNaN(height) || height <= 0 || // Check if height is a valid number
      isNaN(fitnessFactor) || fitnessFactor <= 0 || // Check if fitnessFactor is a valid number
      !data.deviceId
    ) {
      console.log("Invalid profile data:", data);
      reject(new Error("Invalid profile data. Please check your input."));
      return;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          `INSERT INTO Profile_Data (name, age, gender, weight, height, fitnessFactor, device_id)
           VALUES (?, ?, ?, ?, ?, ?, ?);`,
           [
            data.name,
            age, // Use the converted number
            data.gender,
            weight, // Use the converted number
            height, // Use the converted number
            fitnessFactor, // Use the converted number
            data.deviceId
          ],
          (_, result) => {
            console.log("Rows affected", result.rowsAffected);
            if (result.rowsAffected > 0)  resolve();
            else reject("No rows affected.");
          },
          (_, error) => {
            console.error("Error inserting profile data into Profile_Data table:", error);
            reject(error);
          }
        );
      },
      (error) => {
        console.error("Transaction error in Profile_Data table:", error);
        reject(error);
      },
      () => {
        console.log("Transaction in Profile_Data table completed successfully");
        return true;
      }
    );
  });
}

export async function getProfileData() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM Profile_Data WHERE rowid = 1",
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            const item = rows.item(0);
            resolve(item);
          } else {
            resolve(null); // No data found
          }
        },
        (_, error) => {
          console.error("Error retrieving profile data:", error);
          reject(error);
        }
      );
    });
  });
}


// Usage example: Insert dummy sports data and then retrieve summary
const currentDateTimeString = DateTime.local().toISO();

export const insertNominee = (nominee) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO Nominees (Device_Id, Email_Id, Nominee_Name, Mobile_Number, Country_Code)
         VALUES (?, ?, ?, ?, ?)`,
        [
          nominee.Device_Id,
          nominee.Email_Id,
          nominee.nomineeName,
          nominee.mobileNumber,
          nominee.Country_Code,
        ],
        (_, result) => {
          console.log("Nominee inserted successfully");
          resolve(result.insertId); // Return the inserted row ID
        },
        (_, error) => {
          console.error("Error inserting nominee:", error);
          reject(error);
        }
      );
    });
  });
};

export const updateNominee = (deviceID, mobileNumber, updatedNominee) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Nominees
         SET Nominee_Name = ?, Email_Id = ?, Country_Code = ?
         WHERE Device_Id = ? AND Mobile_Number = ?`,
        [
          updatedNominee.nomineeName,
          updatedNominee.Email_Id,
          updatedNominee.Country_Code,
          deviceID,
          mobileNumber,
        ],
        (_, result) => {
          console.log("Nominee updated successfully");
          resolve(result.rowsAffected > 0); // Resolve with true if rows were affected
        },
        (_, error) => {
          console.error("Error updating nominee:", error);
          reject(error);
        }
      );
    });
  });
};

export const deleteNominee = (deviceID, mobileNumber) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Nominees WHERE Device_Id = ? AND Mobile_Number = ?`,
        [deviceID, mobileNumber],
        (_, result) => {
          console.log("Nominee locally deleted successfully");
          resolve(result.rowsAffected > 0); // Resolve with true if rows were affected
        },
        (_, error) => {
          console.error("Error deleting nominee:", error);
          reject(error);
        }
      );
    });
  });
};

export const getAllNominees = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT Nominee_Name as name,Mobile_Number as number FROM Nominees`,
        [],
        (_, result) => {
          const nominees = [];
          for (let i = 0; i < result.rows.length; i++) {
            nominees.push(result.rows.item(i));
          }
          console.log("Nominees fetched successfully");
          resolve(nominees);
        },
        (_, error) => {
          console.error("Error fetching nominees:", error);
          reject(error);
        }
      );
    });
  });
};

/**
 * Function to mark a nominee as synced by setting Is_Synced = 1
 * @param {Object} syncedNominee - An object containing nominee details (Device_Id, Mobile_Number)
 */
export const markNomineeAsSynced = (syncedNominee) => {
  const { Device_Id, Mobile_Number } = syncedNominee;

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Nominees SET Is_Synced = 1 WHERE Device_Id = ? AND Mobile_Number = ?`,
        [Device_Id, Mobile_Number],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log(`Marked nominee as synced: Device_Id=${Device_Id}, Mobile_Number=${Mobile_Number}`);
          } else {
            console.warn(`No rows updated for Device_Id=${Device_Id}, Mobile_Number=${Mobile_Number}`);
          }
          resolve(); // Success
        },
        (_, error) => {
          console.error("Error marking nominee as synced:", error);
          reject(error); // Fail
          return true; // Stop further execution
        }
      );
    });
  });
};


export const insertContact = (contact) => {
  return new Promise((resolve, reject) => {
      db.transaction((tx) => {
          tx.executeSql(
              'INSERT INTO Contacts (Device_Id, Contact_Name, Mobile_Number, Country_Code, Is_Synced) VALUES (?, ?, ?, ?, ?)',
              [
                  contact.Device_Id,
                  contact.Contact_Name,
                  contact.Mobile_Number,
                  contact.Country_Code,
                  0 // Default Is_Synced to 0
              ],
              (_, result) => {
                  console.log("Contact inserted successfully.");
                  resolve(result.insertId); // Return the inserted row ID
              },
              (_, error) => {
                  console.error("Error inserting contact:", error);
                  reject(error);
              }
          );
      });
  });
};

export const deleteContact = (Device_Id, Mobile_Number) => {
  return new Promise((resolve, reject) => {
      db.transaction((tx) => {
          tx.executeSql(
              'DELETE FROM Contacts WHERE Device_Id = ? AND Mobile_Number = ?',
              [Device_Id, Mobile_Number],
              () => {
                  console.log("Contact deleted successfully.");
                  resolve();
              },
              (_, error) => {
                  console.error("Error deleting contact:", error);
                  reject(error);
              }
          );
      });
  });
};

export const getAllSelectedContacts = () => {
  return new Promise((resolve, reject) => {
      db.transaction((tx) => {
          tx.executeSql(
              'SELECT * FROM Contacts',
              [],
              (tx, results) => {
                  const len = results.rows.length;
                  const contacts = [];
                  
                  for (let i = 0; i < len; i++) {
                      contacts.push(results.rows.item(i));
                  }
                  
                  console.log("Contacts fetched successfully.");
                  resolve(contacts); // Return the array of contacts
              },
              (_, error) => {
                  console.error("Error fetching contacts:", error);
                  reject(error);
              }
          );
      });
  });
};
export const getAllNameAndMobileFromContact = () => {
  return new Promise((resolve, reject) => {
      db.transaction((tx) => {
          tx.executeSql(
              'SELECT Contact_Name as name, Mobile_Number as number  FROM Contacts',
              [],
              (tx, results) => {
                  const len = results.rows.length;
                  const contacts = [];
                  
                  for (let i = 0; i < len; i++) {
                      contacts.push(results.rows.item(i));
                  }
                  
                  console.log("Contacts fetched successfully.");
                  resolve(contacts); // Return the array of contacts
              },
              (_, error) => {
                  console.error("Error fetching contacts:", error);
                  reject(error);
              }
          );
      });
  });
};

/**
 * Function to mark a contact as synced by setting Is_Synced = 1
 * @param {Object} syncedContact - An object containing contact details (Device_Id, Mobile_Number)
 */
export const markContactAsSynced = (syncedContact) => {
  const { Device_Id, Mobile_Number } = syncedContact;

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE Contacts SET Is_Synced = 1 WHERE Device_Id = ? AND Mobile_Number = ?`,
        [Device_Id, Mobile_Number],
        (_, resultSet) => {
          if (resultSet.rowsAffected > 0) {
            console.log(`Marked contact as synced: Device_Id=${Device_Id}, Mobile_Number=${Mobile_Number}`);
          } else {
            console.warn(`No rows updated for Device_Id=${Device_Id}, Mobile_Number=${Mobile_Number}`);
          }
          resolve(); // Resolve after update
        },
        (_, error) => {
          console.error("Error marking contact as synced:", error);
          reject(error); // Reject on error
          return true; // Stop further SQL execution
        }
      );
    });
  });
};
