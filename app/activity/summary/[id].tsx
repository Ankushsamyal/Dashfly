import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { DARK, ORANGE } from '../../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../../src/constants/theme';
import { formatDistance, formatDuration, formatPace } from '../../../src/utils/formatters';

export default function ActivitySummaryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Summary</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map Placeholder</Text>
        </View>

        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Run</Text>
          </View>
        </View>

        <Text style={styles.title}>Morning Run</Text>
        <Text style={styles.timestamp}>Today, 7:30 AM</Text>

        <View style={styles.mainStats}>
          <View style={styles.mainStatItem}>
            <Text style={styles.mainStatValue}>5.2 km</Text>
            <Text style={styles.mainStatLabel}>Distance</Text>
          </View>
          <View style={styles.mainStatDivider} />
          <View style={styles.mainStatItem}>
            <Text style={styles.mainStatValue}>28:45</Text>
            <Text style={styles.mainStatLabel}>Time</Text>
          </View>
          <View style={styles.mainStatDivider} />
          <View style={styles.mainStatItem}>
            <Text style={styles.mainStatValue}>5:31</Text>
            <Text style={styles.mainStatLabel}>Avg Pace</Text>
          </View>
        </View>

        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Moving Time</Text>
            <Text style={styles.detailValue}>27:30</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Elevation Gain</Text>
            <Text style={styles.detailValue}>42 m</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Elevation Loss</Text>
            <Text style={styles.detailValue}>38 m</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Avg Speed</Text>
            <Text style={styles.detailValue}>10.8 km/h</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Max Speed</Text>
            <Text style={styles.detailValue}>14.2 km/h</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Best Pace</Text>
            <Text style={styles.detailValue}>4:58</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Calories</Text>
            <Text style={styles.detailValue}>320 cal</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Steps</Text>
            <Text style={styles.detailValue}>6,840</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsRow}>
            <View style={styles.achievementBadge}>
              <Text style={styles.achievementEmoji}>🏃</Text>
            </View>
            <View style={styles.achievementBadge}>
              <Text style={styles.achievementEmoji}>⚡</Text>
            </View>
            <View style={styles.achievementBadge}>
              <Text style={styles.achievementEmoji}>🎯</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Splits</Text>
          <View style={styles.splitsTable}>
            <View style={styles.splitHeader}>
              <Text style={styles.splitHeaderText}>Km</Text>
              <Text style={styles.splitHeaderText}>Pace</Text>
              <Text style={styles.splitHeaderText}>Elevation</Text>
            </View>
            {[1, 2, 3, 4, 5].map((km) => (
              <View key={km} style={styles.splitRow}>
                <Text style={styles.splitText}>{km}</Text>
                <Text style={styles.splitText}>5:{20 + km}</Text>
                <Text style={styles.splitText}>+{5 + km}m</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Charts</Text>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Pace Chart Placeholder</Text>
          </View>
          <View style={[styles.chartPlaceholder, { marginTop: SPACING.md }]}>
            <Text style={styles.chartPlaceholderText}>Elevation Chart Placeholder</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.discardButton}>
            <Text style={styles.discardButtonText}>Discard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  backButtonText: {
    color: DARK.text,
    ...TYPOGRAPHY.xlarge,
  },
  headerTitle: {
    color: DARK.text,
    ...TYPOGRAPHY.large,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  mapPlaceholderText: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.medium,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badge: {
    backgroundColor: ORANGE.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  badgeText: {
    color: '#fff',
    ...TYPOGRAPHY.small,
    fontWeight: '600',
  },
  title: {
    color: DARK.text,
    ...TYPOGRAPHY.xlarge,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  timestamp: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.small,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  mainStats: {
    flexDirection: 'row',
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  mainStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  mainStatValue: {
    color: DARK.text,
    ...TYPOGRAPHY.xlarge,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  mainStatLabel: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.small,
  },
  mainStatDivider: {
    width: 1,
    backgroundColor: DARK.border,
    marginHorizontal: SPACING.md,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  detailItem: {
    width: '50%',
    padding: SPACING.sm,
  },
  detailLabel: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.tiny,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    color: DARK.text,
    ...TYPOGRAPHY.medium,
    fontWeight: '600',
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: DARK.text,
    ...TYPOGRAPHY.large,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  achievementsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  achievementBadge: {
    width: 60,
    height: 60,
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementEmoji: {
    fontSize: 28,
  },
  splitsTable: {
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: DARK.border,
    marginBottom: SPACING.sm,
  },
  splitHeaderText: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.small,
    fontWeight: '600',
  },
  splitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: DARK.border,
  },
  splitText: {
    color: DARK.text,
    ...TYPOGRAPHY.small,
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholderText: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.medium,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  saveButton: {
    flex: 1,
    backgroundColor: ORANGE.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    ...TYPOGRAPHY.medium,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: DARK.card,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  shareButtonText: {
    color: DARK.text,
    ...TYPOGRAPHY.medium,
    fontWeight: '600',
  },
  discardButton: {
    flex: 1,
    backgroundColor: DARK.card,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  discardButtonText: {
    color: '#ff4444',
    ...TYPOGRAPHY.medium,
    fontWeight: '600',
  },
});
