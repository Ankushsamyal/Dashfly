export const formatDistance = (meters: number, unit: 'km' | 'mi'): string => {
  if (unit === 'mi') {
    const miles = meters * 0.000621371;
    return miles < 1 ? `${(miles * 1760).toFixed(0)} yd` : `${miles.toFixed(2)} mi`;
  }
  return meters < 1000 ? `${meters.toFixed(0)} m` : `${(meters / 1000).toFixed(2)} km`;
};

export const formatDuration = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatDurationLong = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
  if (hrs > 0) return `${hrs}h`;
  return `${mins}m`;
};

export const formatPace = (secondsPerKm: number, unit: 'km' | 'mi'): string => {
  if (!isFinite(secondsPerKm) || secondsPerKm <= 0) return '--:--';
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.floor(secondsPerKm % 60);
  const label = unit === 'mi' ? '/mi' : '/km';
  return `${mins}:${secs.toString().padStart(2, '0')} ${label}`;
};

export const formatSpeed = (metersPerSecond: number, unit: 'km' | 'mi'): string => {
  if (unit === 'mi') {
    const mph = metersPerSecond * 2.23694;
    return `${mph.toFixed(1)} mph`;
  }
  const kmh = metersPerSecond * 3.6;
  return `${kmh.toFixed(1)} km/h`;
};

export const formatElevation = (meters: number, unit: 'km' | 'mi'): string => {
  if (unit === 'mi') {
    const feet = meters * 3.28084;
    return `${feet.toFixed(0)} ft`;
  }
  return `${meters.toFixed(0)} m`;
};

export const formatTime = formatDuration;

export const formatCalories = (calories: number): string => {
  return `${Math.round(calories)} kcal`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export const formatStopwatch = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const centis = Math.floor((seconds % 1) * 100);
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
};

export const calculatePaceFromSpeed = (speedMps: number): number => {
  if (speedMps <= 0) return Infinity;
  const speedKmh = speedMps * 3.6;
  if (speedKmh <= 0) return Infinity;
  return 3600 / speedKmh;
};

export const calculateCalories = (met: number, weightKg: number, durationMinutes: number): number => {
  return met * weightKg * (durationMinutes / 60);
};
