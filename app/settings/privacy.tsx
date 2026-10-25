import { useRouter } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { DARK, ORANGE } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';

export default function PrivacySettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Mode</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Enable Privacy Mode</Text>
                <Text style={styles.settingDescription}>
                  Hide your activities from other users
                </Text>
              </View>
              <Switch
                value={false}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location Privacy</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Hide Exact Location</Text>
                <Text style={styles.settingDescription}>
                  Blur your location on public maps
                </Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Radius</Text>
          <View style={styles.optionsCard}>
            {[
              { label: 'None (Exact Location)', value: 'none' },
              { label: '500m Radius', value: '500' },
              { label: '1km Radius', value: '1000' },
              { label: '2km Radius', value: '2000' },
              { label: '5km Radius', value: '5000' },
            ].map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionRow,
                  option.value === '1000' && styles.selectedOption,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    option.value === '1000' && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
                {option.value === '1000' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Visibility</Text>
          <View style={styles.settingCard}>
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Show on Leaderboards</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Show Stats to Others</Text>
              <Switch
                value={true}
                trackColor={{ false: DARK.border, true: ORANGE.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingDivider} />
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Show Achievements</Text>
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
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    color: DARK.text,
    fontSize: 16,
    marginBottom: SPACING.xs,
  },
  settingDescription: {
    color: DARK.textSecondary,
    fontSize: 14,
  },
  settingDivider: {
    height: 1,
    backgroundColor: DARK.border,
    marginLeft: SPACING.md,
  },
  optionsCard: {
    backgroundColor: DARK.card,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  selectedOption: {
    backgroundColor: `${ORANGE.primary}15`,
  },
  optionText: {
    flex: 1,
    color: DARK.text,
    fontSize: 16,
  },
  selectedOptionText: {
    color: ORANGE.primary,
    fontWeight: '600',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ORANGE.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
