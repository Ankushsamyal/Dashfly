import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { requestLocationPermissions } from '../../src/services/locationService';
import * as Notifications from 'expo-notifications';
import { ORANGE, DARK } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';
import * as Haptics from 'expo-haptics';

export default function PermissionsScreen() {
  const router = useRouter();
  const [permissions, setPermissions] = useState([
    { key: 'location', title: 'Location', description: 'Required for GPS tracking', icon: '📍', granted: false },
    { key: 'motion', title: 'Motion & Fitness', description: 'Track steps and cadence', icon: '🏃', granted: false },
    { key: 'notifications', title: 'Notifications', description: 'Kudos and achievement alerts', icon: '🔔', granted: false },
  ]);

  const requestPermission = async (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let granted = false;
    switch (key) {
      case 'location': granted = await requestLocationPermissions(); break;
      case 'motion': granted = true; break;
      case 'notifications': { const { status } = await Notifications.requestPermissionsAsync(); granted = status === 'granted'; break; }
    }
    setPermissions((prev) => prev.map((p) => (p.key === key ? { ...p, granted } : p)));
  };

  const someGranted = permissions.some((p) => p.granted);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enable Permissions</Text>
        <Text style={styles.subtitle}>dashFly needs these to track your activities</Text>
      </View>
      <View style={styles.list}>
        {permissions.map((item) => (
          <View key={item.key} style={styles.permissionCard}>
            <View style={styles.permissionInfo}>
              <Text style={styles.permissionIcon}>{item.icon}</Text>
              <View style={styles.permissionText}>
                <Text style={styles.permissionTitle}>{item.title}</Text>
                <Text style={styles.permissionDescription}>{item.description}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.permissionButton, item.granted && styles.permissionButtonGranted]} onPress={() => requestPermission(item.key)}>
              <Text style={[styles.permissionButtonText, item.granted && styles.permissionButtonTextGranted]}>{item.granted ? 'Granted' : 'Enable'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity style={[styles.button, !someGranted && styles.buttonDisabled]} onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); router.replace('/(tabs)'); }} disabled={!someGranted}>
        <Text style={styles.buttonText}>{someGranted ? "Let's Go" : 'Enable at least one'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: DARK.background, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxxl },
  header: { marginBottom: SPACING.xxxl },
  title: { ...TYPOGRAPHY.displayMedium, color: DARK.text, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.bodyLarge, color: DARK.textSecondary },
  list: { gap: SPACING.lg, marginBottom: SPACING.xxxl },
  permissionCard: { backgroundColor: DARK.surfaceSecondary, borderRadius: RADIUS.lg, padding: SPACING.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: DARK.cardBorder },
  permissionInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  permissionIcon: { fontSize: 28, marginRight: SPACING.lg },
  permissionText: { flex: 1 },
  permissionTitle: { ...TYPOGRAPHY.titleMedium, color: DARK.text, marginBottom: 2 },
  permissionDescription: { ...TYPOGRAPHY.bodySmall, color: DARK.textSecondary },
  permissionButton: { backgroundColor: 'rgba(252, 76, 2, 0.15)', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: RADIUS.full },
  permissionButtonGranted: { backgroundColor: 'rgba(52, 199, 89, 0.15)' },
  permissionButtonText: { ...TYPOGRAPHY.labelMedium, color: ORANGE.primary },
  permissionButtonTextGranted: { color: DARK.success },
  button: { backgroundColor: ORANGE.primary, paddingVertical: SPACING.lg, borderRadius: RADIUS.full, alignItems: 'center' },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { ...TYPOGRAPHY.titleLarge, color: '#FFFFFF' },
});
