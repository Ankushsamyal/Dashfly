import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ORANGE, DARK } from '../../src/constants/colors';
import { SPACING, TYPOGRAPHY, RADIUS } from '../../src/constants/theme';
import * as Haptics from 'expo-haptics';

export default function WelcomeScreen() {
  const router = useRouter();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 12 }));
    opacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    textOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    buttonScale.value = withDelay(1000, withSpring(1, { damping: 10 }));
    pulse.value = withDelay(1500, withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 })));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textOpacity.value === 0 ? 20 : 0 }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }, { scale: pulse.value }],
    opacity: buttonScale.value,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>dF</Text>
        </View>
        <View style={styles.logoGlow} />
      </Animated.View>

      <Animated.View style={[styles.textContainer, textStyle]}>
        <Text style={styles.title}>dashFly</Text>
        <Text style={styles.subtitle}>Track every move. Beat every record.</Text>
      </Animated.View>

      <Animated.View style={buttonStyle}>
        <TouchableOpacity style={styles.button} onPress={handlePress} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/(auth)/login')} activeOpacity={0.6}>
        <Text style={styles.loginText}>Already have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  logoContainer: { alignItems: 'center', marginBottom: SPACING.xxxl },
  logo: { width: 120, height: 120, borderRadius: 30, backgroundColor: ORANGE.primary, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  logoText: { fontFamily: 'Syne-Bold', fontSize: 48, color: '#FFFFFF', letterSpacing: -2 },
  logoGlow: { position: 'absolute', width: 160, height: 160, borderRadius: 40, backgroundColor: ORANGE.primary, opacity: 0.15 },
  textContainer: { alignItems: 'center', marginBottom: SPACING.xxxl },
  title: { ...TYPOGRAPHY.displayLarge, color: DARK.text, marginBottom: SPACING.sm },
  subtitle: { ...TYPOGRAPHY.bodyLarge, color: DARK.textSecondary, textAlign: 'center' },
  button: { backgroundColor: ORANGE.primary, paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxxl, borderRadius: RADIUS.full, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  buttonText: { ...TYPOGRAPHY.titleLarge, color: '#FFFFFF' },
  loginLink: { marginTop: SPACING.xxl, padding: SPACING.lg },
  loginText: { ...TYPOGRAPHY.bodyMedium, color: DARK.textSecondary },
});
