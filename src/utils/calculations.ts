const EARTH_RADIUS_KM = 6371;

export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c * 1000;
};

const toRad = (deg: number): number => (deg * Math.PI) / 180;

export const calculateTotalDistance = (coords: { lat: number; lng: number }[]): number => {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += haversineDistance(
      coords[i - 1].lat,
      coords[i - 1].lng,
      coords[i].lat,
      coords[i].lng,
    );
  }
  return total;
};

export const calculateElevationGain = (coords: { altitude?: number }[]): number => {
  let gain = 0;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1].altitude || 0;
    const curr = coords[i].altitude || 0;
    if (curr > prev) {
      gain += curr - prev;
    }
  }
  return gain;
};

export const calculateElevationLoss = (coords: { altitude?: number }[]): number => {
  let loss = 0;
  for (let i = 1; i < coords.length; i++) {
    const prev = coords[i - 1].altitude || 0;
    const curr = coords[i].altitude || 0;
    if (curr < prev) {
      loss += prev - curr;
    }
  }
  return loss;
};

export const calculateAvgSpeed = (
  coords: { speed?: number }[],
): number => {
  const speeds = coords.filter((c) => c.speed !== undefined && c.speed > 0).map((c) => c.speed!);
  if (speeds.length === 0) return 0;
  return speeds.reduce((a, b) => a + b, 0) / speeds.length;
};

export const calculateAvgPace = (coords: { speed?: number }[]): number => {
  const speeds = coords.filter((c) => c.speed !== undefined && c.speed > 0).map((c) => c.speed!);
  if (speeds.length === 0) return 0;
  const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  if (avgSpeed <= 0) return Infinity;
  return 3600 / (avgSpeed * 3.6);
};

export const calculateMaxSpeed = (coords: { speed?: number }[]): number => {
  const speeds = coords.filter((c) => c.speed !== undefined).map((c) => c.speed!);
  return speeds.length > 0 ? Math.max(...speeds) : 0;
};
