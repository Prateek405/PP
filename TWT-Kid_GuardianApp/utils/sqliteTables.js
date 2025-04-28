import * as SQLite from "expo-sqlite";


import { getSupportedBiometryType } from "react-native-keychain";
import { getDeviceID } from "./sharedData";


export let db = null;

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => {},
        };
      },
    };
  }

  db = SQLite.openDatabase("db.profile");
  return db;
}

db = openDatabase();

export const initializeDatabase = async () => {
  
  await createKidsLocationDataTable();
  await createProfileDataTable();
  await manageBatteryLevelData();
  await createDeviceData();
  await createSyncedDataTable();
  await createNomineeTable();
  await createContactTable();

//  const  id  = await getDeviceID();
//  getProfileData()
//     .then((data) => {
//       if (data) {
//         alert("First Joining Day:\n" + JSON.stringify(data, null, 2));
//       } else {
//         console.log("No step data found for the last thirty days.");
//       }
//     })
//     .catch((error) => {
//       alert("Error retrieving step data: " + error);
//     });

  //
  // await dropAllTables();
  // await logAllTableData();

  return true;
};

function createDeviceData() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Create table if not exists
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Device_Data (
                    device_id TEXT DEFAULT NULL,
                    E_Sim_Id TEXT,
                    Bluetooth_Device TEXT
                );`,
        [],
        () => {
          console.log("Device_Data table created successfully");
          resolve();
        },
        (error) => {
          console.log("Error creating Device_Data table:", error);
          reject(error);
        }
      );
    });
  });
}
function createProfileDataTable() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Create Profile_Data table if it does not exist
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Profile_Data (
                    device_id TEXT DEFAULT NULL,
                    name TEXT,
                    age REAL,
                    gender TEXT,
                    weight REAL,
                    height REAL,
                    fitnessFactor REAL,
                    PRIMARY KEY (device_id)
                );`,
        [],
        () => {
          console.log("Profile_Data table created successfully");
          resolve();
        },
        (error) => {
          console.log("Error creating Profile_Data table:", error);
          reject(error);
        }
      );
    });
  });
}

function createKidsLocationDataTable() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Create table if not exists
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Kids_Location_Data (
                        latitude REAL,
                        longitude REAL,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                        device_id TEXT DEFAULT NULL
                    );`,
        [],
        () => {
          console.log("Kids_Location_Data table created successfully");
          resolve();
        },
        (error) => {
          console.log("Error creating Kids_Location_Data table:", error);
          reject(error);
        }
      );
    });
  });
}

function manageBatteryLevelData() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      // Create table if not exists
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Battery_Level_Data (
                    battery_level INTEGER,
                    device_id TEXT DEFAULT NULL
                );`,
        [],
        () => {
          console.log("Battery_Level_Data table created successfully");
          resolve();
        },
        (error) => {
          console.log("Error creating Battery_Level_Data table:", error);
          reject(error);
        }
      );
    });
  });
}
function createSyncedDataTable() {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS Sync_Data (
                    device_id TEXT DEFAULT NULL,
                    table_name TEXT,
                    timestamp DATETIME
                );`,
        [],
        () => {
          console.log("Table created successfully");
          resolve();
        },
        (tx, error) => {
          console.log("Error creating table: ", error);
          reject(error);
        }
      );
    });
  });
}

const tableNames = [
  "Kids_Location_Data",
  "Profile_Data",
  "Battery_Level_Data",
  "Device_Data",
];
const dropAllTables = async () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      const dropPromises = tableNames.map((tableName) => {
        return new Promise((resolve, reject) => {
          tx.executeSql(
            `DROP TABLE IF EXISTS ${tableName};`,
            [],
            () => {
              console.log(`${tableName} table dropped successfully`);
              resolve();
            },
            (tx, error) => {
              console.log(`Error dropping ${tableName} table:`, error);
              reject(error);
            }
          );
        });
      });

      Promise.all(dropPromises)
        .then(() => {
          console.log("All tables dropped successfully");
          resolve();
        })
        .catch((error) => {
          console.error("Error dropping tables:", error);
          reject(error);
        });
    });
  });
};

export const logTableData = async (tableName) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT * FROM ${tableName};`,
        [],
        (tx, results) => {
          const rows = results.rows;
          let data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i));
          }
          console.log(`Data from ${tableName}:`, data);
          resolve(data);
        },
        (tx, error) => {
          console.log(`Error retrieving data from ${tableName}:`, error);
          reject(error);
        }
      );
    });
  });
};

export const logAllTableData = async () => {
  try {
    for (const tableName of tableNames) {
      await logTableData(tableName);
    }
  } catch (error) {
    console.error("Error logging table data:", error);
  }
};

export const createNomineeTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Nominees (
        Device_Id TEXT NOT NULL,
        Email_Id TEXT NOT NULL,
        Nominee_Name TEXT NOT NULL,
        Mobile_Number TEXT NOT NULL,
        Country_Code TEXT NOT NULL,
        Is_Synced INTEGER DEFAULT 0,  -- New column to track sync status
        PRIMARY KEY (Device_Id, Mobile_Number)
      )`,
      [],
      () => console.log("Nominees table ready for usage."),
      (_, error) => console.error("Error creating table:", error)
    );
  });
};

export const createContactTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS Contacts (
        Device_Id TEXT NOT NULL,
        Contact_Name TEXT NOT NULL,
        Mobile_Number TEXT NOT NULL,
        Country_Code TEXT NOT NULL,
        Is_Synced INTEGER DEFAULT 0,  -- New column to track sync status
        PRIMARY KEY (Device_Id, Mobile_Number)
      )`,
      [],
      () => console.log("Contacts table ready for usage."),
      (_, error) => console.error("Error creating table:", error)
    );
  });
};