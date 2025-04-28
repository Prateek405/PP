// NomineeList.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";

const NomineeList = ({ nominees, handleDeleteNominee }) => {
  if (!nominees.length) {
    return (
      <View style={styles.noNomineeContainer}>
        <Text style={styles.noNomineeText}>No valid nominees found.</Text>
      </View>
    );
  }

  return (
    <>
      {nominees.map((nominee, index) => (
        <View style={styles.sectionBody} key={index}>
          <TouchableOpacity
            style={styles.profile}
            onPress={() => {
              // Optional: Handle nominee press (e.g., show details)
            }}
          >
            <Image
              source={{
                uri:
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.5&w=256&h=256&q=80",
              }}
              style={styles.profileAvatar}
            />
            <View style={styles.profileBody}>
              <Text style={styles.profileName}>{nominee.nomineeName}</Text>
              <Text style={styles.profileHandle}>{nominee.mobileNumber}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteNominee(index)}>
              <FeatherIcon color="#000" name="trash-2" size={24} />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  sectionBody: {
    marginBottom: 12,
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  profileBody: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#292929",
  },
  profileHandle: {
    fontSize: 14,
    color: "#858585",
    marginTop: 2,
  },
  noNomineeContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  noNomineeText: {
    fontSize: 16,
    color: "#555",
  },
});

export default NomineeList;
