import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../src/store/userStore';
import { ORANGE, DARK } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const isLoading = useUserStore((state) => state.isLoading);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { Alert.alert('Error', 'Please fill in all fields'); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const { error } = await login(email, password);
    if (error) { Alert.alert('Login Failed', error); }
    else { router.replace('/(tabs)'); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue tracking</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="you@example.com" placeholderTextColor={DARK.textTertiary} keyboardType="email-address" autoCapitalize="none" editable={!isLoading} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Enter your password" placeholderTextColor={DARK.textTertiary} secureTextEntry editable={!isLoading} />
          </View>
          <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleLogin} disabled={isLoading} activeOpacity={0.8}>
            <Text style={styles.buttonText}>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.forgotPassword} onPress={() => Alert.alert('Reset Password', 'Password reset link sent.')}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
          <View style={styles.divider}><View style={styles.dividerLine} /><Text style={styles.dividerText}>or</Text><View style={styles.dividerLine} /></View>
          <TouchableOpacity style={styles.googleButton} onPress={() => Alert.alert('Coming Soon', 'Google OAuth will be available soon.')} activeOpacity={0.8}>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}><Text style={styles.footerLink}>Sign Up</Text></TouchableOpacity>
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
  forgotPassword: { alignItems: 'center' },
  forgotText: { ...TYPOGRAPHY.bodyMedium, color: ORANGE.primary },
  divider: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg, marginVertical: SPACING.xs },
  dividerLine: { flex: 1, height: 1, backgroundColor: DARK.divider },
  dividerText: { ...TYPOGRAPHY.bodyMedium, color: DARK.textTertiary },
  googleButton: { backgroundColor: DARK.surfaceSecondary, paddingVertical: SPACING.lg, borderRadius: RADIUS.full, alignItems: 'center', borderWidth: 1, borderColor: DARK.cardBorder },
  googleButtonText: { ...TYPOGRAPHY.titleMedium, color: DARK.text },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xxxl },
  footerText: { ...TYPOGRAPHY.bodyMedium, color: DARK.textSecondary },
  footerLink: { ...TYPOGRAPHY.bodyMedium, color: ORANGE.primary, fontWeight: '600' },
});
