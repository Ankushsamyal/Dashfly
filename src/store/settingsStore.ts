import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@dashfly_settings';

interface SettingsState {
  isDark: boolean;
  distanceUnit: 'km' | 'mi';
  weightUnit: 'kg' | 'lbs';
  tempUnit: 'C' | 'F';
  mapStyle: 'standard' | 'satellite' | 'terrain';
  autoPause: boolean;
  autoLap: boolean;
  lapDistance: number;
  audioCues: boolean;
  hapticFeedback: boolean;
  privacyMode: boolean;
  privacyRadiusMeters: number;

  toggleDark: () => void;
  setDistanceUnit: (unit: 'km' | 'mi') => void;
  setWeightUnit: (unit: 'kg' | 'lbs') => void;
  setTempUnit: (unit: 'C' | 'F') => void;
  setMapStyle: (style: 'standard' | 'satellite' | 'terrain') => void;
  toggleAutoPause: () => void;
  toggleAutoLap: () => void;
  setLapDistance: (dist: number) => void;
  toggleAudioCues: () => void;
  toggleHapticFeedback: () => void;
  togglePrivacyMode: () => void;
  setPrivacyRadius: (meters: number) => void;
  loadSettings: () => Promise<void>;
}

const defaults: SettingsState = {
  isDark: true,
  distanceUnit: 'km' as const,
  weightUnit: 'kg' as const,
  tempUnit: 'C' as const,
  mapStyle: 'standard' as const,
  autoPause: true,
  autoLap: false,
  lapDistance: 1000,
  audioCues: true,
  hapticFeedback: true,
  privacyMode: false,
  privacyRadiusMeters: 200,
  toggleDark: () => {},
  setDistanceUnit: () => {},
  setWeightUnit: () => {},
  setTempUnit: () => {},
  setMapStyle: () => {},
  toggleAutoPause: () => {},
  toggleAutoLap: () => {},
  setLapDistance: () => {},
  toggleAudioCues: () => {},
  toggleHapticFeedback: () => {},
  togglePrivacyMode: () => {},
  setPrivacyRadius: () => {},
  loadSettings: async () => {},
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...defaults,

  toggleDark: () => {
    const next = !get().isDark;
    AsyncStorage.setItem(`${STORAGE_KEY}:isDark`, JSON.stringify(next));
    set({ isDark: next });
  },

  setDistanceUnit: (unit) => {
    AsyncStorage.setItem(`${STORAGE_KEY}:distanceUnit`, unit);
    set({ distanceUnit: unit });
  },

  setWeightUnit: (unit) => {
    AsyncStorage.setItem(`${STORAGE_KEY}:weightUnit`, unit);
    set({ weightUnit: unit });
  },

  setTempUnit: (unit) => {
    AsyncStorage.setItem(`${STORAGE_KEY}:tempUnit`, unit);
    set({ tempUnit: unit });
  },

  setMapStyle: (style) => {
    AsyncStorage.setItem(`${STORAGE_KEY}:mapStyle`, style);
    set({ mapStyle: style });
  },

  toggleAutoPause: () => {
    const next = !get().autoPause;
    AsyncStorage.setItem(`${STORAGE_KEY}:autoPause`, JSON.stringify(next));
    set({ autoPause: next });
  },

  toggleAutoLap: () => {
    const next = !get().autoLap;
    AsyncStorage.setItem(`${STORAGE_KEY}:autoLap`, JSON.stringify(next));
    set({ autoLap: next });
  },

  setLapDistance: (dist) => {
    AsyncStorage.setItem(`${STORAGE_KEY}:lapDistance`, String(dist));
    set({ lapDistance: dist });
  },

  toggleAudioCues: () => {
    const next = !get().audioCues;
    AsyncStorage.setItem(`${STORAGE_KEY}:audioCues`, JSON.stringify(next));
    set({ audioCues: next });
  },

  toggleHapticFeedback: () => {
    const next = !get().hapticFeedback;
    AsyncStorage.setItem(`${STORAGE_KEY}:hapticFeedback`, JSON.stringify(next));
    set({ hapticFeedback: next });
  },

  togglePrivacyMode: () => {
    const next = !get().privacyMode;
    AsyncStorage.setItem(`${STORAGE_KEY}:privacyMode`, JSON.stringify(next));
    set({ privacyMode: next });
  },

  setPrivacyRadius: (meters) => {
    AsyncStorage.setItem(`${STORAGE_KEY}:privacyRadiusMeters`, String(meters));
    set({ privacyRadiusMeters: meters });
  },

  loadSettings: async () => {
    try {
      const keys = [
        'isDark', 'distanceUnit', 'weightUnit', 'tempUnit', 'mapStyle',
        'autoPause', 'autoLap', 'lapDistance', 'audioCues', 'hapticFeedback',
        'privacyMode', 'privacyRadiusMeters',
      ];
      const values = await AsyncStorage.multiGet(
        keys.map((k) => `${STORAGE_KEY}:${k}`),
      );
      const parsed: Record<string, unknown> = {};
      values.forEach(([key, value]) => {
        const settingKey = key.replace(`${STORAGE_KEY}:`, '');
        if (value !== null) {
          if (settingKey === 'isDark' || settingKey === 'autoPause' || settingKey === 'autoLap' || settingKey === 'audioCues' || settingKey === 'hapticFeedback' || settingKey === 'privacyMode') {
            parsed[settingKey] = JSON.parse(value);
          } else if (settingKey === 'lapDistance' || settingKey === 'privacyRadiusMeters') {
            parsed[settingKey] = Number(value);
          } else {
            parsed[settingKey] = value;
          }
        }
      });
      set({ ...defaults, ...(parsed as unknown as Partial<SettingsState>) });
    } catch (e) {
      console.warn('Failed to load settings:', e);
    }
  },
}));
