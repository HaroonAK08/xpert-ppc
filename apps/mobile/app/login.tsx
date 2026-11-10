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
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
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
          <View style={styles.content}>
            <View style={styles.brand}>
              <Image
                source={require('../assets/adaptive-icon.png')}
                style={styles.logo}
                resizeMode="contain"
                accessibilityIgnoresInvertColors
              />
              <View>
                <Text style={styles.brandTitle}>XpertPPC</Text>
                <Text style={styles.brandSubtitle}>Your lead workspace</Text>
              </View>
            </View>

            <View style={styles.heading}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Sign in to manage your leads and follow-ups.</Text>
            </View>

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
                placeholder="Enter your password"
              />
            </View>

            {error ? (
              <View style={styles.errorBox} accessibilityRole="alert">
                <Text style={styles.error}>{error}</Text>
              </View>
            ) : null}

            <Button title="Sign in" loading={loading} onPress={onSubmit} style={styles.submit} />
            <Text style={styles.footer}>A simpler way to stay on top of every lead.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxxl,
  },
  content: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xxxl },
  logo: { width: 44, height: 44, borderRadius: radius.md },
  brandTitle: { ...typography.brand, color: colors.text },
  brandSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  heading: { gap: spacing.sm, marginBottom: spacing.xxl },
  title: { ...typography.display, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary },
  fields: { gap: spacing.lg },
  errorBox: {
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  error: { ...typography.caption, color: colors.danger },
  submit: { marginTop: spacing.xl },
  footer: { ...typography.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl },
});
