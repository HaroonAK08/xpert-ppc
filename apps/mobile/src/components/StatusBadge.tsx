import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LEAD_STATUS_LABELS, type CrmLeadStatus } from '@/types/crm';
import { colors, radius, spacing, typography } from '@/theme';

export function StatusBadge({ status }: { status: CrmLeadStatus }) {
  const color = colors.status[status] || colors.textMuted;
  return (
    <View
      style={[styles.badge, { backgroundColor: `${color}12` }]}
      accessibilityLabel={`Status ${LEAD_STATUS_LABELS[status]}`}
    >
      <Text style={[styles.text, { color }]}>{LEAD_STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.small,
  },
});
