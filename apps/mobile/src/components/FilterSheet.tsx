import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CRM_LEAD_STATUSES, LEAD_STATUS_LABELS, type CrmLeadStatus } from '@/types/crm';
import { Button } from './Button';
import { colors, radius, shadows, spacing, typography } from '@/theme';

export type LeadFilters = {
  status?: CrmLeadStatus | '';
  replied?: '' | 'true' | 'false';
  follow_up?: '' | 'due' | 'upcoming' | 'set';
  sort?: 'newest' | 'oldest' | 'updated' | 'follow_up';
};

type Props = {
  visible: boolean;
  value: LeadFilters;
  onChange: (next: LeadFilters) => void;
  onClose: () => void;
};

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export function FilterSheet({ visible, value, onChange, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Filters</Text>
          <ScrollView contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xl }}>
            <View>
              <Text style={styles.section}>Status</Text>
              <View style={styles.row}>
                <Chip
                  label="All"
                  active={!value.status}
                  onPress={() => onChange({ ...value, status: '' })}
                />
                {CRM_LEAD_STATUSES.map((s) => (
                  <Chip
                    key={s}
                    label={LEAD_STATUS_LABELS[s]}
                    active={value.status === s}
                    onPress={() => onChange({ ...value, status: s })}
                  />
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.section}>Replied</Text>
              <View style={styles.row}>
                {(
                  [
                    ['', 'All'],
                    ['true', 'Replied'],
                    ['false', 'Not replied'],
                  ] as const
                ).map(([k, label]) => (
                  <Chip
                    key={label}
                    label={label}
                    active={(value.replied || '') === k}
                    onPress={() => onChange({ ...value, replied: k })}
                  />
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.section}>Follow-up</Text>
              <View style={styles.row}>
                {(
                  [
                    ['', 'Any'],
                    ['due', 'Due'],
                    ['upcoming', 'Upcoming'],
                    ['set', 'Scheduled'],
                  ] as const
                ).map(([k, label]) => (
                  <Chip
                    key={label}
                    label={label}
                    active={(value.follow_up || '') === k}
                    onPress={() => onChange({ ...value, follow_up: k })}
                  />
                ))}
              </View>
            </View>

            <View>
              <Text style={styles.section}>Sort</Text>
              <View style={styles.row}>
                {(
                  [
                    ['newest', 'Newest'],
                    ['oldest', 'Oldest'],
                    ['updated', 'Recently updated'],
                    ['follow_up', 'Follow-up date'],
                  ] as const
                ).map(([k, label]) => (
                  <Chip
                    key={label}
                    label={label}
                    active={(value.sort || 'newest') === k}
                    onPress={() => onChange({ ...value, sort: k })}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
          <Button title="Apply" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  sheet: {
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
    ...shadows.floating,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  title: { ...typography.title, color: colors.text },
  section: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.brand },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextActive: { color: colors.white, fontWeight: '700' },
});
