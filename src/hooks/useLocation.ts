import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { TrackedCoordinate } from '../services/locationService';

export const useLocation = (isTracking: boolean) => {
  const [currentLocation, setCurrentLocation] = useState<TrackedCoordinate | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (!isTracking || !hasPermission) return;

    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 5,
          timeInterval: 1000,
        },
        (location) => {
          const { latitude, longitude, altitude, speed } = location.coords;
          setCurrentLocation({
            lat: latitude,
            lng: longitude,
            altitude: altitude || null,
            speed: speed || null,
            timestamp: new Date(location.timestamp),
          });
        },
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isTracking, hasPermission]);

  return { currentLocation, hasPermission };
};
