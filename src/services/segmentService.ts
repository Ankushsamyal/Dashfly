import { supabase } from './supabase';
import { decodePolyline } from '../utils/polyline';
import { haversineDistance } from '../utils/calculations';

export interface Segment {
  id: string;
  name: string;
  type: string;
  distance_m: number;
  avg_grade: number;
  polyline: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
}

export interface SegmentEffort {
  id: string;
  segment_id: string;
  activity_id: string;
  user_id: string;
  duration_s: number;
  rank: number | null;
  created_at: string;
}

export const getNearbySegments = async (
  lat: number,
  lng: number,
  radiusMeters: number = 5000,
): Promise<Segment[]> => {
  const { data, error } = await supabase
    .from('segments')
    .select('*')
    .gte('start_lat', lat - 0.05)
    .lte('start_lat', lat + 0.05)
    .gte('start_lng', lng - 0.05)
    .lte('start_lng', lng + 0.05);

  if (error) return [];

  return data.filter((segment) => {
    const dist = haversineDistance(lat, lng, segment.start_lat, segment.start_lng);
    return dist <= radiusMeters;
  });
};

export const matchSegment = (
  activityCoords: { lat: number; lng: number; timestamp: Date }[],
  segment: Segment,
): { matched: boolean; startTime: Date | null; endTime: Date | null; duration: number } => {
  const segmentPoints = decodePolyline(segment.polyline);
  if (segmentPoints.length < 2) return { matched: false, startTime: null, endTime: null, duration: 0 };

  const threshold = 30;
  let startIndex: number | null = null;
  let endIndex: number | null = null;

  for (let i = 0; i < activityCoords.length; i++) {
    const dist = haversineDistance(
      activityCoords[i].lat,
      activityCoords[i].lng,
      segment.start_lat,
      segment.start_lng,
    );
    if (dist <= threshold && startIndex === null) {
      startIndex = i;
    }
  }

  for (let i = activityCoords.length - 1; i >= 0; i--) {
    const dist = haversineDistance(
      activityCoords[i].lat,
      activityCoords[i].lng,
      segment.end_lat,
      segment.end_lng,
    );
    if (dist <= threshold && endIndex === null) {
      endIndex = i;
    }
  }

  if (startIndex !== null && endIndex !== null && endIndex > startIndex) {
    const duration =
      (activityCoords[endIndex].timestamp.getTime() -
        activityCoords[startIndex].timestamp.getTime()) /
      1000;
    return {
      matched: true,
      startTime: activityCoords[startIndex].timestamp,
      endTime: activityCoords[endIndex].timestamp,
      duration,
    };
  }

  return { matched: false, startTime: null, endTime: null, duration: 0 };
};

export const recordSegmentEffort = async (
  segmentId: string,
  activityId: string,
  userId: string,
  duration: number,
): Promise<void> => {
  await supabase
    .from('segment_efforts')
    .insert({
      segment_id: segmentId,
      activity_id: activityId,
      user_id: userId,
      duration_s: Math.round(duration),
    });
};

export const getSegmentLeaderboard = async (
  segmentId: string,
): Promise<(SegmentEffort & { user: { name: string; avatar_url: string | null } })[]> => {
  const { data, error } = await supabase
    .from('segment_efforts')
    .select(`
      *,
      user:users(name, avatar_url)
    `)
    .eq('segment_id', segmentId)
    .order('duration_s', { ascending: true })
    .limit(50);

  return error ? [] : (data as any[]);
};

export const getUserSegmentPR = async (
  segmentId: string,
  userId: string,
): Promise<SegmentEffort | null> => {
  const { data, error } = await supabase
    .from('segment_efforts')
    .select('*')
    .eq('segment_id', segmentId)
    .eq('user_id', userId)
    .order('duration_s', { ascending: true })
    .limit(1)
    .single();

  return error ? null : data;
};
