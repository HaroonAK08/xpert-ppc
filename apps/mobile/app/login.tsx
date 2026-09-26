import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '@/api/auth';
import { ApiClientError } from '@/api/client';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { colors, radius, spacing, typography } from '@/theme';

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
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.hero}>
        <Image
          source={require('../assets/adaptive-icon.png')}
          style={styles.logoMark}
          resizeMode="contain"
        />
        <Text style={styles.subtitle}>Lead Management</Text>
        <Text style={styles.tagline}>Internal CRM for the XpertPPC team</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
        />
        <Input
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          textContentType="password"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Sign in" loading={loading} onPress={onSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.brandDark,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    gap: spacing.sm,
  },
  logoMark: {
    width: 160,
    height: 160,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.brandSoft,
  },
  tagline: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.65)',
  },
  form: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
});
