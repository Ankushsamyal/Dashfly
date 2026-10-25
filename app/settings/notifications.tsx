import { useRouter } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { DARK, ORANGE } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';

export default function NotificationsSettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Kudos</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Comments</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>New Followers</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Activity Milestones</Text>
              <Switch
                value={false}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Friend Requests</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Messages</Text>
              <Switch
                value={false}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Group Invites</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Reminders</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Daily Goal Reminder</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Weekly Summary</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Challenge Reminders</Text>
              <Switch
                value={false}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>App Updates</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Promotional</Text>
              <Switch
                value={false}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
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
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: DARK.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.sm,
  },
  settingCard: {
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  settingLabel: {
    flex: 1,
    color: DARK.text,
    fontSize: 16,
  },
  settingDivider: {
    height: 1,
    backgroundColor: DARK.border,
    marginLeft: SPACING.md,
  },
});
