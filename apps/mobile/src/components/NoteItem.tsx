import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LeadNote } from '@/types/crm';
import { colors, radius, spacing, typography } from '@/theme';

export function NoteItem({ note }: { note: LeadNote }) {
  return (
    <View style={styles.item}>
      <Text style={styles.meta}>
        {new Date(note.createdAt).toLocaleString([], {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })}{' '}
        · {note.authorName}
      </Text>
      <Text style={styles.text}>{note.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  meta: { ...typography.small, color: colors.textMuted },
  text: { ...typography.body, color: colors.text },
});
