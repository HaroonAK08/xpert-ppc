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
import {
  connectSheet,
  disconnectSheet,
  fetchSheetConnection,
  syncSheet,
} from '@/api/googleSheets';
import { logout } from '@/api/auth';
import { unregisterDevice } from '@/api/devices';
import { registerForPushNotificationsAsync } from '@/services/notifications';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { SyncIndicator } from '@/components/SyncIndicator';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LoadingState, ErrorState } from '@/components/EmptyState';
import { ApiClientError } from '@/api/client';
import { colors, radius, spacing, typography } from '@/theme';

export default function SettingsScreen() {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);
  const router = useRouter();
  const qc = useQueryClient();

  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [worksheetName, setWorksheetName] = useState('Sheet1');
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function onSignOut() {
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

  const disconnectMutation = useMutation({
    mutationFn: disconnectSheet,
    onSuccess: () => {
      setConfirmDisconnect(false);
      void qc.invalidateQueries({ queryKey: ['sheets'] });
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

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.section}>Account</Text>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.meta}>{user?.email}</Text>
        <Button title="Sign out" variant="danger" loading={signingOut} onPress={onSignOut} />
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Google Sheets</Text>
        <Text style={styles.help}>
          Credentials stay on the backend. Share your spreadsheet with the Google service account
          (Editor), then paste the spreadsheet ID below.
        </Text>

        {!configured ? (
          <Text style={styles.warning}>
            Backend Google service account is not configured yet. Ask an admin to set
            GOOGLE_SERVICE_ACCOUNT_JSON.
          </Text>
        ) : null}

        {connection?.connected ? (
          <View style={{ gap: spacing.md }}>
            <Text style={styles.name}>{connection.spreadsheetTitle || connection.spreadsheetId}</Text>
            <Text style={styles.meta}>Worksheet: {connection.worksheetName}</Text>
            <SyncIndicator
              state={syncMutation.isPending ? 'syncing' : connection.lastSyncState}
              lastSyncedAt={connection.lastSyncedAt}
            />
            {connection.lastSyncReport ? (
              <Text style={styles.meta}>
                Last run: {connection.lastSyncReport.checked} checked ·{' '}
                {connection.lastSyncReport.created} new · {connection.lastSyncReport.updated}{' '}
                updated · {connection.lastSyncReport.pushed} pushed ·{' '}
                {connection.lastSyncReport.failed} failed
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
            <Button
              title="Disconnect"
              variant="danger"
              onPress={() => setConfirmDisconnect(true)}
            />
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
      </View>

      <ConfirmDialog
        visible={confirmDisconnect}
        title="Disconnect Google Sheet?"
        message="Leads already imported stay in the CRM. Sync will stop until you reconnect."
        confirmLabel="Disconnect"
        destructive
        onCancel={() => setConfirmDisconnect(false)}
        onConfirm={() => disconnectMutation.mutate()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  section: { ...typography.subtitle, color: colors.text },
  name: { ...typography.body, color: colors.text, fontWeight: '600' },
  meta: { ...typography.caption, color: colors.textSecondary },
  help: { ...typography.body, color: colors.textSecondary, fontSize: 14 },
  warning: { ...typography.caption, color: colors.warning },
  error: { ...typography.caption, color: colors.danger },
});
