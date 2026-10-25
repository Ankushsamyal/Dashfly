import { create } from 'zustand';
import { TrackedCoordinate } from '../services/locationService';
import {
  ActivitySession,
  createActivitySession,
  addCoordinate,
  togglePause,
  recordLap,
  checkAudioCue,
} from '../services/activityService';
import {
  calculateTotalDistance,
  calculateElevationGain,
  calculateAvgSpeed,
  calculateAvgPace,
  calculateMaxSpeed,
} from '../utils/calculations';
import * as Haptics from 'expo-haptics';

interface ActivityState {
  session: ActivitySession | null;
  isTracking: boolean;
  activityType: string;
  isLocked: boolean;
  isAutoPaused: boolean;
  currentCoord: TrackedCoordinate | null;

  startTracking: (activityType: string) => void;
  addCoordinate: (coord: TrackedCoordinate) => void;
  tickElapsed: (seconds: number) => void;
  togglePause: () => void;
  stopTracking: () => void;
  recordLap: () => void;
  toggleLock: () => void;
  setAutoPaused: (paused: boolean) => void;
  checkAudioCue: (onCue: (msg: string) => void) => void;
}

let intervalId: NodeJS.Timeout | null = null;

export const useActivityStore = create<ActivityState>((set, get) => ({
  session: null,
  isTracking: false,
  activityType: 'running',
  isLocked: false,
  isAutoPaused: false,
  currentCoord: null,

  startTracking: (activityType: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const session = createActivitySession();
    set({
      session,
      isTracking: true,
      activityType,
      isAutoPaused: false,
    });

    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      const s = get().session;
      if (s && !s.isPaused && !get().isAutoPaused) {
        s.elapsedSeconds += 0.1;
        s.movingSeconds += 0.1;
      }
    }, 100);
  },

  addCoordinate: (coord: TrackedCoordinate) => {
    const s = get().session;
    if (!s) return;
    addCoordinate(s, coord);
    set({ currentCoord: coord });

    if (get().isAutoPaused && coord.speed && coord.speed > 1.0) {
      set({ isAutoPaused: false });
    } else if (!s.isPaused && coord.speed !== null && coord.speed < 0.5 && s.movingSeconds > 10) {
      set({ isAutoPaused: true });
    }
  },

  tickElapsed: (seconds: number) => {
    const s = get().session;
    if (s && !s.isPaused && !get().isAutoPaused) {
      s.elapsedSeconds += seconds;
      s.movingSeconds += seconds;
    }
  },

  togglePause: () => {
    const s = get().session;
    if (!s) return;
    togglePause(s);
    set({ session: { ...s } });
  },

  stopTracking: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    set({
      session: null,
      isTracking: false,
      isAutoPaused: false,
      currentCoord: null,
    });
  },

  recordLap: () => {
    const s = get().session;
    if (!s) return;
    recordLap(s);
    set({ session: { ...s } });
  },

  toggleLock: () => {
    set((state) => ({ isLocked: !state.isLocked }));
  },

  setAutoPaused: (paused: boolean) => {
    set({ isAutoPaused: paused });
  },

  checkAudioCue: (onCue: (msg: string) => void) => {
    const s = get().session;
    if (!s) return;
    checkAudioCue(s, onCue);
    set({ session: { ...s } });
  },
}));
