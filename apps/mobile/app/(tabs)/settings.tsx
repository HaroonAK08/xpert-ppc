import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  connectSheet,
  fetchSheetConnection,
  syncSheet,
} from '@/api/googleSheets';
import { logout } from '@/api/auth';
import { unregisterDevice } from '@/api/devices';
import { registerForPushNotificationsAsync } from '@/services/notifications';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { GradientHeader } from '@/components/GradientHeader';
import { SyncIndicator } from '@/components/SyncIndicator';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LoadingState, ErrorState } from '@/components/EmptyState';
import { ApiClientError } from '@/api/client';
import { colors, radius, shadows, spacing, typography } from '@/theme';

function initials(name?: string | null) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || '').concat(parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '').toUpperCase();
}

export default function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const router = useRouter();
  const qc = useQueryClient();

  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [worksheetName, setWorksheetName] = useState('Sheet1');
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function onSignOut() {
    setConfirmSignOut(false);
    setSigningOut(true);
    try {
      const pushToken = await registerForPushNotificationsAsync().catch(() => null);
      if (pushToken) await unregisterDevice(pushToken).catch(() => {});
      await logout();
    } finally {
      await clearSession();
      router.replace('/login');
    }
  }

  const query = useQuery({
    queryKey: ['sheets'],
    queryFn: async () => (await fetchSheetConnection()).data,
  });

  const connectMutation = useMutation({
    mutationFn: () =>
      connectSheet({
        spreadsheetId: spreadsheetId.trim(),
        worksheetName: worksheetName.trim() || 'Sheet1',
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['sheets'] });
      Alert.alert('Connected', 'Google Sheet connected. You can sync now.');
    },
  });

  const syncMutation = useMutation({
    mutationFn: syncSheet,
    onSuccess: (res) => {
      void qc.invalidateQueries({ queryKey: ['sheets'] });
      void qc.invalidateQueries({ queryKey: ['leads'] });
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
      const r = res.data.report;
      Alert.alert(
        'Sync complete',
        `${r.checked} checked · ${r.created} new · ${r.updated} updated · ${r.pushed} pushed · ${r.conflicts} conflicts · ${r.failed} failed`
      );
    },
  });

  if (query.isLoading && !query.data) return <LoadingState />;
  if (query.isError && !query.data) {
    return (
      <ErrorState
        message={query.error instanceof ApiClientError ? query.error.message : 'Failed to load settings'}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const connection = query.data?.connection;
  const configured = query.data?.configured;
  const connected = Boolean(connection?.connected);

  return (
    <View style={styles.screen}>
      <GradientHeader eyebrow="Account" title="Settings" subtitle="Manage your profile & integrations" />

      <ScrollView style={styles.flex} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(360).springify().damping(18)} style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>{initials(user?.name)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.meta}>{user?.email}</Text>
            </View>
          </View>
          <Button
            title="Sign out"
            variant="danger"
            loading={signingOut}
            onPress={() => setConfirmSignOut(true)}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(360).springify().damping(18)} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.cardIcon, { backgroundColor: colors.successSoft }]}>
              <Ionicons name="grid-outline" size={18} color={colors.success} />
            </View>
            <Text style={styles.section}>Google Sheets</Text>
            <View style={[styles.statusPill, connected ? styles.statusPillOn : styles.statusPillOff]}>
              <View style={[styles.statusDot, { backgroundColor: connected ? colors.success : colors.textMuted }]} />
              <Text style={[styles.statusPillText, { color: connected ? colors.success : colors.textSecondary }]}>
                {connected ? 'Connected' : 'Not connected'}
              </Text>
            </View>
          </View>

          <Text style={styles.help}>
            Credentials stay on the backend. Share your spreadsheet with the Google service account
            (Editor), then paste the spreadsheet ID below.
          </Text>

          {!configured ? (
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={16} color={colors.warning} />
              <Text style={styles.warning}>
                Backend Google service account is not configured yet. Ask an admin to set
                GOOGLE_SERVICE_ACCOUNT_JSON.
              </Text>
            </View>
          ) : null}

          {connected ? (
            <View style={{ gap: spacing.md }}>
              <Text style={styles.name}>{connection!.spreadsheetTitle || connection!.spreadsheetId}</Text>
              <Text style={styles.meta}>Worksheet: {connection!.worksheetName}</Text>
              <SyncIndicator
                state={syncMutation.isPending ? 'syncing' : connection!.lastSyncState}
                lastSyncedAt={connection!.lastSyncedAt}
              />
              {connection!.lastSyncReport ? (
                <Text style={styles.meta}>
                  Last run: {connection!.lastSyncReport.checked} checked ·{' '}
                  {connection!.lastSyncReport.created} new · {connection!.lastSyncReport.updated}{' '}
                  updated · {connection!.lastSyncReport.pushed} pushed ·{' '}
                  {connection!.lastSyncReport.failed} failed
                </Text>
              ) : null}
              <Button
                title="Sync now"
                loading={syncMutation.isPending}
                onPress={() => syncMutation.mutate()}
              />
              {syncMutation.isError ? (
                <Text style={styles.error}>
                  {syncMutation.error instanceof ApiClientError
                    ? syncMutation.error.message
                    : 'Sync failed'}
                </Text>
              ) : null}
            </View>
          ) : (
            <View style={{ gap: spacing.md }}>
              <Input
                label="Spreadsheet ID"
                value={spreadsheetId}
                onChangeText={setSpreadsheetId}
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                autoCapitalize="none"
              />
              <Input
                label="Worksheet / tab name"
                value={worksheetName}
                onChangeText={setWorksheetName}
                placeholder="Sheet1"
              />
              <Button
                title="Connect Google Sheet"
                loading={connectMutation.isPending}
                disabled={!configured || !spreadsheetId.trim()}
                onPress={() => connectMutation.mutate()}
              />
              {connectMutation.isError ? (
                <Text style={styles.error}>
                  {connectMutation.error instanceof ApiClientError
                    ? connectMutation.error.message
                    : 'Could not connect'}
                </Text>
              ) : null}
            </View>
          )}
        </Animated.View>

        <Text style={styles.footer}>XpertPPC CRM · v1.0.0</Text>
      </ScrollView>

      <ConfirmDialog
        visible={confirmSignOut}
        title="Sign out?"
        message="You'll need to sign in again to access your leads."
        confirmLabel="Sign out"
        destructive
        onCancel={() => setConfirmSignOut(false)}
        onConfirm={onSignOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: 0, marginTop: -spacing.xl, gap: spacing.lg, paddingBottom: spacing.xxl },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadows.floating,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  profileAvatarText: { ...typography.title, color: colors.white, fontSize: 20 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  cardIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusPillOn: { backgroundColor: colors.successSoft },
  statusPillOff: { backgroundColor: colors.surfaceMuted },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusPillText: { ...typography.small, fontWeight: '700' },
  section: { ...typography.subtitle, color: colors.text, flex: 1 },
  name: { ...typography.body, color: colors.text, fontWeight: '600' },
  meta: { ...typography.caption, color: colors.textSecondary },
  help: { ...typography.body, color: colors.textSecondary, fontSize: 14 },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.warningSoft,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  warning: { ...typography.caption, color: colors.warning, flex: 1 },
  error: { ...typography.caption, color: colors.danger },
  footer: { ...typography.small, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
});
