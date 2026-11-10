import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { fetchLeads } from '@/api/leads';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { LeadCard } from '@/components/LeadCard';
import { SearchBar } from '@/components/SearchBar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { FilterSheet, type LeadFilters } from '@/components/FilterSheet';
import { EmptyState, ErrorState, LoadingState } from '@/components/EmptyState';
import { LEAD_STATUS_LABELS, type CrmLeadStatus } from '@/types/crm';
import { ApiClientError } from '@/api/client';
import { colors, radius, spacing, typography } from '@/theme';

const FOLLOW_UP_LABELS: Record<string, string> = {
  due: 'Follow-up due',
  upcoming: 'Follow-up upcoming',
  set: 'Follow-up scheduled',
};

function firstParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

export default function LeadsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    view?: string | string[];
    status?: string | string[];
    follow_up?: string | string[];
  }>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'newest' });
  const [filterOpen, setFilterOpen] = useState(false);

  // Dashboard stat cards deep-link here with view=all (+ optional status / follow_up).
  useEffect(() => {
    const view = firstParam(params.view);
    if (view !== 'all') return;

    const status = firstParam(params.status) as CrmLeadStatus | '';
    const followUp = firstParam(params.follow_up);
    setSearch('');
    setFilters({
      sort: 'newest',
      status: status || '',
      follow_up: followUp === 'due' || followUp === 'upcoming' || followUp === 'set' ? followUp : '',
      replied: '',
    });
  }, [params.view, params.status, params.follow_up]);

  const queryKey = useMemo(
    () => ['leads', debouncedSearch, filters],
    [debouncedSearch, filters]
  );

  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await fetchLeads({
        page: pageParam,
        page_size: 30,
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
        replied: filters.replied || undefined,
        follow_up: filters.follow_up || undefined,
        sort: filters.sort || 'newest',
      });
      return res;
    },
    getNextPageParam: (last) => {
      const { page, totalPages } = last.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const leads = query.data?.pages.flatMap((p) => p.data) ?? [];
  const total = query.data?.pages[0]?.meta.total;

  const activeFilters: Array<{ key: keyof LeadFilters; label: string }> = [];
  if (filters.status) activeFilters.push({ key: 'status', label: LEAD_STATUS_LABELS[filters.status] });
  if (filters.replied) activeFilters.push({ key: 'replied', label: filters.replied === 'true' ? 'Replied' : 'Not replied' });
  if (filters.follow_up) activeFilters.push({ key: 'follow_up', label: FOLLOW_UP_LABELS[filters.follow_up] });
  const activeCount = activeFilters.length;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Leads"
        subtitle={typeof total === 'number' ? `${total.toLocaleString()} total leads` : undefined}
        right={
          <Pressable
            onPress={() => router.push('/leads/new')}
            style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Add lead"
          >
            <Ionicons name="add" size={22} color={colors.white} />
          </Pressable>
        }
      >
        <View style={styles.toolbar}>
          <View style={{ flex: 1 }}>
            <SearchBar value={search} onChangeText={setSearch} />
          </View>
          <Pressable
            onPress={() => setFilterOpen(true)}
            style={({ pressed }) => [styles.filterBtn, activeCount > 0 && styles.filterBtnActive, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Open filters"
            accessibilityState={{ selected: activeCount > 0 }}
          >
            <Ionicons name="options-outline" size={20} color={activeCount > 0 ? colors.brand : colors.textSecondary} />
            {activeCount > 0 ? (
              <View style={styles.filterCountDot}>
                <Text style={styles.filterCountText}>{activeCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </ScreenHeader>

      {activeCount > 0 ? (
        <View style={styles.chipsRow}>
          {activeFilters.map((f) => (
            <Pressable
              key={f.key}
              style={styles.chip}
              onPress={() => setFilters((prev) => ({ ...prev, [f.key]: '' }))}
            >
              <Text style={styles.chipText}>{f.label}</Text>
              <Ionicons name="close" size={14} color={colors.brandDark} />
            </Pressable>
          ))}
          <Pressable style={styles.clearAll} onPress={() => setFilters({ sort: filters.sort })}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <LeadCard lead={item} onPress={() => router.push(`/leads/${item.id}`)} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={query.isRefetching}
            onRefresh={() => void query.refetch()}
            tintColor={colors.brand}
            colors={[colors.brand]}
          />
        }
        onEndReached={() => {
          if (query.hasNextPage && !query.isFetchingNextPage) {
            void query.fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          query.isLoading ? (
            <LoadingState label="Loading leads…" />
          ) : query.isError ? (
            <ErrorState
              title="Unable to load leads"
              message={query.error instanceof ApiClientError ? query.error.message : 'Please try again.'}
              onRetry={() => void query.refetch()}
            />
          ) : (
            <EmptyState
              title="No leads found"
              message="Try adjusting search or filters, or sync from Google Sheets."
            />
          )
        }
        ListFooterComponent={
          query.isFetchingNextPage ? (
            <ActivityIndicator style={{ marginVertical: spacing.lg }} color={colors.brand} />
          ) : null
        }
      />

      <FilterSheet
        visible={filterOpen}
        value={filters}
        onChange={setFilters}
        onClose={() => setFilterOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  toolbar: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: colors.brandSoft, borderColor: colors.brand },
  filterCountDot: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 4,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  filterCountText: { ...typography.small, color: colors.white, fontSize: 11, lineHeight: 14 },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.screen,
    paddingBottom: spacing.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: 44,
    backgroundColor: colors.brandSoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  chipText: { ...typography.caption, color: colors.brand },
  clearAll: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.sm },
  clearAllText: { ...typography.caption, color: colors.textSecondary },
  list: { paddingHorizontal: spacing.screen, paddingBottom: spacing.xl, gap: spacing.md, flexGrow: 1 },
});
