import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors, radius, shadows, spacing, typography } from '@/theme';

type Props = {
  label: string;
  value: number | string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  index?: number;
  onPress?: () => void;
};

export function StatCard({
  label,
  value,
  icon = 'stats-chart',
  color = colors.brand,
  index = 0,
  onPress,
}: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 45).duration(360).springify().damping(18)}
      style={styles.cardWrap}
    >
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [styles.card, pressed && onPress ? styles.cardPressed : null]}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={`${label}: ${value}`}
      >
        <View style={[styles.iconWrap, { backgroundColor: `${color}1A` }]}>
          <Ionicons name={icon} size={16} color={color} />
        </View>
        <Text style={styles.value}>{typeof value === 'number' ? value.toLocaleString() : value}</Text>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrap: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: 4,
    ...shadows.card,
  },
  cardPressed: { opacity: 0.85 },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  value: { ...typography.title, color: colors.brandDark, fontSize: 22 },
  label: { ...typography.caption, color: colors.textSecondary },
});
