import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { DARK, ORANGE } from '../../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../../src/constants/theme';
import { formatDistance, formatDuration, formatPace } from '../../../src/utils/formatters';

export default function ActivityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Detail</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Map Placeholder</Text>
        </View>

        <Text style={styles.title}>Morning Run</Text>
        <Text style={styles.timestamp}>Today, 7:30 AM</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5.2 km</Text>
            <Text style={styles.statLabel}>Distance</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>28:45</Text>
            <Text style={styles.statLabel}>Time</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5:31</Text>
            <Text style={styles.statLabel}>Avg Pace</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>320</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Elevation</Text>
          <View style={styles.elevationCard}>
            <View style={styles.elevationItem}>
              <Text style={styles.elevationLabel}>Elevation Gain</Text>
              <Text style={styles.elevationValue}>+42 m</Text>
            </View>
            <View style={styles.elevationDivider} />
            <View style={styles.elevationItem}>
              <Text style={styles.elevationLabel}>Elevation Loss</Text>
              <Text style={styles.elevationValue}>-38 m</Text>
            </View>
            <View style={styles.elevationDivider} />
            <View style={styles.elevationItem}>
              <Text style={styles.elevationLabel}>Lowest Point</Text>
              <Text style={styles.elevationValue}>124 m</Text>
            </View>
            <View style={styles.elevationDivider} />
            <View style={styles.elevationItem}>
              <Text style={styles.elevationLabel}>Highest Point</Text>
              <Text style={styles.elevationValue}>162 m</Text>
            </View>
          </View>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>Elevation Chart Placeholder</Text>
          </View>
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
    height: 250,
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  mapPlaceholderText: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.medium,
  },
  title: {
    color: DARK.text,
    ...TYPOGRAPHY.xlarge,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  timestamp: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.small,
    marginBottom: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: DARK.text,
    ...TYPOGRAPHY.medium,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.tiny,
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
  elevationCard: {
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  elevationItem: {
    paddingVertical: SPACING.sm,
  },
  elevationLabel: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.small,
    marginBottom: SPACING.xs,
  },
  elevationValue: {
    color: DARK.text,
    ...TYPOGRAPHY.medium,
    fontWeight: '600',
  },
  elevationDivider: {
    height: 1,
    backgroundColor: DARK.border,
  },
  chartPlaceholder: {
    height: 150,
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  chartPlaceholderText: {
    color: DARK.textSecondary,
    ...TYPOGRAPHY.medium,
  },
});
