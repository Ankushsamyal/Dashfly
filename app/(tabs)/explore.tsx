import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { DARK, ORANGE } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';

const SEGMENTS = [
  { id: '1', name: 'Central Park Loop', type: 'Running', distance: '5.2 km', attempts: '1.2k' },
  { id: '2', name: 'Riverfront Trail', type: 'Cycling', distance: '12.8 km', attempts: '890' },
  { id: '3', name: 'Hill Climb Sprint', type: 'Running', distance: '2.1 km', attempts: '3.4k' },
  { id: '4', name: 'Coastal Bike Path', type: 'Cycling', distance: '8.5 km', attempts: '1.1k' },
];

const CHALLENGES = [
  { id: '1', name: '10k Steps Daily', progress: 0.75 },
  { id: '2', name: 'Cycling 50km Week', progress: 0.4 },
  { id: '3', name: 'Run 3x Week', progress: 0.9 },
];

export default function Explore() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Segments');
  const tabs = ['Segments', 'Challenges', 'Routes'];

  const renderContent = () => {
    switch (activeTab) {
      case 'Segments':
        return (
          <FlatList
            data={SEGMENTS}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.segmentCard}>
                <View style={styles.segmentHeader}>
                  <Text style={styles.segmentName}>{item.name}</Text>
                  <Text style={styles.segmentType}>{item.type}</Text>
                </View>
                <View style={styles.segmentDetails}>
                  <Text style={styles.segmentDetail}>Distance: {item.distance}</Text>
                  <Text style={styles.segmentDetail}>Attempts: {item.attempts}</Text>
                </View>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        );
      case 'Challenges':
        return (
          <ScrollView contentContainerStyle={styles.listContent}>
            {CHALLENGES.map(challenge => (
              <View key={challenge.id} style={styles.challengeCard}>
                <Text style={styles.challengeName}>{challenge.name}</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBarFill, { width: `${challenge.progress * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(challenge.progress * 100)}% Complete</Text>
              </View>
            ))}
          </ScrollView>
        );
      case 'Routes':
        return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Routes Yet</Text>
            <Text style={styles.emptyStateSubtitle}>Create your first route to get started</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search segments, challenges..."
          placeholderTextColor={DARK.textSecondary}
        />
      </View>
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK.background,
    paddingTop: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerTitle: {
    ...TYPOGRAPHY.h1,
    color: DARK.text,
  },
  searchContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  searchBar: {
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: DARK.text,
    ...TYPOGRAPHY.body,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    backgroundColor: DARK.card,
  },
  activeTabButton: {
    backgroundColor: ORANGE.primary,
  },
  tabText: {
    ...TYPOGRAPHY.bodySmall,
    color: DARK.textSecondary,
  },
  activeTabText: {
    color: DARK.text,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  segmentCard: {
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: DARK.text,
    ...TYPOGRAPHY.body,
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  segmentName: {
    ...TYPOGRAPHY.body,
    color: DARK.text,
    fontWeight: '600',
  },
  segmentType: {
    ...TYPOGRAPHY.bodySmall,
    color: ORANGE.primary,
    backgroundColor: '#FC4C0220',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  segmentDetails: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  segmentDetail: {
    ...TYPOGRAPHY.bodySmall,
    color: DARK.textSecondary,
  },
  challengeCard: {
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    gap: SPACING.sm,
  },
  challengeName: {
    ...TYPOGRAPHY.body,
    color: DARK.text,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: DARK.surfaceTertiary,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: ORANGE.primary,
    borderRadius: RADIUS.full,
  },
  progressText: {
    ...TYPOGRAPHY.bodySmall,
    color: DARK.textSecondary,
    alignSelf: 'flex-end',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyStateTitle: {
    ...TYPOGRAPHY.h2,
    color: DARK.text,
    marginBottom: SPACING.sm,
  },
  emptyStateSubtitle: {
    ...TYPOGRAPHY.body,
    color: DARK.textSecondary,
    textAlign: 'center',
  },
});
