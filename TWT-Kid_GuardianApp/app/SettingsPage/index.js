// design - 6

import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useRouter } from "expo-router";
import { getProfileData } from "../../utils/sqlite.js";
import { insertDummyData } from "../../utils/dummyData.js";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBar from "../Cards/components/NavBar";


export default function Example() {
  const [profileData, setProfileData] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [borderColor, setBorderColor] = useState(new Animated.Value(0));
  const animatedOpacity = new Animated.Value(0);
  const vibration = new Animated.Value(0);
  const router = useRouter();


  const interpolatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF85A2", "#FF85A2"],
  });

  const gender = profileData?.gender;

  return (
    <View style={[styles.gradientBackground, { backgroundColor: "#FFE5EB" }]}>

      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          animated={true}
          backgroundColor="#FFE3E9"
          barStyle="dark-content"
        />
        <View style={styles.container}>
          
            <View>
              <View style={styles.header}>
                <NavBar />
              </View>
            </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* Account Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: "#000" }]}>Account</Text>
              <View style={styles.cardContainer}>
                <TouchableOpacity
                  onPress={() => {
                    router.push({
                      pathname: "LandingScreen/SettingLandingScreen",
                      params: { screen: "Profile" },
                    });
                  }}
                  style={styles.card}
                >
                  <Image
                    source={
                      gender === "male"
                        ? require("../../asset/icon/Male.png")
                        : require("../../asset/icon/Female.png")
                    }
                    style={styles.cardIcon}
                  />
                  <Text style={styles.cardText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => insertDummyData()}
                  style={styles.card}
                >
                  <FeatherIcon name="database" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Add Dummy Data</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "LandingScreen/SettingLandingScreen",
                      params: { screen: "contact" },
                    })
                  }
                  style={styles.card}
                >
                  <FeatherIcon name="user-plus" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Add Approved Contact</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "LandingScreen/SettingLandingScreen",
                      params: { screen: "StorageSetting" },
                    })
                  }
                  style={styles.card}
                >
                  <FeatherIcon name="hard-drive" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Storage Setting</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Preferences Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              <View style={styles.cardContainer}>
                <TouchableOpacity style={styles.card}>
                  <FeatherIcon name="globe" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Language</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "LandingScreen/SettingLandingScreen",
                      params: { screen: "Nominee" },
                    })
                  }
                  style={styles.card}
                >
                  <FeatherIcon name="user-check" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Nominate for SOS</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "LandingScreen/SettingLandingScreen",
                      params: { screen: "Subscription" },
                    })
                  }
                  style={styles.card}
                >
                  <FeatherIcon name="dollar-sign" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Subscription Status</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "LandingScreen/SettingLandingScreen",
                      params: { screen: "Bluetooth" },
                    })
                  }
                  style={styles.card}
                >
                  <FeatherIcon name="bluetooth" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Bluetooth Setup</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "LandingScreen/SettingLandingScreen",
                      params: { screen: "AesKey" },
                    })
                  }
                  style={styles.card}
                >
                  <FeatherIcon name="key" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Reset Encryption Key</Text>
                </TouchableOpacity> */}
              </View>
            </View>

            {/* Resources Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Resources</Text>
              <View style={styles.cardContainer}>
                <TouchableOpacity style={styles.card}>
                  <FeatherIcon name="mail" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Contact Us</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                  <FeatherIcon name="alert-circle" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Report Bug</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                  <FeatherIcon name="star" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Rate App</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.card}>
                  <FeatherIcon name="file-text" size={30} color="#FF85A2" />
                  <Text style={styles.cardText}>Terms & Privacy</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.footer}>App Version 2.24 #50491</Text>
          </ScrollView>
        </View>
      </SafeAreaView>
      </View>
  );
}

const styles = StyleSheet.create({
  gradientBackground: { flex: 1 , backgroundColor: "#FFE5EB"},
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  homeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    backgroundColor: "#FF85A2",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  bellIcon: { padding: 8 },
  welcomeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    padding: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF85A2",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 4,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    borderRadius: 20,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 20,
  },
});
