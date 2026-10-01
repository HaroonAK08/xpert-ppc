import React, { useEffect, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { fetchDashboard } from '@/api/dashboard';
import { syncSheet } from '@/api/googleSheets';
import { useAuthStore } from '@/store/auth';
import { useOfflineStore } from '@/store/offline';
import { StatCard } from '@/components/StatCard';
import { SyncIndicator } from '@/components/SyncIndicator';
import { GradientHeader } from '@/components/GradientHeader';
import { LoadingState, ErrorState } from '@/components/EmptyState';
import { StatusBadge } from '@/components/StatusBadge';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import { ApiClientError } from '@/api/client';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function initials(name?: string | null) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] || '').concat(parts.length > 1 ? parts[parts.length - 1]?.[0] || '' : '').toUpperCase();
}

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isOnline = useOfflineStore((s) => s.isOnline);
  const qc = useQueryClient();
  const [showSyncError, setShowSyncError] = useState(false);

  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await fetchDashboard()).data,
  });

  const syncMutation = useMutation({
    mutationFn: syncSheet,
    onSuccess: () => {
      setShowSyncError(false);
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
      void qc.invalidateQueries({ queryKey: ['leads'] });
      void qc.invalidateQueries({ queryKey: ['sheets'] });
    },
    onError: () => {
      // Background auto-sync failures stay quiet; manual Sync shows the banner.
    },
  });

  useEffect(() => {
    // Pull the latest sheet rows the moment the app opens, and again each
    // time it's brought back to the foreground — not just when someone
    // taps "Sync" manually.
    setShowSyncError(false);
    syncMutation.mutate();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setShowSyncError(false);
        syncMutation.mutate();
      }
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

  const statItems: Array<{
    label: string;
    value: number;
    icon: React.ComponentProps<typeof StatCard>['icon'];
    color: string;
    href?: { pathname: '/(tabs)/leads'; params?: Record<string, string> };
  }> = [
    {
      label: 'Total leads',
      value: stats.total,
      icon: 'people',
      color: colors.brand,
      href: { pathname: '/(tabs)/leads', params: { view: 'all' } },
    },
    {
      label: 'Contacted',
      value: stats.contacted,
      icon: 'call',
      color: colors.status.contacted,
      href: { pathname: '/(tabs)/leads', params: { view: 'all', status: 'contacted' } },
    },
    {
      label: 'Replied',
      value: stats.replied,
      icon: 'chatbubble-ellipses',
      color: colors.status.replied,
      href: { pathname: '/(tabs)/leads', params: { view: 'all', status: 'replied' } },
    },
    {
      label: 'Interested',
      value: stats.interested,
      icon: 'heart',
      color: colors.status.interested,
      href: { pathname: '/(tabs)/leads', params: { view: 'all', status: 'interested' } },
    },
    {
      label: 'Follow-ups due',
      value: stats.followUpsDue,
      icon: 'alarm',
      color: colors.warning,
      href: { pathname: '/(tabs)/leads', params: { view: 'all', follow_up: 'due' } },
    },
    {
      label: 'Converted',
      value: stats.converted,
      icon: 'trophy',
      color: colors.success,
      href: { pathname: '/(tabs)/leads', params: { view: 'all', status: 'converted' } },
    },
  ];

  return (
    <View style={styles.screen}>
      <GradientHeader
        eyebrow={greeting()}
        title={user?.name?.split(' ')[0] || 'Welcome back'}
        right={
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user?.name)}</Text>
          </View>
        }
      >
        {!isOnline ? (
          <View style={styles.offlineBadge}>
            <Ionicons name="cloud-offline-outline" size={14} color={colors.white} />
            <Text style={styles.offline}>Offline — showing cached data</Text>
          </View>
        ) : null}
      </GradientHeader>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={query.isFetching}
            onRefresh={() => void query.refetch()}
            tintColor={colors.brand}
            colors={[colors.brand]}
          />
        }
      >
        <Animated.View entering={FadeInDown.duration(360).springify().damping(18)} style={styles.syncCard}>
          <View style={styles.syncRow}>
            <View style={styles.syncCopy}>
              <Text style={styles.syncTitle}>Google Sheets sync</Text>
              <SyncIndicator
                state={syncMutation.isPending ? 'syncing' : stats.lastSyncedAt ? 'success' : 'idle'}
                lastSyncedAt={stats.lastSyncedAt}
              />
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sync Google Sheets"
              disabled={syncMutation.isPending}
              onPress={() => {
                setShowSyncError(true);
                syncMutation.mutate();
              }}
              style={({ pressed }) => [
                styles.syncBtn,
                pressed ? styles.syncBtnPressed : null,
                syncMutation.isPending ? styles.syncBtnDisabled : null,
              ]}
            >
              {syncMutation.isPending ? (
                <Text style={styles.syncBtnText}>…</Text>
              ) : (
                <>
                  <Ionicons name="sync-outline" size={16} color={colors.brandDark} />
                  <Text style={styles.syncBtnText}>Sync</Text>
                </>
              )}
            </Pressable>
          </View>
          {syncMutation.isError && showSyncError ? (
            <Text style={styles.syncError}>
              {syncMutation.error instanceof ApiClientError
                ? syncMutation.error.message
                : 'Google Sheet synchronization failed'}
            </Text>
          ) : null}
        </Animated.View>

        <SectionTitle label="Overview" />
        <View style={styles.grid}>
          {statItems.map((s, i) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              icon={s.icon}
              color={s.color}
              index={i}
              onPress={s.href ? () => router.push(s.href!) : undefined}
            />
          ))}
        </View>

        <SectionTitle label="Follow-ups today" count={data.followUpsToday.length} />
        {data.followUpsToday.length === 0 ? (
          <Text style={styles.emptyInline}>No follow-ups scheduled for today.</Text>
        ) : (
          data.followUpsToday.map((lead, i) => (
            <LeadRow
              key={lead.id}
              index={i}
              title={lead.name}
              subtitle={lead.businessName || lead.phone || lead.email}
              meta={
                lead.followUpAt
                  ? new Date(lead.followUpAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
                  : undefined
              }
              status={lead.status}
              onPress={() => router.push(`/leads/${lead.id}`)}
            />
          ))
        )}

        <SectionTitle label="Recent leads" />
        {data.recentLeads.map((lead, i) => (
          <LeadRow
            key={lead.id}
            index={i}
            title={lead.name}
            subtitle={lead.businessName || '—'}
            status={lead.status}
            onPress={() => router.push(`/leads/${lead.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function SectionTitle({ label, count }: { label: string; count?: number }) {
  return (
    <View style={styles.sectionRow}>
      <View style={styles.sectionBar} />
      <Text style={styles.section}>{label}</Text>
      {typeof count === 'number' ? (
        <View style={styles.countPill}>
          <Text style={styles.countPillText}>{count}</Text>
        </View>
      ) : null}
    </View>
  );
}

function LeadRow({
  index,
  title,
  subtitle,
  meta,
  status,
  onPress,
}: {
  index: number;
  title: string;
  subtitle?: string | null;
  meta?: string;
  status: Parameters<typeof StatusBadge>[0]['status'];
  onPress: () => void;
}) {
  const color = colors.status[status] || colors.textMuted;
  return (
    <Animated.View entering={FadeInDown.delay(index * 40).duration(320).springify().damping(18)}>
      <Pressable style={styles.listItem} onPress={onPress}>
        <View style={[styles.rowAvatar, { backgroundColor: `${color}1A` }]}>
          <Text style={[styles.rowAvatarText, { color }]}>{initials(title)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemTitle}>{title}</Text>
          {subtitle ? <Text style={styles.itemSub}>{subtitle}</Text> : null}
          {meta ? <Text style={styles.itemMeta}>{meta}</Text> : null}
        </View>
        <StatusBadge status={status} />
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: { padding: spacing.lg, paddingTop: 0, marginTop: -spacing.xl, gap: spacing.md, paddingBottom: spacing.xxl },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...typography.subtitle, color: colors.white },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(217, 119, 6, 0.3)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  offline: { ...typography.caption, color: colors.white },
  syncCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.floating,
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  syncCopy: { flex: 1, minWidth: 0, paddingTop: 2, gap: 4 },
  syncTitle: { ...typography.subtitle, color: colors.text, fontSize: 15 },
  syncBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.brandSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  syncBtnPressed: { opacity: 0.85 },
  syncBtnDisabled: { opacity: 0.55 },
  syncBtnText: { ...typography.caption, color: colors.brandDark, fontWeight: '700' },
  syncError: { ...typography.caption, color: colors.danger },
  sectionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  sectionBar: { width: 4, height: 16, borderRadius: 2, backgroundColor: colors.brand },
  section: { ...typography.subtitle, color: colors.text },
  countPill: {
    backgroundColor: colors.brandSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
  },
  countPillText: { ...typography.small, color: colors.brandDark, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.xs,
  },
  rowAvatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowAvatarText: { ...typography.caption, fontWeight: '700' },
  itemTitle: { ...typography.subtitle, color: colors.text, fontSize: 15 },
  itemSub: { ...typography.caption, color: colors.textSecondary },
  itemMeta: { ...typography.small, color: colors.warning, marginTop: 2 },
  emptyInline: { ...typography.body, color: colors.textMuted },
});
