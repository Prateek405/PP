import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import SurveillanceCard from "../Cards/Card5";
import SettingsPage from "../SettingsPage/index";
import Footer from "../../component/Footer";
import Tracking from "../ParentControlMain/index";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function LandingScreen() {
  const router = useRouter();
  const [activePage, setActivePage] = useState("Home");
  const { screen } = useLocalSearchParams();

  useEffect(() => {
    if (screen) {
      setActivePage(screen);
    }
  }, [screen]);

  const renderPage = () => {
    switch (activePage) {
      case "Home":
        return <SettingsPage />;
      case "surveillance":
        return <SurveillanceCard />;
      case "Tracking":
        return <Tracking />;
      default:
        return <SettingsPage />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {renderPage()}
      <Footer activeIcon={activePage} setActivePage={setActivePage} />
    </SafeAreaView>
  );
}
