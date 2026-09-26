import React, { useEffect } from 'react';
import {
  AppState,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchDashboard } from '@/api/dashboard';
import { syncSheet } from '@/api/googleSheets';
import { useAuthStore } from '@/store/auth';
import { useOfflineStore } from '@/store/offline';
import { StatCard } from '@/components/StatCard';
import { SyncIndicator } from '@/components/SyncIndicator';
import { Button } from '@/components/Button';
import { LoadingState, ErrorState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { colors, radius, spacing, typography } from '@/theme';
import { ApiClientError } from '@/api/client';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isOnline = useOfflineStore((s) => s.isOnline);
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await fetchDashboard()).data,
  });

  const syncMutation = useMutation({
    mutationFn: syncSheet,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
      void qc.invalidateQueries({ queryKey: ['leads'] });
      void qc.invalidateQueries({ queryKey: ['sheets'] });
    },
  });

  useEffect(() => {
    // Pull the latest sheet rows the moment the app opens, and again each
    // time it's brought back to the foreground — not just when someone
    // taps "Sync" manually. Silent: errors already surface via the
    // existing sync-error banner below if this fails.
    syncMutation.mutate();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') syncMutation.mutate();
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (query.isLoading && !query.data) {
    return <LoadingState label="Loading dashboard…" />;
  }

  if (query.isError && !query.data) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message={query.error instanceof ApiClientError ? query.error.message : 'Please try again.'}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const data = query.data!;
  const stats = data.stats;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={query.isFetching}
          onRefresh={() => void query.refetch()}
          tintColor={colors.brand}
          colors={[colors.brand]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.brand}>XpertPPC</Text>
        <Text style={styles.hello}>
          {greeting()}
          {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </Text>
        {!isOnline ? (
          <Text style={styles.offline}>Offline — showing cached data when available</Text>
        ) : null}
      </View>

      <View style={styles.syncRow}>
        <SyncIndicator
          state={syncMutation.isPending ? 'syncing' : stats.lastSyncedAt ? 'success' : 'idle'}
          lastSyncedAt={stats.lastSyncedAt}
        />
        <Button
          title="Sync"
          variant="secondary"
          loading={syncMutation.isPending}
          onPress={() => syncMutation.mutate()}
          style={{ minWidth: 96, minHeight: 40 }}
        />
      </View>
      {syncMutation.isError ? (
        <Text style={styles.syncError}>
          {syncMutation.error instanceof ApiClientError
            ? syncMutation.error.message
            : 'Google Sheet synchronization failed'}
        </Text>
      ) : null}

      <Text style={styles.section}>Overview</Text>
      <View style={styles.grid}>
        <StatCard label="Total leads" value={stats.total} />
        <StatCard label="New" value={stats.new} />
        <StatCard label="Contacted" value={stats.contacted} />
        <StatCard label="Replied" value={stats.replied} />
        <StatCard label="Interested" value={stats.interested} />
        <StatCard label="Follow-ups due" value={stats.followUpsDue} />
        <StatCard label="Converted" value={stats.converted} />
      </View>

      <Text style={styles.section}>Follow-ups today</Text>
      {data.followUpsToday.length === 0 ? (
        <Text style={styles.emptyInline}>No follow-ups scheduled for today.</Text>
      ) : (
        data.followUpsToday.map((lead) => (
          <Pressable
            key={lead.id}
            style={styles.listItem}
            onPress={() => router.push(`/leads/${lead.id}`)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{lead.name}</Text>
              <Text style={styles.itemSub}>{lead.businessName || lead.phone || lead.email}</Text>
              {lead.followUpAt ? (
                <Text style={styles.itemMeta}>
                  {new Date(lead.followUpAt).toLocaleTimeString([], {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              ) : null}
            </View>
            <StatusBadge status={lead.status} />
          </Pressable>
        ))
      )}

      <Text style={styles.section}>Recent leads</Text>
      {data.recentLeads.map((lead) => (
        <Pressable
          key={lead.id}
          style={styles.listItem}
          onPress={() => router.push(`/leads/${lead.id}`)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{lead.name}</Text>
            <Text style={styles.itemSub}>{lead.businessName || '—'}</Text>
          </View>
          <StatusBadge status={lead.status} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  header: { gap: 4 },
  brand: { ...typography.brand, color: colors.brandDark, fontSize: 24 },
  hello: { ...typography.body, color: colors.textSecondary },
  offline: { ...typography.caption, color: colors.warning },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  syncError: { ...typography.caption, color: colors.danger },
  section: { ...typography.subtitle, color: colors.text, marginTop: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemTitle: { ...typography.subtitle, color: colors.text, fontSize: 15 },
  itemSub: { ...typography.caption, color: colors.textSecondary },
  itemMeta: { ...typography.small, color: colors.warning, marginTop: 2 },
  emptyInline: { ...typography.body, color: colors.textMuted },
});
