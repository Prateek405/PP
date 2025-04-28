import { router, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import FeatherIcon from "react-native-vector-icons/Feather";

import { getProfileData } from "../../utils/sqlite";

export default function Example() {
  const [profileData, setProfileData] = useState(null);
  const [userName, setuserName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  // Removed: weight, height
  const [email, setEmail] = useState("");

  const detailsData = [
    { label: "Name", value: userName, icon: "user" },
    { label: "Age", value: age, icon: "calendar" },
    // Removed: Weight and Height
  ];

  useEffect(() => {
    const ProfileData = async () => {
      try {
        getProfileData(null).then((data) => {
          if (data) {
            setuserName(data.name);
            setAge(data.age);
            // Removed: setHeight(data.height); setWeight(data.weight);
          }
        });
      } catch (error) {
        console.error("Error fetching profile data: ", error);
      }
    };

    ProfileData();
  }, []);

  useEffect(() => {}, []);

  const router = useRouter();
  const gender = "male";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8E7E8" }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profile}>
          <Image
            alt=""
            source={
              gender === "male"
                ? require("../../asset/icon/Male.png")
                : require("../../asset/icon/Female.png")
            }
            style={styles.profileAvatar}
          />
          <Text style={styles.profileName}>{userName}</Text>
          <TouchableOpacity
            onPress={() => {
              router.push("ProfileSetup/UpdateProfile");
            }}
          >
            <View style={styles.profileAction}>
              <Text style={styles.profileActionText}>Edit Profile</Text>

              <FeatherIcon name="edit" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerInset} />
        </View>

        <View style={styles.details}>
          <Text style={[styles.detailsTitle, styles.detailsHeadColor]}>
            Details
          </Text>
          {detailsData.map((item, index) => (
            <View style={styles.detailsRow} key={index}>
              <View style={styles.iconContainer}>
                <FeatherIcon name={item.icon} size={20} color="#4b6588" />
              </View>
              <View style={styles.detailsFieldContainer}>
                <Text style={[styles.detailsField, styles.detailsTextColor]}>
                  {item.label}
                </Text>
              </View>
              <View style={styles.detailsValueContainer}>
                <Text style={styles.detailsValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  /** Profile */
  profile: {
    padding: 16,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFD1DC",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  profileName: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  profileEmail: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "400",
    color: "#666",
  },
  profileAction: {
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF85A1",
    borderRadius: 12,
  },
  profileActionText: {
    marginRight: 8,
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },

  /** Divider */
  divider: {
    overflow: "hidden",
    width: "100%",
    marginVertical: 16,
  },
  dividerInset: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#FF85A1",
    borderStyle: "dashed",
    marginTop: -2,
  },

  /** Details */
  detailsTextColor: {
    color: "#4b6588",
  },
  details: {
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  detailsHeadColor: {
    color: "#FF85A1",
  },
  detailsRow: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F8E7E8",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 8,
  },
  detailsFieldContainer: {
    flex: 1,
    paddingRight: 8,
  },
  detailsField: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "600",
  },
  detailsValueContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  detailsValue: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    color: "#444",
  },
});
