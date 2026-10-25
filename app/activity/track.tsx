import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useActivityStore } from '../../src/store/activityStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { useUserStore } from '../../src/store/userStore';
import { ACTIVITY_TYPES } from '../../src/constants/activityTypes';
import { ORANGE, DARK } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import {
  formatStopwatch,
  formatDistance,
  formatSpeed,
  formatPace,
  calculatePaceFromSpeed,
} from '../../src/utils/formatters';
import { finishActivity } from '../../src/services/activityService';
import { startLocationTracking, stopLocationTracking, TrackedCoordinate } from '../../src/services/locationService';
import LiveMap, { LiveCoordinate } from '../../src/components/map/LiveMap';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function ActivityTrackScreen() {
  const router = useRouter();

  const isTracking = useActivityStore((state) => state.isTracking);
  const isPaused = useActivityStore((state) => state.session?.isPaused ?? false);
  const session = useActivityStore((state) => state.session);
  const currentCoord = useActivityStore((state) => state.currentCoord);
  const isLocked = useActivityStore((state) => state.isLocked);
  const isAutoPaused = useActivityStore((state) => state.isAutoPaused);
  const startTracking = useActivityStore((state) => state.startTracking);
  const addCoord = useActivityStore((state) => state.addCoordinate);
  const togglePause = useActivityStore((state) => state.togglePause);
  const stopTracking = useActivityStore((state) => state.stopTracking);
  const recordLap = useActivityStore((state) => state.recordLap);
  const toggleLock = useActivityStore((state) => state.toggleLock);
  const checkAudioCue = useActivityStore((state) => state.checkAudioCue);

  const distanceUnit = useSettingsStore((state) => state.distanceUnit);
  const user = useUserStore((state) => state.user);

  const [elapsed, setElapsed] = useState(0);
  const [selectedType, setSelectedType] = useState('running');
  const [locationSub, setLocationSub] = useState<any>(null);

  const fabScale = useSharedValue(1);

  useEffect(() => {
    fabScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200 }),
        withTiming(1, { duration: 1200 }),
      ),
      -1,
    );
  }, []);

  useEffect(() => {
    if (isTracking && !locationSub) {
      startGPS();
    }
    return () => {
      if (!isTracking && locationSub) {
        stopLocationTracking(locationSub);
        setLocationSub(null);
      }
    };
  }, [isTracking]);

  useEffect(() => {
    if (isTracking && !isPaused && !isAutoPaused) {
      const interval = setInterval(() => { setElapsed((prev) => prev + 1); }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTracking, isPaused, isAutoPaused]);

  useEffect(() => {
    if (elapsed > 0 && elapsed % 10 === 0 && session && !isPaused) {
      checkAudioCue(() => {});
    }
  }, [elapsed, session, isPaused]);

  const startGPS = async () => {
    const sub = await startLocationTracking((coord: TrackedCoordinate) => {
      addCoord(coord);
    });
    setLocationSub(sub);
  };

  const startTrackingSession = () => {
    startTracking(selectedType);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleStop = () => {
    Alert.alert(
      'Finish Activity',
      'Are you sure you want to stop tracking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Finish',
          style: 'destructive',
          onPress: async () => {
            if (locationSub) { stopLocationTracking(locationSub); setLocationSub(null); }
            stopTracking();
            if (session && user) {
              const activity = await finishActivity(session, selectedType, user.id);
              if (activity) { router.replace(`/activity/summary/${activity.id}`); }
              else { router.replace('/(tabs)'); }
            }
          },
        },
      ],
    );
  };

  const totalDistance = session
    ? session.coordinates.reduce((dist, coord, i) => {
        if (i === 0) return 0;
        const prev = session.coordinates[i - 1];
        const R = 6371000;
        const dLat = ((coord.lat - prev.lat) * Math.PI) / 180;
        const dLon = ((coord.lng - prev.lng) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((prev.lat * Math.PI) / 180) * Math.cos((coord.lat * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return dist + R * c;
      }, 0)
    : 0;

  const currentSpeed = currentCoord?.speed || 0;
  const currentPace = calculatePaceFromSpeed(currentSpeed);

  const mapCoords: LiveCoordinate[] = session ? session.coordinates.map((c) => ({ lat: c.lat, lng: c.lng })) : [];
  const currentLocation: LiveCoordinate | null = currentCoord ? { lat: currentCoord.lat, lng: currentCoord.lng } : null;

  const getTypeEmoji = (id: string): string => {
    const map: Record<string, string> = {
      running: '🏃', cycling: '🚴', walking: '🚶', hiking: '🥾', swimming: '🏊',
      yoga: '🧘', gym: '🏋', football: '⚽', cricket: '🏏', badminton: '🏸',
      kabaddi: '🤼', rowing: '🚣', skiing: '⛷', skateboarding: '🛹', elliptical: '🏃',
    };
    return map[id] || '🏅';
  };

  const getTypeColor = (id: string): string => {
    const found = ACTIVITY_TYPES.find((t) => t.id === id);
    return found?.color || '#FC4C02';
  };

  const getTypeLabel = (id: string): string => {
    const found = ACTIVITY_TYPES.find((t) => t.id === id);
    return found?.label || 'Activity';
  };

  /* PRE-TRACKING: Activity Type Picker */
  if (!isTracking) {
    return (
      <View style={[styles.container, { backgroundColor: DARK.background }]}>
        <StatusBar barStyle="light-content" />
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <View style={styles.typePickerHeader}>
          <Text style={styles.typePickerTitle}>Select Activity</Text>
        </View>
        <ScrollView contentContainerStyle={styles.typeGrid}>
          {ACTIVITY_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[styles.typeCard, selectedType === type.id && { borderColor: type.color, backgroundColor: DARK.surfaceTertiary }]}
              onPress={() => { setSelectedType(type.id); Haptics.selectionAsync(); }}
            >
              <Text style={styles.typeCardIcon}>{getTypeEmoji(type.id)}</Text>
              <Text style={[styles.typeCardLabel, selectedType === type.id && { color: type.color }]}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={[styles.startButton, { backgroundColor: getTypeColor(selectedType) }]} onPress={startTrackingSession} activeOpacity={0.8}>
          <Text style={styles.startButtonText}>Start {getTypeLabel(selectedType)}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* TRACKING: Map + Live Stats + Controls */
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LiveMap
        coordinates={mapCoords}
        currentLocation={currentLocation}
        followUser
        showPolylines
        polylineColor={'#FC4C02'}
        polylineWidth={4}
        showMarker
        style={StyleSheet.absoluteFill}
      />

      {isLocked ? (
        <TouchableOpacity style={styles.lockOverlay} onPress={toggleLock} activeOpacity={0.5}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockText}>Tap to unlock</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.statsOverlay}>
            <View style={styles.statRow}>
              <StatDisplay value={formatStopwatch(elapsed)} label="Time" />
              <StatDisplay value={formatDistance(totalDistance, distanceUnit)} label="Distance" />
              <StatDisplay value={currentSpeed > 0 ? formatSpeed(currentSpeed, distanceUnit) : '--'} label="Speed" />
            </View>
            <View style={styles.statRow}>
              <StatDisplay value={currentSpeed > 0 ? formatPace(currentPace, distanceUnit) : '--'} label="Pace" />
              <StatDisplay value={`${Math.round(session?.coordinates.filter((c) => c.altitude !== null).reduce((max, c) => Math.max(max, c.altitude || 0), 0) || 0)}m`} label="Elevation" />
              <StatDisplay value={`${session?.laps.length || 0}`} label="Laps" />
            </View>
          </View>

          {isAutoPaused && (
            <View style={styles.autoPauseBanner}>
              <Text style={styles.autoPauseText}>⏸ Auto-Paused</Text>
            </View>
          )}

          <View style={styles.controlsContainer}>
            {!isPaused ? (
              <TouchableOpacity style={[styles.controlButton, styles.pauseButton]} onPress={() => { togglePause(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}>
                <Text style={styles.controlIcon}>⏸</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.controlButton, styles.resumeButton]} onPress={() => { togglePause(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }}>
                <Text style={styles.controlIcon}>▶</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={[styles.controlButton, styles.lapButton]} onPress={() => { recordLap(); }}>
              <Text style={styles.controlIcon}>🏁</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, styles.lockButton]} onPress={toggleLock}>
              <Text style={styles.controlIcon}>🔒</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, styles.stopButton]} onPress={handleStop}>
              <Text style={styles.controlIcon}>⏹</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </GestureHandlerRootView>
  );
}

function StatDisplay({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  closeButton: { position: 'absolute', top: SPACING.xl, left: SPACING.lg, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  closeIcon: { fontSize: 18, color: '#FFF' },
  typePickerHeader: { marginTop: SPACING.xxxl, alignItems: 'center', marginBottom: SPACING.lg },
  typePickerTitle: { ...TYPOGRAPHY.headlineLarge, color: DARK.text },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, gap: SPACING.md, paddingBottom: 100 },
  typeCard: { width: (width - SPACING.lg * 2 - SPACING.md * 2) / 3, backgroundColor: DARK.surfaceSecondary, borderRadius: RADIUS.lg, padding: SPACING.lg, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  typeCardIcon: { fontSize: 32, marginBottom: SPACING.sm },
  typeCardLabel: { ...TYPOGRAPHY.labelMedium, color: DARK.textSecondary, textAlign: 'center' },
  startButton: { position: 'absolute', bottom: SPACING.xxxl, left: SPACING.xl, right: SPACING.xl, paddingVertical: SPACING.lg, borderRadius: RADIUS.full, alignItems: 'center', ...SHADOWS.fab },
  startButtonText: { ...TYPOGRAPHY.titleLarge, color: '#FFFFFF' },
  statsOverlay: { position: 'absolute', top: SPACING.xl, left: SPACING.lg, right: SPACING.lg, backgroundColor: 'rgba(0,0,0,0.85)', borderRadius: RADIUS.lg, padding: SPACING.lg, gap: SPACING.sm },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { ...TYPOGRAPHY.titleLarge, color: '#FFFFFF', fontWeight: '600' },
  statLabel: { ...TYPOGRAPHY.labelSmall, color: 'rgba(255,255,255,0.6)' },
  autoPauseBanner: { position: 'absolute', top: '50%', alignSelf: 'center', backgroundColor: 'rgba(255, 149, 0, 0.9)', paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  autoPauseText: { ...TYPOGRAPHY.titleMedium, color: '#FFFFFF' },
  controlsContainer: { position: 'absolute', bottom: SPACING.xxxl, left: SPACING.lg, right: SPACING.lg, flexDirection: 'row', justifyContent: 'space-around' },
  controlButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' },
  pauseButton: { backgroundColor: '#FC4C02' },
  resumeButton: { backgroundColor: DARK.success },
  lapButton: {},
  lockButton: {},
  stopButton: { backgroundColor: DARK.error },
  controlIcon: { fontSize: 24 },
  lockOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  lockIcon: { fontSize: 64, marginBottom: SPACING.lg },
  lockText: { ...TYPOGRAPHY.titleLarge, color: '#FFFFFF' },
});
