import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { CrmLead } from '@/types/crm';
import { StatusBadge } from './StatusBadge';
import { colors, radius, shadows, spacing, typography } from '@/theme';

function formatFollowUp(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (sameDay(d, today)) return `Today, ${time}`;
  if (sameDay(d, tomorrow)) return `Tomorrow, ${time}`;
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

type Props = {
  lead: CrmLead;
  onPress: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function LeadCardComponent({ lead, onPress }: Props) {
  const followUp = formatFollowUp(lead.followUpAt);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.duration(280).springify().damping(18)}>
      <AnimatedPressable
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 16, stiffness: 300 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 12, stiffness: 220 });
        }}
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={[styles.card, animatedStyle]}
        accessibilityRole="button"
        accessibilityLabel={`Lead ${lead.name}`}
      >
        <View style={styles.top}>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{lead.name}</Text>
            {lead.businessName ? (
              <Text style={styles.business}>{lead.businessName}</Text>
            ) : null}
          </View>
          <StatusBadge status={lead.status} />
        </View>

        <View style={styles.meta}>
          {lead.phone ? (
            <Text style={styles.metaText}>{lead.phone}</Text>
          ) : null}
          {lead.email && !lead.email.includes('@placeholder') && !lead.email.includes('@unknown') ? (
            <Text style={styles.metaText}>{lead.email}</Text>
          ) : null}
        </View>

        <View style={styles.footer}>
          {followUp ? (
            <Text style={styles.followUp}>Follow-up: {followUp}</Text>
          ) : (
            <Text style={styles.followUpMuted}>No follow-up</Text>
          )}
          {lead.replied ? (
            <View style={styles.replied}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.repliedText}>Replied</Text>
            </View>
          ) : null}
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export const LeadCard = memo(LeadCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    ...shadows.card,
  },
  top: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  name: { ...typography.subtitle, color: colors.text },
  business: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  meta: { gap: 2 },
  metaText: { ...typography.body, color: colors.textSecondary, fontSize: 14 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  followUp: { ...typography.caption, color: colors.warning },
  followUpMuted: { ...typography.caption, color: colors.textMuted },
  replied: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  repliedText: { ...typography.caption, color: colors.success },
});
