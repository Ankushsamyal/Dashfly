import React, { useRef, useCallback } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import MapView, { UrlTile, Marker, Polyline, PROVIDER_DEFAULT, MapViewProps } from 'react-native-maps';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { ORANGE } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

export interface LiveCoordinate {
  lat: number;
  lng: number;
  altitude?: number | null;
  speed?: number | null;
}

interface LiveMapProps {
  coordinates?: LiveCoordinate[];
  currentLocation?: LiveCoordinate | null;
  followUser?: boolean;
  showPolylines?: boolean;
  polylineColor?: string;
  polylineWidth?: number;
  showMarker?: boolean;
  region?: { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
  onRegionChangeComplete?: MapViewProps['onRegionChangeComplete'];
  style?: any;
}

export default function LiveMap({
  coordinates = [],
  currentLocation,
  followUser = true,
  showPolylines = true,
  polylineColor = '#FC4C02',
  polylineWidth = 4,
  showMarker = true,
  region,
  onRegionChangeComplete,
  style,
}: LiveMapProps) {
  const mapRef = useRef<MapView>(null);
  const markerScale = useSharedValue(1);

  React.useEffect(() => {
    markerScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
    );
  }, []);

  const markerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: markerScale.value }],
  }));

  const handleMapReady = useCallback(() => {
    if (currentLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500,
      );
    }
  }, [currentLocation]);

  return (
    <MapView
      ref={mapRef}
      style={[styles.map, style]}
      provider={PROVIDER_DEFAULT}
      showsUserLocation={followUser}
      showsCompass={false}
      showsMyLocationButton={false}
      showsScale={false}
      followsUserLocation={followUser && !region}
      onMapReady={handleMapReady}
      region={region || (currentLocation ? {
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      } : undefined)}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      {/* OpenStreetMap Tiles */}
      <UrlTile
        urlTemplate={OSM_TILE_URL}
        maximumZ={19}
        flipY={false}
        opacity={1}
        shouldReplaceMapContent={true}
      />

      {/* Route Polyline */}
      {showPolylines && coordinates.length > 1 && (
        <Polyline
          coordinates={coordinates.map((c) => ({
            latitude: c.lat,
            longitude: c.lng,
          }))}
          strokeColor={polylineColor}
          strokeWidth={polylineWidth}
          lineCap="round"
          lineJoin="round"
        />
      )}

      {/* Current Position Marker */}
      {showMarker && currentLocation && (
        <Marker
          coordinate={{
            latitude: currentLocation.lat,
            longitude: currentLocation.lng,
          }}
          anchor={{ x: 0.5, y: 0.5 }}
        >
          <Animated.View style={[styles.marker, markerStyle]}>
            <View style={styles.markerInner} />
          </Animated.View>
        </Marker>
      )}
    </MapView>
  );
}

/* Static snapshot map for activity cards/feed */
export function StaticMap({
  coordinates,
  mapHeight = 140,
  style,
}: {
  coordinates?: LiveCoordinate[];
  mapHeight?: number;
  style?: any;
}) {
  if (!coordinates || coordinates.length < 2) {
    return (
      <View style={[styles.staticMapPlaceholder, { height: mapHeight }, style]}>
        <Text style={styles.staticMapEmoji}>🗺</Text>
      </View>
    );
  }

  const centerLat = coordinates.reduce((sum, c) => sum + c.lat, 0) / coordinates.length;
  const centerLng = coordinates.reduce((sum, c) => sum + c.lng, 0) / coordinates.length;
  const latSpan = Math.max(...coordinates.map(c => c.lat)) - Math.min(...coordinates.map(c => c.lat));
  const lngSpan = Math.max(...coordinates.map(c => c.lng)) - Math.min(...coordinates.map(c => c.lng));
  const delta = Math.max(latSpan, lngSpan) * 1.3 || 0.005;

  return (
    <MapView
      style={[styles.staticMap, { height: mapHeight }, style]}
      provider={PROVIDER_DEFAULT}
      region={{
        latitude: centerLat,
        longitude: centerLng,
        latitudeDelta: delta,
        longitudeDelta: delta,
      }}
      scrollEnabled={false}
      zoomEnabled={false}
      rotateEnabled={false}
      pitchEnabled={false}
      showsUserLocation={false}
      showsCompass={false}
      showsMyLocationButton={false}
    >
      <UrlTile
        urlTemplate={OSM_TILE_URL}
        maximumZ={19}
        flipY={false}
        shouldReplaceMapContent={true}
      />
      <Polyline
        coordinates={coordinates.map((c) => ({ latitude: c.lat, longitude: c.lng }))}
        strokeColor={'#FC4C02'}
        strokeWidth={3}
        lineCap="round"
        lineJoin="round"
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: width,
    height: height,
  },
  marker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FC4C02',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  staticMap: {
    width: width,
  },
  staticMapPlaceholder: {
    width: width,
    backgroundColor: '#1C1C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staticMapEmoji: {
    fontSize: 40,
  },
});
