import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

const SmartWatchLoader = () => {
  const watchAnimation = useRef(new Animated.Value(0)).current;
  const handAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const watchAnimationLoop = Animated.loop(
      Animated.timing(watchAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    const handAnimationLoop = Animated.loop(
      Animated.timing(handAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );

    watchAnimationLoop.start();
    handAnimationLoop.start();

    return () => {
      watchAnimationLoop.stop();
      handAnimationLoop.stop();
    };
  }, [watchAnimation, handAnimation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.watch,
          {
            transform: [
              {
                scale: watchAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.watchFace}>
          <Animated.View
            style={[
              styles.watchHand,
              {
                transform: [
                  {
                    rotate: handAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  watch: {
    width: 80,
    height: 80,
    borderWidth: 4,
    borderColor: "#2FAC9B",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  watchFace: {
    width: 60,
    height: 60,
    borderWidth: 4,
    borderColor: "#2FAC9B",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  watchHand: {
    width: 4,
    height: 20,
    backgroundColor: "#2FAC9B",
    borderRadius: 2,
    position: "absolute",
    top: 20,
  },
});

export default SmartWatchLoader;
