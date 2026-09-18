import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <View style={styles.card} accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.value}>{typeof value === 'number' ? value.toLocaleString() : value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  value: { ...typography.title, color: colors.brandDark, fontSize: 20 },
  label: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
