import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { fetchLeads } from '@/api/leads';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { LeadCard } from '@/components/LeadCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterSheet, type LeadFilters } from '@/components/FilterSheet';
import { EmptyState, ErrorState, LoadingState } from '@/components/EmptyState';
import { ApiClientError } from '@/api/client';
import { colors, spacing, typography } from '@/theme';

export default function LeadsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [filters, setFilters] = useState<LeadFilters>({ sort: 'newest' });
  const [filterOpen, setFilterOpen] = useState(false);

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

  if (query.isLoading && !query.data) {
    return <LoadingState label="Loading leads…" />;
  }

  if (query.isError && !query.data) {
    return (
      <ErrorState
        title="Unable to load leads"
        message={query.error instanceof ApiClientError ? query.error.message : 'Please try again.'}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <View style={{ flex: 1 }}>
          <SearchBar value={search} onChangeText={setSearch} />
        </View>
        <Pressable
          onPress={() => setFilterOpen(true)}
          style={styles.filterBtn}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <Ionicons name="options-outline" size={20} color={colors.brandDark} />
        </Pressable>
      </View>

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
          <EmptyState
            title="No leads found"
            message="Try adjusting search or filters, or sync from Google Sheets."
          />
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
  toolbar: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.md,
    flexGrow: 1,
  },
});
