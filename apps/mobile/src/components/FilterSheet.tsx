import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { CRM_LEAD_STATUSES, LEAD_STATUS_LABELS, type CrmLeadStatus } from '@/types/crm';
import { Button } from './Button';
import { BottomSheet } from './BottomSheet';
import { colors, radius, spacing, typography } from '@/theme';

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
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>Filters</Text>
      <View style={{ gap: spacing.lg, paddingBottom: spacing.md }}>
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
      </View>
      <Button title="Apply" onPress={onClose} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text },
  section: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.brandSoft, borderColor: colors.brand },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextActive: { color: colors.brand, fontWeight: '600' },
});
