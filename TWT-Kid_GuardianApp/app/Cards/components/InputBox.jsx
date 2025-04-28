import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from "react-native-date-picker";
// import VideoPlayer from "./VideoPlayer";

const InputBox = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.inputBoxContainer}>
      <TouchableOpacity onPress={() => setOpen(true)} style={styles.dateButton}>
        <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        mode="date"
        theme="light" // Use 'light' for the closest match
        textColor="#FFFFFF" // Set text color to white
        fadeToColor="#F8E7E8" // Set fade background color
        title="Select Date"
        titleStyle={{ color: "#FFFFFF", fontWeight: "bold" }} // White text for title
        confirmText="Confirm"
        confirmTextStyle={{ color: "#FFFFFF", fontWeight: "bold" }} // White text for confirm button
        cancelText="Cancel"
        cancelTextStyle={{ color: "#F8E7E8" }} // Pastel color for cancel text
      />

     
    </View>
  );
};

const styles = StyleSheet.create({
  inputBoxContainer: {
    marginTop: 0,
  },
  dateButton: {
    backgroundColor: "#FF85A1",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default InputBox;
