import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { DARK, ORANGE } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';
import { formatDistance, formatTime, formatPace } from '../../src/utils/formatters';

export default function SegmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Segment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.segmentInfo}>
          <Text style={styles.segmentName}>Bald Hill Sprint</Text>
          <Text style={styles.segmentDistance}>1.2 km • 4:32 PR</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Attempts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4:32</Text>
            <Text style={styles.statLabel}>Your PR</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>3:58</Text>
            <Text style={styles.statLabel}>KOM</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          <View style={styles.leaderboard}>
            {[
              { rank: 1, name: 'Alex M.', time: '3:58', isKOM: true },
              { rank: 2, name: 'Sarah K.', time: '4:02', isKOM: false },
              { rank: 3, name: 'Mike R.', time: '4:10', isKOM: false },
              { rank: 4, name: 'You', time: '4:32', isKOM: false, isYou: true },
              { rank: 5, name: 'John D.', time: '4:38', isKOM: false },
              { rank: 6, name: 'Emma L.', time: '4:45', isKOM: false },
              { rank: 7, name: 'Tom W.', time: '4:52', isKOM: false },
              { rank: 8, name: 'Lisa P.', time: '5:01', isKOM: false },
            ].map((entry) => (
              <View key={entry.rank} style={[styles.leaderboardRow, entry.isYou && styles.yourEntry]}>
                <View style={styles.rankContainer}>
                  <Text style={[styles.rankText, entry.rank <= 3 && styles.topRank]}>
                    {entry.rank}
                  </Text>
                </View>
                <View style={styles.athleteInfo}>
                  <Text style={[styles.athleteName, entry.isYou && styles.yourName]}>
                    {entry.name}
                  </Text>
                  {entry.isKOM && <Text style={styles.komBadge}>KOM</Text>}
                </View>
                <Text style={[styles.athleteTime, entry.isYou && styles.yourTime]}>
                  {entry.time}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segment Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Avg Grade</Text>
              <Text style={styles.statValue}>3.2%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Elevation</Text>
              <Text style={styles.statValue}>38 m</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Max Grade</Text>
              <Text style={styles.statValue}>8.5%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statGridLabel}>Category</Text>
              <Text style={styles.statValue}>Sprint</Text>
            </View>
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
    fontSize: 24,
  },
  headerTitle: {
    color: DARK.text,
    fontSize: 20,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  segmentInfo: {
    marginBottom: SPACING.lg,
  },
  segmentName: {
    color: DARK.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  segmentDistance: {
    color: DARK.textSecondary,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
  },
  statValue: {
    color: ORANGE.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  statLabel: {
    color: DARK.textSecondary,
    fontSize: 12,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: DARK.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  leaderboard: {
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: DARK.border,
  },
  yourEntry: {
    backgroundColor: `${ORANGE.primary}20`,
    borderRadius: RADIUS.sm,
    borderBottomWidth: 0,
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
  },
  rankText: {
    color: DARK.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  topRank: {
    color: ORANGE.primary,
  },
  athleteInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  athleteName: {
    color: DARK.text,
    fontSize: 16,
    fontWeight: '500',
  },
  yourName: {
    color: ORANGE.primary,
    fontWeight: '700',
  },
  komBadge: {
    backgroundColor: ORANGE.primary,
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  athleteTime: {
    color: DARK.text,
    fontSize: 16,
    fontWeight: '600',
  },
  yourTime: {
    color: ORANGE.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  statItem: {
    width: '45%',
    padding: SPACING.sm,
  },
  statGridLabel: {
    color: DARK.textSecondary,
    fontSize: 12,
    marginBottom: SPACING.xs,
  },
});
