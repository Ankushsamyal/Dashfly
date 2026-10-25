import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DARK, ORANGE } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';

export default function UserProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userBio}>Runner • 2.5k followers</Text>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2,450</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>380</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} style={styles.activityCard}>
              <View style={styles.activityIcon}>
                <Text style={styles.activityEmoji}>🏃</Text>
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>Morning Run</Text>
                <Text style={styles.activityMeta}>5.2 km • 28:45 • 2h ago</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsRow}>
            {['🏃', '⚡', '🎯', '🏔️'].map((emoji, index) => (
              <View key={index} style={styles.achievementBadge}>
                <Text style={styles.achievementEmoji}>{emoji}</Text>
              </View>
            ))}
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatarContainer: {
    marginBottom: SPACING.md,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: DARK.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: DARK.text,
    fontSize: 24,
    fontWeight: '700',
  },
  userName: {
    color: DARK.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  userBio: {
    color: DARK.textSecondary,
    fontSize: 14,
    marginBottom: SPACING.md,
  },
  followButton: {
    backgroundColor: ORANGE.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: DARK.text,
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
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: `${ORANGE.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  activityEmoji: {
    fontSize: 20,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    color: DARK.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  activityMeta: {
    color: DARK.textSecondary,
    fontSize: 14,
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
});
