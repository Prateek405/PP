import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const CustomLoader = ({ isVisible }) => {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#0000ff', '#ff0000', '#00ff00', '#ffff00', '#ff00ff','#7df9ff'];

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
      }, 200); 

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={colors[colorIndex]} />
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default CustomLoader;

