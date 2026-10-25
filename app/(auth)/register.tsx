import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../src/store/userStore';
import { ORANGE, DARK } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const signup = useUserStore((state) => state.signup);
  const isLoading = useUserStore((state) => state.isLoading);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) { Alert.alert('Error', 'Please fill in all fields'); return; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return; }
    const { error } = await signup(email, password, name);
    if (error) { Alert.alert('Signup Failed', error); }
    else { router.push('/(auth)/profile-setup'); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start your fitness journey today</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="John Doe" placeholderTextColor={DARK.textTertiary} editable={!isLoading} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={DARK.textTertiary} keyboardType="email-address" autoCapitalize="none" editable={!isLoading} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Min 6 characters" placeholderTextColor={DARK.textTertiary} secureTextEntry editable={!isLoading} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Re-enter password" placeholderTextColor={DARK.textTertiary} secureTextEntry editable={!isLoading} />
          </View>
          <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleSignup} disabled={isLoading} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{isLoading ? 'Creating Account...' : 'Create Account'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}><Text style={styles.footerLink}>Sign In</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK.background },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxxl },
  header: { marginBottom: SPACING.xxxl },
  title: { ...TYPOGRAPHY.displayMedium, color: DARK.text, marginBottom: SPACING.xs },
  subtitle: { ...TYPOGRAPHY.bodyLarge, color: DARK.textSecondary },
  form: { gap: SPACING.lg },
  inputContainer: { gap: SPACING.xs },
  label: { ...TYPOGRAPHY.labelMedium, color: DARK.textSecondary },
  input: { backgroundColor: DARK.surfaceSecondary, borderRadius: RADIUS.md, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, color: DARK.text, fontSize: 16, borderWidth: 1, borderColor: DARK.cardBorder },
  button: { backgroundColor: ORANGE.primary, paddingVertical: SPACING.lg, borderRadius: RADIUS.full, alignItems: 'center', marginTop: SPACING.md },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { ...TYPOGRAPHY.titleLarge, color: '#FFFFFF' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xxxl },
  footerText: { ...TYPOGRAPHY.bodyMedium, color: DARK.textSecondary },
  footerLink: { ...TYPOGRAPHY.bodyMedium, color: ORANGE.primary, fontWeight: '600' },
});
