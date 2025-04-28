import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  BackHandler,
  StatusBar
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Contact from "../Contact/index";
import Footer from "../../component/Footer";

import { ScrollView } from "react-native-gesture-handler";
import Profile from "../ProfileSetup/Profile";
import Nominee from "../NomineeSetup/index";
import Subscription from "../Subscription/index";
import Bluetooth from "../BluetoothMenu/index";
import AesKey from "../AesKey/index";
import StorageSettingScreen from './StorageSettingScreen';

import { useRouter } from "expo-router";

export default function LandingScreen() {
  const [activePage, setActivePage] = useState("settings");
  const { screen } = useLocalSearchParams();
  const router = useRouter();

  const [backPressCount, setBackPressCount] = useState(0);

  const handleBackPress = () => {
    setActivePage("settings");
    router.push({
      pathname: "LandingScreen/LandingScreen",
      params: { screen: "settings" },
    });
    return true;
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      backHandler.remove();
    };
  }, [backPressCount]);

  const renderPage = () => {
    if (screen == "contact") {
      return <Contact />;
    }

    if (screen == "Profile") {
      return <Profile />;
    }

    if (screen == "Nominee") {
      return <Nominee />;
    }

    if (screen == "Subscription") {
      return <Subscription />;
    }

    if (screen == "Bluetooth") {
      return <Bluetooth />;
    }

    if (screen == "AesKey") {
      return <AesKey />;
    }

    if (screen == "StorageSetting") {
      return <StorageSettingScreen />;
    }
  };

  const handleFooterPress = (iconName) => {
    setActivePage(iconName);
    router.push({
      pathname: "LandingScreen/LandingScreen",
      params: { screen: iconName },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
       <StatusBar
        animated={true}
        backgroundColor="#F8C8DC"
        
        barStyle="light-content"
     
      />
      {/* <Header /> */}
      {renderPage()}
      <Footer activeIcon={activePage} setActivePage={handleFooterPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    // marginTop: 16, // Add margin top
    // marginBottom: 24, // Add margin bottom
  },
});