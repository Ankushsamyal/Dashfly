import { create } from 'zustand';
import { supabase } from '../services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FEED_CACHE_KEY = '@dashfly_feed_cache';

interface FeedActivity {
  id: string;
  type: string;
  title: string;
  distance_m: number;
  duration_s: number;
  elevation_gain_m: number;
  avg_pace_spm: number;
  started_at: string;
  polyline: string;
  user: {
    id: string;
    name: string;
    username: string;
    avatar_url: string | null;
  };
  kudos_count: number;
  comment_count: number;
  has_kudo: boolean;
}

interface FeedState {
  activities: FeedActivity[];
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  toggleKudo: (activityId: string) => Promise<void>;
  addComment: (activityId: string, content: string) => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  activities: [],
  isLoading: false,
  hasMore: true,
  page: 0,

  refresh: async () => {
    set({ isLoading: true, page: 0 });
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        user:users(id, name, username, avatar_url)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error && data) {
      const enriched = await Promise.all(
        (data as any[]).map(async (a) => {
          const { count: kudosCount } = await supabase
            .from('kudos')
            .select('*', { count: 'exact', head: true })
            .eq('activity_id', a.id);
          const { count: commentCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('activity_id', a.id);
          return {
            ...a,
            kudos_count: kudosCount || 0,
            comment_count: commentCount || 0,
            has_kudo: false,
          };
        }),
      );
      try { await AsyncStorage.setItem(FEED_CACHE_KEY, JSON.stringify(enriched.slice(0, 20))); } catch {}
      set({ activities: enriched, page: 1, isLoading: false, hasMore: data.length === 20 });
    } else {
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { page, activities } = get();
    if (!get().hasMore) return;
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('activities')
      .select(`
        *,
        user:users(id, name, username, avatar_url)
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(page * 20, (page + 1) * 20 - 1);

    if (!error && data) {
      const enriched = (data as any[]).map((a) => ({
        ...a,
        kudos_count: 0,
        comment_count: 0,
        has_kudo: false,
      }));
      set({
        activities: [...activities, ...enriched],
        page: page + 1,
        isLoading: false,
        hasMore: data.length === 20,
      });
    } else {
      set({ isLoading: false });
    }
  },

  toggleKudo: async (activityId: string) => {
    const state = get();
    const activities = state.activities.map((a) => {
      if (a.id === activityId) {
        return {
          ...a,
          has_kudo: !a.has_kudo,
          kudos_count: a.has_kudo ? a.kudos_count - 1 : a.kudos_count + 1,
        };
      }
      return a;
    });
    set({ activities });

    const activity = state.activities.find((a) => a.id === activityId);
    if (activity?.has_kudo) {
      await supabase.from('kudos').delete().eq('activity_id', activityId);
    } else {
      await supabase.from('kudos').insert({ activity_id: activityId });
    }
  },

  addComment: async (activityId: string, content: string) => {
    await supabase.from('comments').insert({
      activity_id: activityId,
      content,
    });
    set({
      activities: get().activities.map((a) =>
        a.id === activityId ? { ...a, comment_count: a.comment_count + 1 } : a,
      ),
    });
  },
}));
