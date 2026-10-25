import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { supabase, Database } from './supabase';
import {
  calculateTotalDistance,
  calculateElevationGain,
  calculateAvgSpeed,
  calculateAvgPace,
  calculateMaxSpeed,
  calculateElevationLoss,
} from '../utils/calculations';
import { encodePolyline } from '../utils/polyline';
import { getActivityType } from '../constants/activityTypes';
import { TrackedCoordinate } from './locationService';
import { generateGPX } from './gpxExport';
import { reverseGeocodeOSM } from './geocoding';

export interface ActivitySession {
  coordinates: TrackedCoordinate[];
  startTime: Date;
  elapsedSeconds: number;
  movingSeconds: number;
  isPaused: boolean;
  laps: Lap[];
  currentLapStartIndex: number;
  lastAudioCueKm: number;
  activityId: string | null;
}

export interface Lap {
  index: number;
  distance: number;
  duration: number;
  startTime: Date;
}

export const createActivitySession = (): ActivitySession => ({
  coordinates: [],
  startTime: new Date(),
  elapsedSeconds: 0,
  movingSeconds: 0,
  isPaused: false,
  laps: [],
  currentLapStartIndex: 0,
  lastAudioCueKm: 0,
  activityId: null,
});

export const addCoordinate = (
  session: ActivitySession,
  coord: TrackedCoordinate,
): ActivitySession => {
  session.coordinates.push(coord);
  return session;
};

export const togglePause = (session: ActivitySession): ActivitySession => {
  session.isPaused = !session.isPaused;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  return session;
};

export const recordLap = (session: ActivitySession): ActivitySession => {
  const now = new Date();
  const totalDistance = calculateTotalDistance(
    session.coordinates.map((c) => ({ lat: c.lat, lng: c.lng })),
  );
  const lapDistance =
    session.laps.length === 0
      ? totalDistance
      : totalDistance - session.laps[session.laps.length - 1].distance;

  const lap: Lap = {
    index: session.laps.length + 1,
    distance: lapDistance,
    duration: session.elapsedSeconds,
    startTime: now,
  };
  session.laps.push(lap);
  session.currentLapStartIndex = session.coordinates.length - 1;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  return session;
};

export const checkAudioCue = (
  session: ActivitySession,
  onCue: (message: string) => void,
): ActivitySession => {
  const totalDistance = calculateTotalDistance(
    session.coordinates.map((c) => ({ lat: c.lat, lng: c.lng })),
  );
  const currentKm = Math.floor(totalDistance / 1000);

  if (currentKm > session.lastAudioCueKm && currentKm > 0) {
    const coords = session.coordinates.slice(session.currentLapStartIndex);
    const lapDistance = calculateTotalDistance(
      coords.map((c) => ({ lat: c.lat, lng: c.lng })),
    );
    const pace = calculateAvgPace(coords.map((c) => ({ speed: c.speed ?? undefined })));
    const paceMin = Math.floor(pace / 60);
    const paceSec = Math.floor(pace % 60);

    const message = `${currentKm} kilometre completed. Pace: ${paceMin} minutes ${paceSec} seconds.`;
    Speech.speak(message, { language: 'en-IN' });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    session.lastAudioCueKm = currentKm;
    onCue(message);
  }

  return session;
};

export const finishActivity = async (
  session: ActivitySession,
  activityType: string,
  userId: string,
  title?: string,
  description?: string,
  isPublic: boolean = true,
): Promise<Database['public']['Tables']['activities']['Row'] | null> => {
  if (session.coordinates.length < 2) return null;

  const distance = calculateTotalDistance(
    session.coordinates.map((c) => ({ lat: c.lat, lng: c.lng })),
  );
  const calcCoords = session.coordinates.map((c) => ({ speed: c.speed ?? undefined, altitude: c.altitude ?? undefined }));
  const elevationGain = calculateElevationGain(calcCoords);
  const avgSpeed = calculateAvgSpeed(calcCoords);
  const avgPace = calculateAvgPace(calcCoords);
  const maxSpeed = calculateMaxSpeed(calcCoords);

  const polyline = encodePolyline(session.coordinates.map((c) => ({ lat: c.lat, lng: c.lng })));

  const activityTypeConfig = getActivityType(activityType);
  const durationMinutes = session.elapsedSeconds / 60;
  const calories = (activityTypeConfig.met * 70 * durationMinutes) / 60;

  let activityTitle = title;
  if (!activityTitle) {
    const firstCoord = session.coordinates[0];
    const address = await reverseGeocodeOSM(firstCoord.lat, firstCoord.lng);
    const locationName = address?.city || address?.subregion || address?.region || 'Unknown';
    const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening';
    activityTitle = `${timeOfDay} ${activityTypeConfig.label} in ${locationName}`;
  }

  const { data: activity, error } = await supabase
    .from('activities')
    .insert({
      user_id: userId,
      type: activityType,
      title: activityTitle,
      description: description || null,
      distance_m: Math.round(distance),
      duration_s: Math.round(session.elapsedSeconds),
      elevation_gain_m: Math.round(elevationGain),
      avg_speed_kmh: Math.round(avgSpeed * 3.6 * 10) / 10,
      avg_pace_spm: Math.round(avgPace * 10) / 10,
      calories: Math.round(calories),
      start_lat: session.coordinates[0].lat,
      start_lng: session.coordinates[0].lng,
      polyline,
      is_public: isPublic,
      started_at: session.startTime.toISOString(),
    })
    .select()
    .single();

  if (error || !activity) return null;

  const coordInserts = session.coordinates.map((c) => ({
    activity_id: activity.id,
    lat: c.lat,
    lng: c.lng,
    altitude: c.altitude,
    speed: c.speed,
    timestamp: c.timestamp.toISOString(),
  }));

  await supabase.from('activity_coordinates').insert(coordInserts);

  const gpxContent = generateGPX(session.coordinates, activityTitle, activityType);
  const fileName = `activities/${activity.id}.gpx`;
  await supabase.storage.from('gpx-files').upload(fileName, gpxContent, {
    contentType: 'application/gpx+xml',
  });

  await supabase.from('activities').update({ gpx_url: fileName }).eq('id', activity.id);

  return activity;
};
