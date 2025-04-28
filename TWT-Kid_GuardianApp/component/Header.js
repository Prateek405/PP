import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Header = ({ setActiveCard, activeCard }) => {
  const handlePress = (option) => {
    setActiveCard(option);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handlePress("Daily")}>
        <Text
          style={[
            styles.button,
            styles.option,
            activeCard === "Daily" && styles.activeOption,
          ]}
        >
          Daily
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress("Weekly")}>
        <Text
          style={[
            styles.button,
            styles.option,
            activeCard === "Weekly" && styles.activeOption,
          ]}
        >
          Weekly
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handlePress("Monthly")}>
        <Text
          style={[
            styles.button,
            styles.option,
            activeCard === "Monthly" && styles.activeOption,
          ]}
        >
          Monthly
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around", // Ensures equal spacing
    padding: 10,
  },
  button: {
    paddingHorizontal: 10,
  },
  option: {
    fontSize: 15,
    color: "#555555",
    padding: 15,
  },
  activeOption: {
    borderRadius: 2,
    margin: 1,
    color: "black",
    fontWeight: "bold",
    backgroundColor: "#FFC7ED",
  },
});

export default Header;
