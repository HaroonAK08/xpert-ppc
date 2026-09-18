import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LEAD_STATUS_LABELS, type CrmLeadStatus } from '@/types/crm';
import { colors, radius, spacing, typography } from '@/theme';

export function StatusBadge({ status }: { status: CrmLeadStatus }) {
  const color = colors.status[status] || colors.textMuted;
  return (
    <View
      style={[styles.badge, { backgroundColor: `${color}22`, borderColor: color }]}
      accessibilityLabel={`Status ${LEAD_STATUS_LABELS[status]}`}
    >
      <Text style={[styles.text, { color }]}>{LEAD_STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.small,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
