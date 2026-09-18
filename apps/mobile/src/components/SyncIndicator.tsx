import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '@/theme';

export function SyncIndicator({
  state,
  lastSyncedAt,
}: {
  state: string;
  lastSyncedAt?: string | null;
}) {
  const label =
    state === 'syncing'
      ? 'Syncing…'
      : state === 'failed'
        ? 'Sync failed'
        : state === 'success'
          ? 'Synced'
          : 'Idle';

  return (
    <View style={styles.wrap} accessibilityLabel={`Sync status ${label}`}>
      <View
        style={[
          styles.dot,
          {
            backgroundColor:
              state === 'failed'
                ? colors.danger
                : state === 'syncing'
                  ? colors.warning
                  : colors.success,
          },
        ]}
      />
      <Text style={styles.text}>
        {label}
        {lastSyncedAt
          ? ` · ${new Date(lastSyncedAt).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}`
          : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { ...typography.caption, color: colors.textSecondary },
});
