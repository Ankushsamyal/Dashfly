import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { DARK, ORANGE } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../../src/constants/theme';
import { formatDistance, formatDuration, formatRelativeTime } from '../../src/utils/formatters';
import { getActivityType } from '../../src/constants/activityTypes';
import * as Haptics from 'expo-haptics';

const mockActivities = [
  {
    id: '1',
    user: { name: 'Rahul Sharma', initial: 'R' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    activityType: 'run',
    title: 'Morning Run in Lodhi Garden',
    distance: 5200,
    duration: 28 * 60,
    elevation: 45,
    kudos: 12,
    hasKudos: false,
    comments: 3,
  },
  {
    id: '2',
    user: { name: 'Priya Patel', initial: 'P' },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    activityType: 'cycle',
    title: 'Evening Ride to Dwarka',
    distance: 22500,
    duration: 70 * 60,
    elevation: 120,
    kudos: 8,
    hasKudos: true,
    comments: 2,
  },
  {
    id: '3',
    user: { name: 'Amit Singh', initial: 'A' },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    activityType: 'walk',
    title: 'Post-dinner Walk around Hauz Khas',
    distance: 3100,
    duration: 35 * 60,
    elevation: 12,
    kudos: 4,
    hasKudos: false,
    comments: 1,
  },
  {
    id: '4',
    user: { name: 'Neha Gupta', initial: 'N' },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    activityType: 'run',
    title: 'Half Marathon Training Run',
    distance: 15000,
    duration: 85 * 60,
    elevation: 210,
    kudos: 23,
    hasKudos: false,
    comments: 5,
  },
  {
    id: '5',
    user: { name: 'Vikram Joshi', initial: 'V' },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    activityType: 'cycle',
    title: 'Mountain Biking in Aravali Hills',
    distance: 35200,
    duration: 135 * 60,
    elevation: 850,
    kudos: 18,
    hasKudos: true,
    comments: 4,
  },
];

export default function FeedScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('Everyone');
  const [activities, setActivities] = useState(mockActivities);

  const filters = ['Everyone', 'Following', 'Clubs'];

  const handleKudos = (id: string) => {
    setActivities(prev => prev.map(activity => {
      if (activity.id === id) {
        const newHasKudos = !activity.hasKudos;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return {
          ...activity,
          hasKudos: newHasKudos,
          kudos: newHasKudos ? activity.kudos + 1 : activity.kudos - 1,
        };
      }
      return activity;
    }));
  };

  const renderActivityCard = ({ item }: { item: any }) => {
    const activityType = getActivityType(item.activityType);
    return (
      <View style={[styles.card, SHADOWS.low]}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: activityType.color }]}>
              <Text style={styles.avatarText}>{item.user.initial}</Text>
            </View>
            <View style={styles.userText}>
              <Text style={styles.userName}>{item.user.name}</Text>
              <Text style={styles.timestamp}>{formatRelativeTime(new Date(item.timestamp))}</Text>
            </View>
          </View>
          <View style={[styles.activityBadge, { backgroundColor: activityType.color + '20' }]}>
            <Text style={[styles.badgeText, { color: activityType.color }]}>{activityType.label}</Text>
          </View>
        </View>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map Preview</Text>
        </View>
        <Text style={styles.activityTitle}>{item.title}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatDistance(item.distance, 'km')}</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatDuration(item.duration)}</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{item.elevation}m</Text>
            <Text style={styles.statLabel}>Elevation</Text>
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleKudos(item.id)}>
            <Text style={[styles.actionIcon, item.hasKudos && { color: ORANGE }]}>♥</Text>
            <Text style={styles.actionCount}>{item.kudos}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity Feed</Text>
      </View>
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlashList
        data={activities}
        renderItem={renderActivityCard}
        estimatedItemSize={300}
        contentContainerStyle={styles.feedContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: '#fff',
  },
  filtersContainer: {
    paddingVertical: SPACING.sm,
  },
  filtersScroll: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeFilterTab: {
    backgroundColor: ORANGE.primary,
  },
  filterText: {
    ...TYPOGRAPHY.body,
    color: '#fff',
  },
  activeFilterText: {
    color: DARK.background,
  },
  feedContent: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...TYPOGRAPHY.h3,
    color: '#fff',
  },
  userText: {
    gap: SPACING.xs,
  },
  userName: {
    ...TYPOGRAPHY.bodyBold,
    color: '#fff',
  },
  timestamp: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  activityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    ...TYPOGRAPHY.captionBold,
  },
  mapPlaceholder: {
    height: 150,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  activityTitle: {
    ...TYPOGRAPHY.h2,
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  statItem: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statValue: {
    ...TYPOGRAPHY.bodyBold,
    color: '#fff',
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: SPACING.lg,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionIcon: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.5)',
  },
  actionCount: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.5)',
  },
});
