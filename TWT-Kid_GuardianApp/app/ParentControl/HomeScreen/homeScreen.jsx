// HomeScreen.jsx
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Footer from "../../../component/Footer";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
  startBackgroundTask,
  stopBackgroundTask,
  isBackgroundTaskRunning,
} from "../BackgroundWork/backgroundTask";

const HomeScreen = ({ navigation }) => {
  const [isBackgroundTaskRunningState, setIsBackgroundTaskRunningState] = useState(false);
  const scaleAnimatedValue = new Animated.Value(1);
  let animationLoop = null;

  useEffect(() => {
    // Check background task status when the screen is opened
    const checkBackgroundTaskStatus = async () => {
      const isRunning = await isBackgroundTaskRunning();
      setIsBackgroundTaskRunningState(isRunning);
      if (isRunning) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    checkBackgroundTaskStatus();
    startAnimation();
    return () => stopAnimation();
  }, []);

  const startAnimation = () => {
    animationLoop = Animated.loop(
      Animated.timing(scaleAnimatedValue, {
        toValue: 1.5,
        duration: 10000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    animationLoop.start();
  };

  const stopAnimation = () => {
    if (animationLoop) animationLoop.stop();
  };

  const toggleBackgroundTask = async () => {
    if (!isBackgroundTaskRunningState) {
      await startBackgroundTask();
      setIsBackgroundTaskRunningState(true);
      stopAnimation();
    } else {
      await stopBackgroundTask();
      setIsBackgroundTaskRunningState(false);
      startAnimation();
    }
  };

  const handleGeofenceConfirmed = (isRunning) => {
    setIsBackgroundTaskRunningState(isRunning);
    if (isRunning) {
      stopAnimation();
    }
  };

  const scaleEffect = {
    transform: [{ scale: scaleAnimatedValue }],
  };

  return (
    <LinearGradient
      colors={["#F8E6E6", "#FFBFD4", "#F8E6E6"]}
      style={styles.container}
    >
      <StatusBar
        animated={true}
        backgroundColor="#F8E7E8"
        barStyle="dark-content"
      />
      <View style={styles.headerContainer}>
        <Animated.View style={[styles.iconContainer, scaleEffect]}>
          <FontAwesome5 name="map-marked-alt" size={70} color="#FF6F61" />
        </Animated.View>
        <Text style={styles.headerText}>
          Guardians of Joy, Nurturers of Dreams — We're Here, Taking Care of
          Your Precious Little Stars.
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("ChildLocation")}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="location-arrow" size={45} color="#000" />
            <Text style={styles.cardTitle}>Live Location</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("GeofenceEditor", {
                onGeofenceConfirmed: handleGeofenceConfirmed,
              })
            }
            activeOpacity={0.8}
          >
            <FontAwesome5 name="draw-polygon" size={45} color="#000" />
            <Text style={styles.cardTitle}>Create Geofence</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.card,
              isBackgroundTaskRunningState ? styles.cardActive : styles.cardInactive,
            ]}
            onPress={toggleBackgroundTask}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name={isBackgroundTaskRunningState ? "bell-slash" : "bell"}
              size={45}
              color="#000"
            />
            <Text style={styles.cardTitle}>
              {isBackgroundTaskRunningState ? "Stop" : "Start"} Notifications
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Footer />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 10,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B4B4B",
    textAlign: "center",
    marginTop: 50,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  cardContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFD1DC",
    borderRadius: 15,
    padding: 15,
    flex: 1,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: 130,
    justifyContent: "center",
    marginHorizontal: 10,
  },
  cardActive: {
    backgroundColor: "#00A676",
  },
  cardInactive: {
    backgroundColor: "#FF6F61",
  },
  cardTitle: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    fontWeight: "600",
  },
});

export default HomeScreen;