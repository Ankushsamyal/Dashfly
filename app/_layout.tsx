import { Stack } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../src/services/supabase';
import { useUserStore } from '../src/store/userStore';
import { useSettingsStore } from '../src/store/settingsStore';
import { useAppFonts } from '../src/hooks/useAppFonts';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { DARK } from '../src/constants/colors';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { loaded: fontsLoaded } = useAppFonts();
  const setUser = useUserStore((state) => state.setUser);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const isDark = useSettingsStore((state) => state.isDark);
  const fontsTimedOut = useRef(false);

  useEffect(() => {
    loadSettings().catch(() => {});

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          useUserStore.getState().fetchUser(session.user.id);
        }
        clearTimeout(timeout);
        setLoading(false);
      })
      .catch(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    const timer = setTimeout(() => { fontsTimedOut.current = true; }, 6000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        useUserStore.getState().fetchUser(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
      clearTimeout(timer);
    };
  }, []);

  if (loading || (!fontsLoaded && !fontsTimedOut.current)) {
    return (
      <View style={[styles.loading, { backgroundColor: isDark ? DARK.background : '#F5F5F5' }]}>
        <ActivityIndicator size="large" color="#FC4C02" />
      </View>
    );
  }

  if (!session) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
      </Stack>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="activity/track" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="activity/summary/[id]" options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="activity/detail/[id]" />
      <Stack.Screen name="segment/[id]" />
      <Stack.Screen name="profile/[id]" />
      <Stack.Screen name="settings/index" options={{ headerShown: true, title: 'Settings' }} />
      <Stack.Screen name="settings/units" options={{ headerShown: true, title: 'Units' }} />
      <Stack.Screen name="settings/privacy" options={{ headerShown: true, title: 'Privacy' }} />
      <Stack.Screen name="settings/notifications" options={{ headerShown: true, title: 'Notifications' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
