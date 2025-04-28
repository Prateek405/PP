// footer page 


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
} from "react-native";

const Footer = ({ activeIcon, setActivePage }) => {
  const [backPressCount, setBackPressCount] = useState(0);

  const ICONS = [
    {
      name: "Home",
      label: "Home",
      image: require("../asset/img/home.png"),
    },
    
    {
      name: "Tracking",
      label: "Tracking",
      image: require("../asset/icon/location.png"),
    },
    // {
    //   name: "VideoCall",
    //   label: "VideoCall",
    //   image: require("../asset/icon/VideoText.png"),
    // },
    {
      name: "surveillance",
      label: "Surveillance",
      image: require("../asset/img/video-camera.png"),
    },
  ];

  const PRIMARY_COLOR = "#2E716D";
  const SECONDARY_COLOR = "#2D2D2D";

  const handleIconPress = (iconName) => {
    setActivePage(iconName);
    setBackPressCount(0); // Reset back press count
  };

  const handleBackPress = () => {
    if (activeIcon === "Home") {
      if (backPressCount === 0) {
        setBackPressCount(1);
        ToastAndroid.show("Press again to exit the app", ToastAndroid.SHORT);
        setTimeout(() => setBackPressCount(0), 2000);
        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    } else {
      setActivePage("Home");
      return true;
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    return () => backHandler.remove();
  }, [backPressCount, activeIcon]);

  const getIconStyle = (iconName) => ({
    tintColor: activeIcon === iconName ? PRIMARY_COLOR : SECONDARY_COLOR,
  });

  const getTextStyle = (iconName) => ({
    color: activeIcon === iconName ? PRIMARY_COLOR : SECONDARY_COLOR,
  });

  return (
    <View style={styles.footer}>
      {ICONS.map((icon) => (
        <TouchableOpacity
          key={icon.name}
          style={styles.iconContainer}
          onPress={() => handleIconPress(icon.name)}
        >
          <Image
            source={icon.image}
            style={[styles.iconImage, getIconStyle(icon.name)]}
          />
          <Text style={[styles.iconLabel, getTextStyle(icon.name)]}>
            {icon.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "aliceblue",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    alignItems: "center",
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
});

export default Footer;
