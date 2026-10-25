import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/store/userStore';
import { useSettingsStore } from '@/store/settingsStore';
import { DARK, ORANGE } from '@/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '@/constants/theme';
import { formatDistance, formatNumber, formatDurationLong } from '@/utils/formatters';

const ProfileTab = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const settingsStore = useSettingsStore();
  const [activeTab, setActiveTab] = useState('Overview');

  const tabs = ['Overview', 'Badges', 'PRs'];

  const stats = {
    activities: 128,
    distance: 2450,
    time: 18600,
  };

  const socialStats = {
    followers: 342,
    following: 289,
  };

  const badges = [
    { id: '1', name: 'First Run', icon: '🏅' },
    { id: '2', name: '10K Club', icon: '🥇' },
    { id: '3', name: 'Early Bird', icon: '🌅' },
    { id: '4', name: 'Marathoner', icon: '🏃' },
    { id: '5', name: 'Speedster', icon: '⚡' },
    { id: '6', name: 'Century', icon: '💯' },
  ];

  const personalRecords = [
    { id: '1', distance: '1K', time: 210, date: '2026-03-15' },
    { id: '2', distance: '5K', time: 1260, date: '2026-02-20' },
    { id: '3', distance: '10K', time: 2520, date: '2026-01-10' },
    { id: '4', distance: 'Half Marathon', time: 5400, date: '2025-11-05' },
    { id: '5', distance: 'Marathon', time: 10800, date: '2025-09-22' },
  ];

  const gearItems = [
    { id: '1', name: 'Nike Air Zoom', type: 'Running Shoes', distance: 450 },
    { id: '2', name: 'Garmin Forerunner', type: 'Watch', distance: 2450 },
  ];

  const renderBadge = ({ item }: { item: { id: string; name: string; icon: string } }) => (
    <View style={styles.badgeItem}>
      <Text style={styles.badgeIcon}>{item.icon}</Text>
      <Text style={styles.badgeName}>{item.name}</Text>
    </View>
  );

  const renderPR = ({ item }: { item: { id: string; distance: string; time: number; date: string } }) => (
    <View style={styles.prItem}>
      <View style={styles.prLeft}>
        <Text style={styles.prDistance}>{item.distance}</Text>
        <Text style={styles.prDate}>{item.date}</Text>
      </View>
      <Text style={styles.prTime}>{formatDurationLong(item.time)}</Text>
    </View>
  );

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityPlaceholder}>
          <Text style={styles.placeholderText}>No recent activities</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gear</Text>
        {gearItems.map((item) => (
          <View key={item.id} style={styles.gearCard}>
            <View style={styles.gearInfo}>
              <Text style={styles.gearName}>{item.name}</Text>
              <Text style={styles.gearType}>{item.type}</Text>
            </View>
            <Text style={styles.gearDistance}>{formatDistance(item.distance, settingsStore.distanceUnit)}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderBadges = () => (
    <View style={styles.tabContent}>
      <FlatList
        data={badges}
        renderItem={renderBadge}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.badgeRow}
      />
    </View>
  );

  const renderPRs = () => (
    <View style={styles.tabContent}>
      {personalRecords.map((item) => renderPR({ item }))}
    </View>
  );

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.coverArea}>
        <View style={styles.coverPhoto} />
        <TouchableOpacity style={styles.settingsButton} onPress={() => router.push('/settings')}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
        <View style={styles.profileAvatar}>
          <Text style={styles.avatarInitial}>{userInitial}</Text>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
        <Text style={styles.username}>@{user?.username || 'username'}</Text>
        <Text style={styles.city}>{user?.city || 'City'}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatNumber(stats.activities)}</Text>
          <Text style={styles.statLabel}>Activities</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDistance(stats.distance, settingsStore.distanceUnit)}</Text>
          <Text style={styles.statLabel}>Distance</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatDurationLong(stats.time)}</Text>
          <Text style={styles.statLabel}>Time</Text>
        </View>
      </View>

      <View style={styles.socialStatsRow}>
        <View style={styles.socialStatItem}>
          <Text style={styles.socialStatValue}>{formatNumber(socialStats.followers)}</Text>
          <Text style={styles.socialStatLabel}>Followers</Text>
        </View>
        <View style={styles.socialStatItem}>
          <Text style={styles.socialStatValue}>{formatNumber(socialStats.following)}</Text>
          <Text style={styles.socialStatLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Overview' && renderOverview()}
      {activeTab === 'Badges' && renderBadges()}
      {activeTab === 'PRs' && renderPRs()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK.background,
  },
  coverArea: {
    height: 200,
    position: 'relative',
  },
  coverPhoto: {
    height: 160,
    backgroundColor: DARK.surface,
  },
  settingsButton: {
    position: 'absolute',
    top: SPACING.medium,
    right: SPACING.medium,
    padding: SPACING.small,
  },
  settingsIcon: {
    fontSize: 24,
  },
  profileAvatar: {
    position: 'absolute',
    bottom: 0,
    left: SPACING.medium,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: ORANGE.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: DARK.background,
  },
  avatarInitial: {
    fontSize: TYPOGRAPHY.xlarge.fontSize,
    fontWeight: 'bold',
    color: DARK.background,
  },
  profileInfo: {
    paddingHorizontal: SPACING.medium,
    paddingTop: SPACING.medium,
  },
  userName: {
    fontSize: TYPOGRAPHY.xlarge.fontSize,
    fontWeight: 'bold',
    color: DARK.text,
  },
  username: {
    fontSize: TYPOGRAPHY.medium.fontSize,
    color: DARK.textSecondary,
    marginTop: SPACING.tiny,
  },
  city: {
    fontSize: TYPOGRAPHY.small.fontSize,
    color: DARK.textSecondary,
    marginTop: SPACING.tiny,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.medium,
    marginHorizontal: SPACING.medium,
    marginTop: SPACING.medium,
    backgroundColor: DARK.surface,
    borderRadius: RADIUS.medium,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: TYPOGRAPHY.large.fontSize,
    fontWeight: 'bold',
    color: ORANGE.primary,
  },
  statLabel: {
    fontSize: TYPOGRAPHY.small.fontSize,
    color: DARK.textSecondary,
    marginTop: SPACING.tiny,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: DARK.border,
  },
  socialStatsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.medium,
    gap: SPACING.large,
  },
  socialStatItem: {
    alignItems: 'center',
  },
  socialStatValue: {
    fontSize: TYPOGRAPHY.large.fontSize,
    fontWeight: 'bold',
    color: DARK.text,
  },
  socialStatLabel: {
    fontSize: TYPOGRAPHY.small.fontSize,
    color: DARK.textSecondary,
    marginTop: SPACING.tiny,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: DARK.border,
    marginHorizontal: SPACING.medium,
  },
  tabItem: {
    flex: 1,
    paddingVertical: SPACING.medium,
    alignItems: 'center',
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: ORANGE.primary,
  },
  tabText: {
    fontSize: TYPOGRAPHY.medium.fontSize,
    color: DARK.textSecondary,
  },
  activeTabText: {
    color: ORANGE.primary,
    fontWeight: 'bold',
  },
  tabContent: {
    padding: SPACING.medium,
  },
  section: {
    marginBottom: SPACING.large,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.large.fontSize,
    fontWeight: 'bold',
    color: DARK.text,
    marginBottom: SPACING.medium,
  },
  activityPlaceholder: {
    height: 100,
    backgroundColor: DARK.surface,
    borderRadius: RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: DARK.textSecondary,
    fontSize: TYPOGRAPHY.medium.fontSize,
  },
  gearCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: DARK.surface,
    padding: SPACING.medium,
    borderRadius: RADIUS.medium,
    marginBottom: SPACING.small,
  },
  gearInfo: {
    flex: 1,
  },
  gearName: {
    fontSize: TYPOGRAPHY.medium.fontSize,
    fontWeight: 'bold',
    color: DARK.text,
  },
  gearType: {
    fontSize: TYPOGRAPHY.small.fontSize,
    color: DARK.textSecondary,
    marginTop: SPACING.tiny,
  },
  gearDistance: {
    fontSize: TYPOGRAPHY.medium.fontSize,
    color: ORANGE.primary,
    fontWeight: 'bold',
  },
  badgeRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.medium,
  },
  badgeItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: DARK.surface,
    borderRadius: RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: SPACING.small,
  },
  badgeName: {
    fontSize: TYPOGRAPHY.small.fontSize,
    color: DARK.text,
    textAlign: 'center',
  },
  prItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: DARK.surface,
    padding: SPACING.medium,
    borderRadius: RADIUS.medium,
    marginBottom: SPACING.small,
  },
  prLeft: {
    flex: 1,
  },
  prDistance: {
    fontSize: TYPOGRAPHY.medium.fontSize,
    fontWeight: 'bold',
    color: DARK.text,
  },
  prDate: {
    fontSize: TYPOGRAPHY.small.fontSize,
    color: DARK.textSecondary,
    marginTop: SPACING.tiny,
  },
  prTime: {
    fontSize: TYPOGRAPHY.medium.fontSize,
    color: ORANGE.primary,
    fontWeight: 'bold',
  },
});

export default ProfileTab;
