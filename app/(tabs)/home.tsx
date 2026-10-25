import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useUserStore } from '../../src/store/userStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { ORANGE, DARK } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { formatDistance, formatDuration, formatRelativeTime } from '../../src/utils/formatters';
import { getActivityType } from '../../src/constants/activityTypes';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../src/services/supabase';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const isDark = useSettingsStore((state) => state.isDark);
  const distanceUnit = useSettingsStore((state) => state.distanceUnit);
  const colors = isDark ? DARK : { background: '#F5F5F5', card: '#FFFFFF', text: '#0A0A0A', textSecondary: '#666666', textTertiary: '#999999', surfaceSecondary: '#FAFAFA', surfaceTertiary: '#F0F0F0' };

  const [weeklyStats] = useState({ distance: 24500, time: 7200, elevation: 340, activities: 5, calories: 1850 });
  const [weather, setWeather] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [streak] = useState(7);
  const [refreshing, setRefreshing] = useState(false);
  const fabScale = useSharedValue(1);

  useEffect(() => { fabScale.value = withRepeat(withSequence(withTiming(1.08, { duration: 1200 }), withTiming(1, { duration: 1200 })), -1); }, []);
  useEffect(() => { fetchWeather(); fetchRecentActivities(); }, []);

  const fetchWeather = async () => {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true');
      const data = await res.json();
      setWeather({ temperature: Math.round(data.current_weather.temperature), icon: data.current_weather.weathercode === 0 ? '☀️' : '⛅', wind: Math.round(data.current_weather.windspeed) });
    } catch {}
  };

  const fetchRecentActivities = async () => {
    const { data } = await supabase.from('activities').select('*').order('created_at', { ascending: false }).limit(5);
    if (data) setRecentActivities(data);
  };

  const onRefresh = useCallback(async () => { setRefreshing(true); await Promise.all([fetchWeather(), fetchRecentActivities()]); setRefreshing(false); }, []);
  const handleStartActivity = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); router.push('/activity/track'); };
  const getTimeOfDay = () => { const h = new Date().getHours(); return h < 12 ? 'Morning' : h < 17 ? 'Afternoon' : 'Evening'; };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ORANGE.primary} />}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getTimeOfDay()},</Text>
            <Text style={styles.userName}>{user?.name || 'Athlete'}</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}><Text style={styles.settingsIcon}>⚙</Text></TouchableOpacity>
        </View>
        {weather && (
          <View style={[styles.weatherCard, { backgroundColor: colors.card }]}>
            <View><Text style={styles.weatherTemp}>{weather.temperature}°</Text><Text style={styles.weatherDesc}>Current Weather</Text></View>
            <View style={{ alignItems: 'flex-end' }}><Text style={styles.weatherIcon}>{weather.icon}</Text><Text style={styles.weatherWind}>Wind: {weather.wind} km/h</Text></View>
          </View>
        )}
        <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
          <View style={styles.statsHeader}><Text style={styles.statsTitle}>This Week</Text><Text style={styles.statsSeeAll}>See All</Text></View>
          <View style={styles.statsGrid}>
            <StatItem label="Distance" value={formatDistance(weeklyStats.distance, distanceUnit)} icon="📏" color={ORANGE.primary} />
            <StatItem label="Time" value={formatDuration(weeklyStats.time)} icon="⏱" color="#5AC8FA" />
            <StatItem label="Elevation" value={`${weeklyStats.elevation}m`} icon="⛰" color="#AF52DE" />
            <StatItem label="Activities" value={String(weeklyStats.activities)} icon="🏃" color="#34C759" />
          </View>
        </View>
        <View style={[styles.streakCard, { backgroundColor: colors.card }]}>
          <View style={styles.streakContent}>
            <Text style={styles.streakFire}>🔥</Text>
            <View><Text style={styles.streakCount}>{streak} Day Streak!</Text><Text style={styles.streakLabel}>Keep it going</Text></View>
          </View>
        </View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Recent Activities</Text><TouchableOpacity onPress={() => router.push('/feed')}><Text style={styles.sectionLink}>View All</Text></TouchableOpacity></View>
        {recentActivities.length > 0 ? (
          <FlashList data={recentActivities} keyExtractor={(item: any) => item.id} estimatedItemSize={120} renderItem={({ item }: any) => (
            <TouchableOpacity style={[styles.activityCard, { backgroundColor: colors.card }]} onPress={() => router.push(`/activity/detail/${item.id}`)} activeOpacity={0.7}>
              <View style={styles.activityMapPlaceholder}><Text style={styles.activityMapText}>🗺</Text></View>
              <View style={styles.activityInfo}>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityTypeIcon}>🏃</Text>
                  <Text style={[styles.activityTypeName, { color: getActivityType(item.type || 'running').color }]}>{getActivityType(item.type || 'running').label}</Text>
                </View>
                <Text style={[styles.activityTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                <View style={styles.activityStats}>
                  <Text style={[styles.activityStat, { color: colors.textSecondary }]}>{formatDistance(item.distance_m || 0, distanceUnit)}</Text>
                  <Text style={[styles.activityStat, { color: colors.textTertiary }]}>•</Text>
                  <Text style={[styles.activityStat, { color: colors.textSecondary }]}>{formatDuration(item.duration_s || 0)}</Text>
                  <Text style={[styles.activityStat, { color: colors.textTertiary }]}>•</Text>
                  <Text style={[styles.activityStat, { color: colors.textSecondary }]}>{formatRelativeTime(new Date(item.started_at))}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏃</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No activities yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>Start your first activity to see it here</Text>
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
      <Animated.View style={[styles.fabContainer, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity style={styles.fab} onPress={handleStartActivity} activeOpacity={0.8}><Text style={styles.fabIcon}>+</Text></TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function StatItem({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <View style={styles.statItem}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}><Text style={styles.statIconText}>{icon}</Text></View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  greeting: { ...TYPOGRAPHY.bodyMedium, color: DARK.textSecondary },
  userName: { ...TYPOGRAPHY.headlineLarge, color: DARK.text },
  settingsButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: DARK.surfaceSecondary, alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 20 },
  weatherCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, flexDirection: 'row', justifyContent: 'space-between', ...SHADOWS.low },
  weatherTemp: { ...TYPOGRAPHY.displaySmall, color: DARK.text },
  weatherDesc: { ...TYPOGRAPHY.bodyMedium, color: DARK.textSecondary },
  weatherIcon: { fontSize: 36, marginBottom: SPACING.xs },
  weatherWind: { ...TYPOGRAPHY.bodySmall, color: DARK.textTertiary },
  statsCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.low },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  statsTitle: { ...TYPOGRAPHY.headlineSmall, color: DARK.text },
  statsSeeAll: { ...TYPOGRAPHY.labelMedium, color: ORANGE.primary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
  statItem: { flex: 1, minWidth: (width - SPACING.lg * 3 - SPACING.md) / 2, backgroundColor: DARK.surfaceTertiary, borderRadius: RADIUS.md, padding: SPACING.md, alignItems: 'center' },
  statIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm },
  statIconText: { fontSize: 18 },
  statValue: { ...TYPOGRAPHY.titleLarge, color: DARK.text, marginBottom: 2 },
  statLabel: { ...TYPOGRAPHY.labelSmall, color: DARK.textTertiary },
  streakCard: { borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.low },
  streakContent: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  streakFire: { fontSize: 40 },
  streakCount: { ...TYPOGRAPHY.headlineMedium, color: DARK.text },
  streakLabel: { ...TYPOGRAPHY.bodyMedium, color: DARK.textSecondary },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md, marginTop: SPACING.sm },
  sectionTitle: { ...TYPOGRAPHY.headlineSmall, color: DARK.text },
  sectionLink: { ...TYPOGRAPHY.labelMedium, color: ORANGE.primary },
  activityCard: { borderRadius: RADIUS.lg, marginBottom: SPACING.md, overflow: 'hidden', flexDirection: 'row', ...SHADOWS.low },
  activityMapPlaceholder: { width: 100, height: 100, backgroundColor: DARK.surfaceTertiary, alignItems: 'center', justifyContent: 'center' },
  activityMapText: { fontSize: 32 },
  activityInfo: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  activityMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  activityTypeIcon: { fontSize: 14, marginRight: SPACING.xs },
  activityTypeName: { ...TYPOGRAPHY.labelMedium },
  activityTitle: { ...TYPOGRAPHY.titleMedium, marginBottom: SPACING.xs },
  activityStats: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  activityStat: { ...TYPOGRAPHY.bodySmall },
  emptyState: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyIcon: { fontSize: 48, marginBottom: SPACING.lg },
  emptyTitle: { ...TYPOGRAPHY.headlineSmall },
  emptySubtitle: { ...TYPOGRAPHY.bodyMedium, textAlign: 'center' },
  fabContainer: { position: 'absolute', bottom: SPACING.xxl, alignSelf: 'center' },
  fab: { width: 64, height: 64, borderRadius: 32, backgroundColor: ORANGE.primary, alignItems: 'center', justifyContent: 'center', ...SHADOWS.fab },
  fabIcon: { fontSize: 36, color: '#FFFFFF', fontWeight: '300', lineHeight: 36 },
});
