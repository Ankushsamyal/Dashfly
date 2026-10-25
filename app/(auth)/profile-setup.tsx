import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '../../src/store/userStore';
import { ORANGE, DARK } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';
import * as Haptics from 'expo-haptics';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const updateProfile = useUserStore((state) => state.updateProfile);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [city, setCity] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Please grant photo library access.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const handleContinue = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updates: any = {};
    if (weight) updates.weight = parseFloat(weight);
    if (height) updates.height = parseFloat(height);
    if (city) updates.city = city;
    if (Object.keys(updates).length > 0) await updateProfile(updates);
    router.push('/(auth)/permissions');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>Help us personalize your experience</Text>
      </View>
      <TouchableOpacity style={styles.photoContainer} onPress={pickImage} activeOpacity={0.7}>
        {photoUri ? <Image source={{ uri: photoUri }} style={{ width: 100, height: 100, borderRadius: 50 }} /> : <View style={styles.photoPlaceholder}><Text style={styles.photoIcon}>+</Text></View>}
        <Text style={styles.photoLabel}>{photoUri ? 'Change Photo' : 'Add Profile Photo'}</Text>
      </TouchableOpacity>
      <View style={styles.form}>
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: SPACING.sm }]}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput style={styles.input} value={weight} onChangeText={setWeight} placeholder="70" placeholderTextColor={DARK.textTertiary} keyboardType="numeric" />
          </View>
          <View style={[styles.inputContainer, { flex: 1, marginLeft: SPACING.sm }]}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput style={styles.input} value={height} onChangeText={setHeight} placeholder="175" placeholderTextColor={DARK.textTertiary} keyboardType="numeric" />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>City</Text>
          <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="e.g., Mumbai, Delhi, Bangalore" placeholderTextColor={DARK.textTertiary} />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleContinue} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/(auth)/permissions')}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: DARK.background, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxxl },
  header: { marginBottom: SPACING.xxxl },
  title: { ...TYPOGRAPHY.displayMedium, color: DARK.text, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.bodyLarge, color: DARK.textSecondary },
  photoContainer: { alignItems: 'center', marginBottom: SPACING.xxxl },
  photo: { width: 100, height: 100, borderRadius: 50 },
  photoPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: DARK.surfaceSecondary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: DARK.cardBorder, borderStyle: 'dashed' },
  photoIcon: { fontSize: 40, color: DARK.textTertiary },
  photoLabel: { ...TYPOGRAPHY.labelMedium, color: ORANGE.primary, marginTop: SPACING.sm },
  form: { gap: SPACING.lg },
  row: { flexDirection: 'row' },
  inputContainer: { gap: SPACING.xs },
  label: { ...TYPOGRAPHY.labelMedium, color: DARK.textSecondary },
  input: { backgroundColor: DARK.surfaceSecondary, borderRadius: RADIUS.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, color: DARK.text, fontSize: 16, borderWidth: 1, borderColor: DARK.cardBorder },
  button: { backgroundColor: ORANGE.primary, paddingVertical: SPACING.lg, borderRadius: RADIUS.full, alignItems: 'center', marginTop: SPACING.md },
  buttonText: { ...TYPOGRAPHY.titleLarge, color: '#FFFFFF' },
  skipButton: { alignItems: 'center', padding: SPACING.lg },
  skipText: { ...TYPOGRAPHY.bodyMedium, color: DARK.textTertiary },
});
