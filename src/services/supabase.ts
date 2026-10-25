import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          username: string;
          avatar_url: string | null;
          bio: string | null;
          city: string | null;
          country: string | null;
          weight: number | null;
          height: number | null;
          created_at: string;
          total_distance: number;
          total_time: number;
        };
        Insert: {
          id: string;
          name: string;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          country?: string | null;
          weight?: number | null;
          height?: number | null;
          created_at?: string;
          total_distance?: number;
          total_time?: number;
        };
        Update: {
          name?: string;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          city?: string | null;
          country?: string | null;
          weight?: number | null;
          height?: number | null;
          total_distance?: number;
          total_time?: number;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          description: string | null;
          distance_m: number;
          duration_s: number;
          elevation_gain_m: number;
          avg_speed_kmh: number;
          avg_pace_spm: number;
          calories: number;
          start_lat: number;
          start_lng: number;
          polyline: string;
          gpx_url: string | null;
          is_public: boolean;
          started_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          description?: string | null;
          distance_m: number;
          duration_s: number;
          elevation_gain_m: number;
          avg_speed_kmh: number;
          avg_pace_spm: number;
          calories: number;
          start_lat: number;
          start_lng: number;
          polyline: string;
          gpx_url?: string | null;
          is_public?: boolean;
          started_at: string;
          created_at?: string;
        };
        Update: {
          type?: string;
          title?: string;
          description?: string | null;
          is_public?: boolean;
        };
      };
      activity_coordinates: {
        Row: {
          id: string;
          activity_id: string;
          lat: number;
          lng: number;
          altitude: number | null;
          speed: number | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          lat: number;
          lng: number;
          altitude?: number | null;
          speed?: number | null;
          timestamp: string;
        };
      };
      kudos: {
        Row: {
          id: string;
          activity_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          user_id: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          activity_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
      };
      segments: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          distance_m: number;
          avg_grade: number;
          polyline: string;
          start_lat: number;
          start_lng: number;
          end_lat: number;
          end_lng: number;
        };
      };
      segment_efforts: {
        Row: {
          id: string;
          segment_id: string;
          activity_id: string;
          user_id: string;
          duration_s: number;
          rank: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          segment_id: string;
          activity_id: string;
          user_id: string;
          duration_s: number;
          rank?: number | null;
          created_at?: string;
        };
      };
      clubs: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          avatar_url: string | null;
          city: string | null;
          activity_type: string;
          is_private: boolean;
          member_count: number;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          avatar_url?: string | null;
          city?: string | null;
          activity_type: string;
          is_private?: boolean;
          member_count?: number;
        };
      };
      club_members: {
        Row: {
          club_id: string;
          user_id: string;
          role: string;
          joined_at: string;
        };
        Insert: {
          club_id: string;
          user_id: string;
          role?: string;
          joined_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          badge_type: string;
          earned_at: string;
          activity_id: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_type: string;
          earned_at?: string;
          activity_id?: string | null;
        };
      };
      gear: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          distance_m: number;
          is_retired: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          type: string;
          distance_m?: number;
          is_retired?: boolean;
        };
        Update: {
          name?: string;
          distance_m?: number;
          is_retired?: boolean;
        };
      };
      challenges: {
        Row: {
          id: string;
          name: string;
          description: string;
          type: string;
          target_value: number;
          start_date: string;
          end_date: string;
          badge_icon: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          type: string;
          target_value: number;
          start_date: string;
          end_date: string;
          badge_icon: string;
        };
      };
    };
  };
};
