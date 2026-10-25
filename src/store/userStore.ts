import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { Database } from '../services/supabase';

interface UserState {
  user: Database['public']['Tables']['users']['Row'] | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: Database['public']['Tables']['users']['Row'] | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signup: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateProfile: (data: Database['public']['Tables']['users']['Update']) => Promise<boolean>;
  fetchUser: (userId: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      set({ isLoading: false });
      return { error: error.message };
    }
    if (data.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      set({ user: profile, isAuthenticated: true, isLoading: false });
    }
    return { error: null };
  },

  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      set({ isLoading: false });
      return { error: error.message };
    }
    if (data.user) {
      const username = name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      await supabase.from('users').insert({
        id: data.user.id,
        name,
        username,
        total_distance: 0,
        total_time: 0,
      });
    }
    set({ isLoading: false });
    return { error: null };
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    if (!useUserStore.getState().user) return false;
    const { error } = await supabase
      .from('users')
      .update(data)
      .eq('id', useUserStore.getState().user!.id);
    if (error) return false;
    const { data: updated } = await supabase
      .from('users')
      .select('*')
      .eq('id', useUserStore.getState().user!.id)
      .single();
    set({ user: updated });
    return true;
  },

  fetchUser: async (userId: string) => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) {
      set({ user: data, isAuthenticated: true });
    }
    set({ isLoading: false });
  },
}));
