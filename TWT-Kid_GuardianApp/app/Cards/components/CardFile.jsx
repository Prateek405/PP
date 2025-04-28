import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import VideoPlayer from './VideoPlayer';
import { RadioButton } from 'react-native-paper';
import InputBox from './InputBox';

const Card5 = () => {
  const [isPopupVisible, setPopupVisible] = useState(true);
  const [isRadioSelected, setRadioSelected] = useState(false);

  const handleRadioPress = () => {
    setRadioSelected(true);
    setPopupVisible(false);
  };

  const videoName = "Watch Video";

  return (
    <View style={styles.card}>
      <Text style={styles.cardHeader}>Your Kids Surveillance Data</Text>
      
      <View style={styles.details}>
        <Text style={styles.label}>Date</Text>
        <InputBox />
      </View>
      
      <View style={styles.details}>
        <Text style={styles.label}>Data Uploaded: 1 GB</Text>
      </View>
      
      <View style={styles.container}>
        <Text style={styles.videoTitle}>{videoName}</Text>
        <View style={styles.videoContainer}>
          <VideoPlayer />
        </View>
      </View>
      
      {isPopupVisible && (
        <Modal
          transparent={true}
          visible={isPopupVisible}
          animationType="fade"
          onRequestClose={() => setPopupVisible(false)}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popupContent}>
              <Text style={styles.popupText}>
                Your uploaded data is secure. Faces are masked for privacy, and unmasked data is only accessible to law enforcement upon request. Your data is encrypted, and only you hold the key to access it.
              </Text>
              <View style={styles.radioContainer}>
                <RadioButton
                  value="selected"
                  status={isRadioSelected ? 'checked' : 'unchecked'}
                  onPress={handleRadioPress}
                />
                <Text style={styles.radioLabel}>I understand</Text>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    margin: 6,
    marginBottom: 15,
    marginTop: 15,
  },
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  details: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5, // Added for better spacing
  },
  container: { // Added missing 'container' style
    marginTop: 10,
  },
  videoContainer: {
    marginTop: 10, // Adds margin from the top of the video player
  },
  videoTitle: {
    fontSize: 16, // Adjust font size as needed
    fontWeight: '600', // Slightly bold
    marginBottom: 5, // Space between text and video player
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  popupContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default Card5;
