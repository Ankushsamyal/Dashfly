import { useRouter } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { DARK, ORANGE } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';

export default function UnitsSettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Units</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <View style={styles.optionsCard}>
            <TouchableOpacity style={[styles.optionRow, styles.selectedOption]}>
              <Text style={[styles.optionText, styles.selectedOptionText]}>Metric (km, m)</Text>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.optionDivider} />
            <TouchableOpacity style={styles.optionRow}>
              <Text style={styles.optionText}>Imperial (mi, ft)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weight</Text>
          <View style={styles.optionsCard}>
            <TouchableOpacity style={styles.optionRow}>
              <Text style={styles.optionText}>Kilograms (kg)</Text>
            </TouchableOpacity>
            <View style={styles.optionDivider} />
            <TouchableOpacity style={[styles.optionRow, styles.selectedOption]}>
              <Text style={[styles.optionText, styles.selectedOptionText]}>Pounds (lbs)</Text>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Temperature</Text>
          <View style={styles.optionsCard}>
            <TouchableOpacity style={[styles.optionRow, styles.selectedOption]}>
              <Text style={[styles.optionText, styles.selectedOptionText]}>Celsius (°C)</Text>
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.optionDivider} />
            <TouchableOpacity style={styles.optionRow}>
              <Text style={styles.optionText}>Fahrenheit (°F)</Text>
            </TouchableOpacity>
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
  optionDivider: {
    height: 1,
    backgroundColor: DARK.border,
    marginLeft: SPACING.md,
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
