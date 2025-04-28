import AsyncStorage from '@react-native-async-storage/async-storage';
import { startBackgroundTask, stopBackgroundTask } from '../app/ParentControl/BackgroundWork/backgroundTask';

const GEOFENCE_STORAGE_KEY = '@geofences';
const NOTIFICATION_STATUS_KEY = '@notification_status';

export const saveGeofences = async (geofences) => {
  try {
    await AsyncStorage.setItem(GEOFENCE_STORAGE_KEY, JSON.stringify(geofences));
  } catch (error) {
    console.error('Error saving geofences:', error);
  }
};

export const getGeofences = async () => {
  try {
    const geofencesJson = await AsyncStorage.getItem(GEOFENCE_STORAGE_KEY);
    return geofencesJson ? JSON.parse(geofencesJson) : [];
  } catch (error) {
    console.error('Error getting geofences:', error);
    return [];
  }
};

export const setNotificationStatus = async (isActive) => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_STATUS_KEY, JSON.stringify(isActive));
    if (isActive) {
      await startBackgroundTask();
    } else {
      await stopBackgroundTask();
    }
  } catch (error) {
    console.error('Error setting notification status:', error);
  }
};

export const getNotificationStatus = async () => {
  try {
    const status = await AsyncStorage.getItem(NOTIFICATION_STATUS_KEY);
    return status ? JSON.parse(status) : false;
  } catch (error) {
    console.error('Error getting notification status:', error);
    return false;
  }
};