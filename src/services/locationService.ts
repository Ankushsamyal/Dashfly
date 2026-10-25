import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { supabase } from './supabase';

export interface TrackedCoordinate {
  lat: number;
  lng: number;
  altitude: number | null;
  speed: number | null;
  timestamp: Date;
}

const LOCATION_TASK_NAME = 'background-location-task';

export const requestLocationPermissions = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return false;

  const bgStatus = await Location.requestBackgroundPermissionsAsync();
  return bgStatus.status === 'granted';
};

export const startLocationTracking = async (
  onLocationUpdate: (coord: TrackedCoordinate) => void,
): Promise<Location.LocationSubscription> => {
  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 5,
      timeInterval: 1000,
    },
    (location) => {
      const { latitude, longitude, altitude, speed } = location.coords;
      onLocationUpdate({
        lat: latitude,
        lng: longitude,
        altitude: altitude || null,
        speed: speed || null,
        timestamp: new Date(location.timestamp),
      });
    },
  );
};

export const stopLocationTracking = async (
  subscription: Location.LocationSubscription | null,
): Promise<void> => {
  if (subscription) {
    subscription.remove();
  }
};

export const startBackgroundLocationTask = async (
  userId: string,
  activityId: string,
): Promise<void> => {
  TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
    if (error) return;
    if (data) {
      const { locations } = data as { locations: Location.LocationObject[] };
      for (const location of locations) {
        const { latitude, longitude, altitude, speed } = location.coords;
        void supabase
          .from('activity_coordinates')
          .insert({
            activity_id: activityId,
            lat: latitude,
            lng: longitude,
            altitude: altitude,
            speed: speed,
            timestamp: new Date(location.timestamp).toISOString(),
          })
      }
    }
  });

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 5,
    timeInterval: 2000,
    foregroundService: {
      notificationTitle: 'Activity Tracking',
      notificationBody: 'Recording your activity...',
      notificationColor: '#FC4C02',
    },
  });
};

export const stopBackgroundLocationTask = async (): Promise<void> => {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
  if (isRegistered) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
  }
};

export const getCurrentPosition = async (): Promise<Location.LocationObject | null> => {
  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
  } catch {
    return null;
  }
};

export const reverseGeocode = async (
  lat: number,
  lng: number,
): Promise<Location.LocationGeocodedAddress | null> => {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
    return results[0] || null;
  } catch {
    return null;
  }
};
