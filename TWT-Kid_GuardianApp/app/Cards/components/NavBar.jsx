import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
  Modal,
  useColorScheme,
} from "react-native";
import Avatar from "../../../asset/icon/cat-photo.png";
import Icon from "react-native-vector-icons/FontAwesome";
import MenuBar from "./imageOfComponent/menu-bar.png";

import { useRouter } from "expo-router";
import { launchImageLibrary } from "react-native-image-picker";

import { getProfileData } from "../../../utils/sqlite";

const { width, height } = Dimensions.get("window");

const NavBar = ({ navigation }) => {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState("Daily");
  const [profileData, setProfileData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleBar, setModalVisibleBar] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [avatarSource, setAvatarSource] = useState(null);
  const dropdownAnim = useRef(new Animated.Value(0)).current;

  const animationValue = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-width)).current;
  // const { theme, toggleTheme } = useTheme();

  const borderAnim = useRef(new Animated.Value(0)).current;
  const colorCycleAnim = useRef(new Animated.Value(0)).current;

  const toggleTheme = () => {
    console.log("dark");
  };

  useEffect(() => {
    getProfileData().then((data) => {
      setProfileData(data);
    });
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(animationValue, {
          toValue: 0,
          duration: 800,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [animationValue]);

  let value = profileData?.name || "";

  const Button = ({ title, isActive, onPress }) => {
    const backgroundColor = isActive
      ? animationValue.interpolate({
          inputRange: [0, 1],
          outputRange: ["#F0A8D0", "#F7B5CA"],
        })
      : "#FFFFFF";

    return (
      <TouchableOpacity onPress={onPress}>
        <Animated.View style={[styles.button, { backgroundColor }]}>
          <Text
            style={[styles.buttonText, isActive && styles.activeButtonText]}
          >
            {title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const handleAvatarClick = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 100,
      useNativeDriver: false,
    }).start(() => {
      setModalVisible(false);
    });
  };

  const handleBarClick = () => {
    setModalVisibleBar(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const handleBarCloseModal = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      setModalVisibleBar(false);
    });
  };

  useEffect(() => {
    if (modalVisible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [modalVisible]);
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    Animated.timing(dropdownAnim, {
      toValue: dropdownVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const dropdownHeight = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust this value based on the height of your dropdown content
  });

  const borderColors = colorCycleAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: ["#D16D82", "#D1A182", "#82D1D1", "#82D16D", "#D16D82"],
  });
  const borderStyle = {
    // borderColor: borderColors,
    // borderWidth: theme === 'dark' ? 5 : 0,
    // borderRadius: theme === 'dark' ? 40 : 0,
  };

  const gender = profileData?.gender;
  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorCode) {
        console.log("Image Picker Error: ", response.errorMessage);
      } else {
        const source = { uri: response.assets[0].uri };
        setAvatarSource(source);
        // Handle the image upload to your server or update state here
      }
    });
  };
  let theme = "";

  return (
    <>
      {(
        <View style={[styles.container]}>
          <View style={styles.headerContainer}>
            {/* <TouchableOpacity onPress={handleBarClick}> */}
              {/* <Icon name="bars" size={25} color="#D16D82" /> */}
              {/* <Image source={MenuBar} style={styles.icon} /> */}
            {/* </TouchableOpacity> */}
            <Text style={[styles.headerText, ""]}>Hello, {value}</Text>
            {/* <BluetoothVibrateIcon /> */}
            <TouchableOpacity>
              {/* <Image source={Avatar} style={styles.avatar} /> */}
              <Animated.View style={[styles.avatar, borderStyle]}>
                <Image source={Avatar} style={styles.avatarImage} />
              </Animated.View>
            </TouchableOpacity>
          </View>

          <Modal
            transparent
            visible={modalVisibleBar}
            animationType="none"
            onRequestClose={handleBarCloseModal}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={handleBarCloseModal}
            />
            <Animated.View
              style={[
                styles.modalContainer,
                { width: "85%", transform: [{ translateX: slideAnim }] },
              ]}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  {/* <Image source={Avatar} style={styles.modalAvatar} /> */}
                  <Animated.View style={[styles.avatar, borderStyle]}>
                    <Image source={Avatar} style={styles.avatarImage} />
                  </Animated.View>

                  <TouchableOpacity
                    onPress={handleBarCloseModal}
                    style={styles.modalCloseButton}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalBody}>
                  <Text style={[styles.modalNameText, ""]}>
                    {profileData?.name || "Raju Yadav"}
                  </Text>
                  <Text style={[styles.modalText, ""]}>
                    Device ID: {profileData?.deviceId || "Infinix X6832"}
                  </Text>
                  <Text style={[styles.modalText, styles.marginBottom, ""]}>
                    Email: {profileData?.email || "yadavxraju@gmail.com"}
                  </Text>
                  <View style={styles.modalBorder} />
                  {/* <Icon name="user" size={20} color="#D16D82" /> */}
                  <TouchableOpacity
                    onPress={() => {
                      // handle onPress
                      router.push("ProfileSetup/Profile");
                    }}
                    style={styles.profile}
                  ></TouchableOpacity>

                  <View style={styles.modalBorder} />
                  <View style={styles.modalSection}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={[styles.modalSectionText, ""]}>
                        Settings and Support
                      </Text>
                    </View>
                    <Icon
                      name={dropdownVisible ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={dropdownVisible ? "#0000FF" : "#D16D82"}
                      onPress={toggleDropdown}
                      style={styles.chevronIcon}
                    />
                  </View>
                  {dropdownVisible && (
                    <>
                      <View style={styles.modalSection}>
                        <Icon name="cog" size={20} color="#D16D82" />
                        <Text style={[styles.modalSectionText, ""]}>
                          Settings and Privacy
                        </Text>
                      </View>
                      <View style={styles.modalSection}>
                        <Icon name="info-circle" size={20} color="#D16D82" />
                        <Text style={[styles.modalSectionText, ""]}>
                          Help Center
                        </Text>
                      </View>
                    </>
                  )}
                </View>

                <View style={[styles.modalSection, styles.darkModeSection]}>
                  <Icon name="moon-o" size={20} color="#D16D82" />
                  <Text style={[styles.modalSectionText, ""]}>Dark Mode</Text>
                  <TouchableOpacity
                    onPress={toggleTheme}
                    style={[styles.toggleButton, styles.lightToggleButton]}
                  >
                    <View
                      style={[styles.toggleCircle, styles.lightToggleCircle]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </Modal>

          {/* <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainerModalAvatar}>
          <View style={styles.modalContentModalAvatar}>
            <View style={styles.modalHeader}>
              
              <TouchableOpacity onPress={handleImageUpload}>
                <Image source={avatarSource} style={styles.modalAvatar} />
              </TouchableOpacity>
              <Text style={styles.modalNameText}>{profileData?.name || "N/A"}</Text>
            </View>
            <Text style={styles.modalText}>Email: {profileData?.email || "N/A"}</Text>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */}
          {/* <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainerModalAvatar}>
            <View style={styles.modalContentModalAvatar}>
              <TouchableOpacity onPress={handleImageUpload}>
                <Image source={avatarSource?Avatar:avatarSource} style={styles.modalAvatar} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}
          <Modal
            transparent={true}
            animationType="slide"
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <View style={styles.modalContainerModalAvatar}>
              <View style={styles.modalContentModalAvatar}>
                <TouchableOpacity onPress={handleImageUpload}>
                  <Image
                    source={{ uri: avatarSource }}
                    style={styles.modalAvatar}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFDFD",
  },
  darkText: {
    color: "#FFFFFF",
  },
  darkModeSection: {
    marginTop: 10,
  },
  darkTheme: {
    backgroundColor: "#333333",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
    marginLeft: 2,
  },
  headerText: {
    color: "#D16D82",
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 25,
    marginLeft: 10,
    flex: 1,
  },
  avatarImage: {
    width: "100%",
    height: "95%",
    borderRadius: 15,
    marginLeft:5
  },
  avatar: {
    // width: 40,
    // height: 40,
    // borderRadius: 20,
    // marginRight: 15,
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: "hidden",
    marginRight: 10,
  },
  cardContainer: {
    width: width - 10,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  button: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D16D82",
    width: (width - 60) / 3,
    alignItems: "center",
  },
  buttonText: {
    color: "#D16D82",
    fontWeight: "bold",
  },
  activeButtonText: {
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: height,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContent: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  modalContainerModalAvatar: {
    flex: 1,
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the content horizontally
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentModalAvatar: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    justifyContent: "space-between",
  },
  modalAvatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  modalNameText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 14,
    // marginBottom: 10,
  },
  modalBody: {
    // alignItems: 'flex-start',
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 15,
    width: "100%",
    justifyContent: "space-between",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#D16D82",
    borderRadius: 5,
  },
  modalCloseButton: {
    padding: 10,
    backgroundColor: "#D16D82",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  modalSection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    // justifyContent: 'space-between',
  },

  modalBorder: {
    borderBottomColor: "#D16D82",
    borderBottomWidth: 1,
    width: "100%",
    marginVertical: 15,
  },
  modalSectionText: {
    fontSize: 18,
    marginLeft: 10,
  },
  chevronIcon: {
    marginLeft: 80, // Ensures the chevron icon is aligned to the right
  },

  themeToggleButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    padding: 10,
    backgroundColor: "#D16D82",
    borderRadius: 20,
  },
  themeToggleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  toggleButton: {
    marginLeft: 10,
    width: 40,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  darkToggleButton: {
    backgroundColor: "#89CFF0",
  },
  lightToggleButton: {
    backgroundColor: "#cccccc",
  },
  toggleCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  darkToggleCircle: {
    backgroundColor: "#ffffff",
    alignSelf: "flex-end",
  },
  lightToggleCircle: {
    backgroundColor: "#000000",
    alignSelf: "flex-start",
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 1,
  },
  profileAvatar: {
    width: 30,
    height: 30,
    borderRadius: 9999,
    marginRight: 1,
  },
  // profilePosition:{
  //   flex:'row'
  // }
});

export default NavBar;
