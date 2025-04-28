import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';
import * as geolib from 'geolib';
import { getGeofences } from '../../../utils/geofence';

export default function App({ navigation }) {
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastLocation, setLastLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const loadGeofences = async () => {
      try {
        const storedGeofences = await getGeofences();
        setGeofences(storedGeofences || []);
      } catch (error) {
        console.error('Error loading geofences:', error);
        Alert.alert('Error', 'Failed to load geofences');
      } finally {
        setLoading(false);
      }
    };

    loadGeofences();
  }, []);

  useEffect(() => {
    if (geofences.length === 0) return;

    const checkLocation = location => {
      const isInside = geofences.some(fence => 
        geolib.isPointInPolygon(
          {
            latitude: location.lat,
            longitude: location.lng,
          },
          fence
        )
      );

      if (isInside) {
        Alert.alert(
          'Safe',
          "Rest easy, your little one is cradled in safety's embrace.Under our watchful gaze, your child thrives in the haven of safety and care",
        );
        setLastLocation(location);
      } else {
        Alert.alert(
          'Urgent Alert',
          'Your child might be in an unsafe situation.Your immediate attention is crucial to ensure their well-being.',
        );
        setLastLocation(lastLocation);
      }

      //   setWithinGeofence(isInside);
    };

    const location = {lat: 28.6139, lng: 77.2295}; // Initial user location near India Gate
    checkLocation(location);

    const intervalId = setInterval(() => {
      // For testing, you might want to use actual location here
      const updatedLocation = {
        lat: 28.7041,
        lng: 77.1025,
      };
      checkLocation(updatedLocation);
    }, 15000);

    return () => clearInterval(intervalId);
  }, [geofences]);

  if (loading) {
    return (
      <View style={[styles.map, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Image
          source={require('../../../asset/icon/chevron-left.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <MapView
      style={styles.map}
      region={{
        latitude: 28.6139,
        longitude: 77.2295,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}>
      {geofences.map((fence, index) => (
        <Polygon
          key={index}
          coordinates={fence}
          fillColor="rgba(0,255,0,0.5)"
          strokeWidth={2}
        />
      ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
});
