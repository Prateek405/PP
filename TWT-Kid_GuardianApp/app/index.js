import React, { useState, useEffect } from "react";
import { SafeAreaView, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-gesture-handler";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Setup from "./Setup";
import Page from "./Validate";
import notifee from "@notifee/react-native";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import { initializeDatabase } from "../utils/sqliteTables";
import LoginOptionsPage from "./LoginOptions"; // Adjusted import to remove curly braces
import { isProfileExist } from "../utils/sqlite";
import { getDeviceID } from "../utils/sharedData";
import { fetchProfileData } from "../utils/syncFromCloud";
import { setProfileData } from "../utils/sqlite";
import { useRouter } from "expo-router";

initializeDatabase().then((result) => {
  console.log("Database validation result:", result);
});

LogBox.ignoreAllLogs();
const Drawer = createDrawerNavigator();

const Auth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPreference, setLoginPreference] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    // Handle deep linking
    const handleDeepLink = (event) => {
      const url = event.url;
      if (url === "TwKidsapp://home") {
        router.push("/LandingScreen/Tracking");
      }
    };

    // Listen for deep links when the app is running
    const unsubscribe = Linking.addEventListener("url", handleDeepLink);

    // Check if the app was opened via a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Handle notification taps
    const handleNotificationTap = async () => {
      const initialNotification = await notifee.getInitialNotification();
      if (initialNotification) {
        const { data } = initialNotification.notification;
        if (data?.url === "TwKidsapp://home") {
          router.push("/LandingScreen/Tracking");
        }
      }
    };

    handleNotificationTap();

    // Clean up
    return () => unsubscribe.remove();
  }, [router]);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Step 1: Get device ID
        const id = await getDeviceID();

        // Step 2: Once device ID is fetched, fetch the profile if it doesn't exist
        if (id && !(await isProfileExist(id))) {
         
          const data = await fetchProfileData(id);
          
          // Ensure the data is in the expected double array format: [[{...profile data...}]]
          if (data && Array.isArray(data) && data.length > 0) {
      
            const profile = data[0]
            
        
            if (profile) {
              await setProfileData(profile);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    // Only call fetchProfile when the component mounts
    fetchProfile();
  }, []);

  useEffect(() => {
    const checkLoginPreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem("loginPreference");
        if (storedPreference) {
          setLoginPreference(storedPreference);
        }
      } catch (error) {
        console.error("Error retrieving login preference:", error);
      }
    };

    checkLoginPreference();
  }, []);

  const handleSuccessfulLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {console.log("login-preference-value = ", loginPreference)}
  
      {loginPreference !== null && loginPreference !== undefined && loginPreference.trim() !== "" && loginPreference === "fingerprintOrPIN" ? (
        <LoginOptionsPage onSuccessfulLogin={handleSuccessfulLogin} />
      ) : (
        <Setup />
      )}
  
      <StatusBar style="light" />
    </SafeAreaView>
  );
  
};

export default Auth;
