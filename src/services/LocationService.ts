import * as Location from 'expo-location';
import { NoteLocation } from './StorageService';

export const getCurrentLocation = async (): Promise<NoteLocation | null> => {
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied by user.');
      return null;
    }

    const locationData = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: locationData.coords.latitude,
      longitude: locationData.coords.longitude,
      timestamp: locationData.timestamp,
    };
  } catch (error) {
    console.error('Error getting current location', error);
    return null;
  }
};