import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { login } from '@/api/auth';
import { ApiClientError } from '@/api/client';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { colors, gradients, radius, shadows, spacing, typography } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit() {
    setError('');
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      await setSession(res.token, res.user);
      router.replace('/(tabs)/dashboard');
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} />
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeInDown.duration(520).springify().damping(16)} style={styles.hero}>
              <View style={styles.logoRing}>
                <Image
                  source={require('../assets/adaptive-icon.png')}
                  style={styles.logoMark}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.brandTitle}>XpertPPC</Text>
              <Text style={styles.tagline}>Internal lead management, built for the field team</Text>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(140).duration(520).springify().damping(16)} style={styles.form}>
              <Text style={styles.formTitle}>Welcome back</Text>
              <Text style={styles.formSubtitle}>Sign in to pick up where you left off</Text>

              <View style={styles.fields}>
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  placeholder="you@xpertppc.com"
                />
                <Input
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                  textContentType="password"
                  returnKeyType="go"
                  onSubmitEditing={onSubmit}
                  placeholder="••••••••"
                />
              </View>

              {error ? (
                <Animated.View entering={FadeInDown.duration(220)} style={styles.errorBox}>
                  <Text style={styles.error}>{error}</Text>
                </Animated.View>
              ) : null}

              <Button title="Sign in" loading={loading} onPress={onSubmit} style={styles.submit} />
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.brandDeep },
  flex: { flex: 1 },
  safe: { flex: 1 },
  glowTop: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(20, 118, 255, 0.35)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -140,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(6, 182, 212, 0.18)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.xs,
  },
  logoRing: {
    width: 104,
    height: 104,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.raised,
  },
  logoMark: {
    width: 68,
    height: 68,
  },
  brandTitle: {
    ...typography.display,
    color: colors.white,
    fontSize: 26,
  },
  tagline: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.68)',
    textAlign: 'center',
    maxWidth: 260,
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    gap: spacing.lg,
    ...shadows.floating,
  },
  formTitle: { ...typography.title, color: colors.text },
  formSubtitle: { ...typography.body, color: colors.textSecondary, marginTop: -spacing.sm },
  fields: { gap: spacing.md },
  errorBox: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  error: { ...typography.caption, color: colors.danger },
  submit: { marginTop: spacing.xs },
});
