-- dashFly Supabase Schema Migration
-- Run this in the Supabase SQL Editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  country TEXT,
  weight NUMERIC,
  height NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_distance NUMERIC DEFAULT 0,
  total_time NUMERIC DEFAULT 0
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  distance_m NUMERIC NOT NULL,
  duration_s NUMERIC NOT NULL,
  elevation_gain_m NUMERIC DEFAULT 0,
  avg_speed_kmh NUMERIC,
  avg_pace_spm NUMERIC,
  calories NUMERIC,
  start_lat NUMERIC,
  start_lng NUMERIC,
  polyline TEXT,
  gpx_url TEXT,
  is_public BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity coordinates table
CREATE TABLE IF NOT EXISTS activity_coordinates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  altitude NUMERIC,
  speed NUMERIC,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Kudos table
CREATE TABLE IF NOT EXISTS kudos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(activity_id, user_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Segments table
CREATE TABLE IF NOT EXISTS segments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  distance_m NUMERIC NOT NULL,
  avg_grade NUMERIC,
  polyline TEXT NOT NULL,
  start_lat NUMERIC NOT NULL,
  start_lng NUMERIC NOT NULL,
  end_lat NUMERIC NOT NULL,
  end_lng NUMERIC NOT NULL
);

-- Segment efforts table
CREATE TABLE IF NOT EXISTS segment_efforts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  segment_id UUID REFERENCES segments(id) ON DELETE CASCADE NOT NULL,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  duration_s NUMERIC NOT NULL,
  rank NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  city TEXT,
  activity_type TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  member_count NUMERIC DEFAULT 1
);

-- Club members table
CREATE TABLE IF NOT EXISTS club_members (
  club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (club_id, user_id)
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL
);

-- Gear table
CREATE TABLE IF NOT EXISTS gear (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  distance_m NUMERIC DEFAULT 0,
  is_retired BOOLEAN DEFAULT false
);

-- Challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  target_value NUMERIC NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  badge_icon TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_is_public ON activities(is_public);
CREATE INDEX IF NOT EXISTS idx_activity_coordinates_activity_id ON activity_coordinates(activity_id);
CREATE INDEX IF NOT EXISTS idx_kudos_activity_id ON kudos(activity_id);
CREATE INDEX IF NOT EXISTS idx_comments_activity_id ON comments(activity_id);
CREATE INDEX IF NOT EXISTS idx_segment_efforts_segment_id ON segment_efforts(segment_id);
CREATE INDEX IF NOT EXISTS idx_segment_efforts_user_id ON segment_efforts(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE segment_efforts ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gear ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view public activities"
  ON activities FOR SELECT USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can create activities"
  ON activities FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view kudos"
  ON kudos FOR SELECT USING (true);

CREATE POLICY "Users can create kudos"
  ON kudos FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own kudos"
  ON kudos FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view follows"
  ON follows FOR SELECT USING (true);

CREATE POLICY "Users can manage own follows"
  ON follows FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Anyone can view segments"
  ON segments FOR SELECT USING (true);

CREATE POLICY "Anyone can view segment efforts"
  ON segment_efforts FOR SELECT USING (true);

CREATE POLICY "Users can create segment efforts"
  ON segment_efforts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view clubs"
  ON clubs FOR SELECT USING (true);

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT USING (true);

CREATE POLICY "Users can manage own achievements"
  ON achievements FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own gear"
  ON gear FOR ALL USING (auth.uid() = user_id);

-- Storage bucket for GPX files
INSERT INTO storage.buckets (id, name, public) VALUES ('gpx-files', 'gpx-files', false)
  ON CONFLICT (id) DO NOTHING;

-- Storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-photos', 'profile-photos', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage bucket for activity map thumbnails
INSERT INTO storage.buckets (id, name, public) VALUES ('activity-thumbnails', 'activity-thumbnails', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view profile photos"
  ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can upload profile photos"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own profile photos"
  ON storage.objects FOR UPDATE USING (bucket_id = 'profile-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
