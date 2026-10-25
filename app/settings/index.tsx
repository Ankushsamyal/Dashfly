import { useRouter } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { DARK, ORANGE } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Dark Mode</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Units</Text>
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => router.push('/settings/units')}
          >
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Units</Text>
              <Text style={styles.settingValue}>Metric</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Auto-Pause</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Audio Cues</Text>
              <Switch
                value={false}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => router.push('/settings/privacy')}
          >
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Privacy Settings</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => router.push('/settings/notifications')}
          >
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Notification Settings</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Export Data</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.settingDivider} />
          <TouchableOpacity style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Connected Devices</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Version</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  headerTitle: {
    color: DARK.text,
    fontSize: 24,
    fontWeight: '700',
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
  settingValue: {
    color: DARK.textSecondary,
    fontSize: 14,
    marginRight: SPACING.sm,
  },
  chevron: {
    color: DARK.textSecondary,
    fontSize: 24,
  },
  settingDivider: {
    height: 1,
    backgroundColor: DARK.border,
    marginLeft: SPACING.md,
  },
  signOutButton: {
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  signOutText: {
    color: '#ff4444',
    fontSize: 16,
    fontWeight: '600',
  },
});
