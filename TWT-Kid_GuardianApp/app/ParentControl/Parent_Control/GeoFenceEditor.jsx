// GeofencingEditor.jsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button, Alert, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { startBackgroundTask } from '../BackgroundWork/backgroundTask';
import { saveGeofences, getGeofences } from '../../../utils/geofence';

const MapWithPolygon = ({ route, navigation }) => {
  const [polygonCoords, setPolygonCoords] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadGeofences = async () => {
      try {
        const storedGeofences = await getGeofences();
        if (storedGeofences) {
          setGeofences(storedGeofences);
        }
      } catch (error) {
        console.error('Error loading geofences:', error);
        Alert.alert('Error', 'Failed to load existing geofences');
      } finally {
        setLoading(false);
      }
    };
    
    loadGeofences();
  }, []);

  const startDrawing = () => {
    setDrawing(true);
    setPolygonCoords([]);
    Alert.alert(
      'Drop Points',
      'Tap on the map to drop points for the geofence. When finished, tap "Confirm Geofence".',
    );
  };

  const confirmGeofence = async () => {
    setDrawing(false);
    if (polygonCoords.length > 0) {
      try {
        const newPolygonCoords = calculatePolygon(polygonCoords);
        const updatedGeofences = [...geofences, newPolygonCoords];
        await saveGeofences(updatedGeofences);
        setGeofences(updatedGeofences);

        // Start background task and notify parent
        await startBackgroundTask();
        if (route.params?.onGeofenceConfirmed) {
          route.params.onGeofenceConfirmed(true);
        }

        Alert.alert(
          'Geofence Saved',
          'Geofence has been created and saved successfully.'
        );
      } catch (error) {
        console.error('Error saving geofence:', error);
        Alert.alert('Error', 'Failed to save geofence');
      }
    } else {
      Alert.alert('Error', 'No geofence coordinates found.');
    }
  };

  const clearCurrentPolygon = () => {
    setPolygonCoords([]);
  };

  const clearAllPolygons = async () => {
    try {
      await saveGeofences([]);
      setGeofences([]);
      Alert.alert('Success', 'All geofences have been cleared');
    } catch (error) {
      console.error('Error clearing geofences:', error);
      Alert.alert('Error', 'Failed to clear geofences');
    }
  };

  const addNewGeofence = () => {
    startDrawing();
  };

  const calculatePolygon = points => {
    // Sort points by x-coordinate
    points.sort((a, b) => a.longitude - b.longitude || a.latitude - b.latitude);

    // Function to find the convex hull using Graham's Scan algorithm
    const convexHull = points => {
      const cross = (O, A, B) =>
        (A.latitude - O.latitude) * (B.longitude - O.longitude) -
        (A.longitude - O.longitude) * (B.latitude - O.latitude);

      const lower = [];
      for (const p of points) {
        while (
          lower.length >= 2 &&
          cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0
        ) {
          lower.pop();
        }
        lower.push(p);
      }

      const upper = [];
      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        while (
          upper.length >= 2 &&
          cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0
        ) {
          upper.pop();
        }
        upper.push(p);
      }

      return lower.slice(0, -1).concat(upper.slice(0, -1));
    };

    // Find convex hull
    const hull = convexHull(points);

    return hull;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
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
        onPress={
          drawing
            ? e =>
                setPolygonCoords([...polygonCoords, e.nativeEvent.coordinate])
            : null
        }
        style={styles.map}
        initialRegion={{
          latitude: 28.7041,
          longitude: 77.1025,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {geofences.map((coords, index) => (
          <Polygon
            key={index}
            coordinates={coords}
            fillColor="rgba(0,255,0,0.5)"
            strokeWidth={2}
          />
        ))}
        {drawing && polygonCoords.length > 2 && (
          <Polygon coordinates={calculatePolygon(polygonCoords)} />
        )}
        {drawing &&
          polygonCoords.map((coordinate, index) => (
            <Marker key={index} coordinate={coordinate} pinColor="red" />
          ))}
      </MapView>

      {geofences.length === 0 && (
        <Button title="Add Geofence" onPress={startDrawing} />
      )}

      {geofences.length > 0 && (
        <Button title="Add New Geofence" onPress={addNewGeofence} />
      )}

      {drawing && (
        <>
          <Button
            title="Confirm Geofence"
            onPress={confirmGeofence}
            disabled={polygonCoords.length < 2}
          />
          <Button title="Clear Current Polygon" onPress={clearCurrentPolygon} />
        </>
      )}

      {geofences.length > 0 && (
        <Button title="Clear All Polygons" onPress={clearAllPolygons} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 70,
  },
  map: {
    flex: 1,
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

export default MapWithPolygon;
