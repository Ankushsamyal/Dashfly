export const ORANGE = { primary: '#FC4C02', light: '#FF6B2B', dark: '#D93D00' };

export const ORANGE_LIGHT = '#FF6B2B';
export const ORANGE_DARK = '#D93D00';
export const ORANGE_TRANSPARENT = 'rgba(252, 76, 2, 0.15)';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceSecondary: string;
  surfaceTertiary: string;
  card: string;
  cardBorder: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  divider: string;
  border: string;
  overlay: string;
  overlayLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  gradientStart: string;
  gradientEnd: string;
  elevationLow: string;
  elevationMedium: string;
  elevationHigh: string;
  mapStyle: string;
  chartGrid: string;
  chartLine: string;
  chartFill: string;
  skeletonBase: string;
  skeletonHighlight: string;
}

export const DARK: ThemeColors = {
  background: '#0A0A0A',
  surface: '#141414',
  surfaceSecondary: '#1C1C1C',
  surfaceTertiary: '#252525',
  card: '#1A1A1A',
  cardBorder: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#666666',
  divider: '#2A2A2A',
  border: '#2A2A2A',
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  gradientStart: '#FC4C02',
  gradientEnd: '#FF6B2B',
  elevationLow: 'rgba(0, 0, 0, 0.3)',
  elevationMedium: 'rgba(0, 0, 0, 0.5)',
  elevationHigh: 'rgba(0, 0, 0, 0.7)',
  mapStyle: 'dark',
  chartGrid: '#2A2A2A',
  chartLine: '#FC4C02',
  chartFill: 'rgba(252, 76, 2, 0.2)',
  skeletonBase: '#1C1C1C',
  skeletonHighlight: '#2A2A2A',
};

export const LIGHT: ThemeColors = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  surfaceSecondary: '#FAFAFA',
  surfaceTertiary: '#F0F0F0',
  card: '#FFFFFF',
  cardBorder: '#E8E8E8',
  text: '#0A0A0A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  divider: '#E8E8E8',
  border: '#E8E8E8',
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#5AC8FA',
  gradientStart: '#FC4C02',
  gradientEnd: '#FF6B2B',
  elevationLow: 'rgba(0, 0, 0, 0.08)',
  elevationMedium: 'rgba(0, 0, 0, 0.12)',
  elevationHigh: 'rgba(0, 0, 0, 0.16)',
  mapStyle: 'standard',
  chartGrid: '#E8E8E8',
  chartLine: '#FC4C02',
  chartFill: 'rgba(252, 76, 2, 0.1)',
  skeletonBase: '#E8E8E8',
  skeletonHighlight: '#F0F0F0',
};

export const getColors = (isDark: boolean): ThemeColors => (isDark ? DARK : LIGHT);
