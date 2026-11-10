import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors, radius, spacing, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

const variantStyles: Record<Variant, { bg: string; text: string; border: string }> = {
  primary: { bg: colors.brand, text: colors.white, border: colors.brand },
  secondary: { bg: colors.brandSoft, text: colors.brand, border: colors.brandSoft },
  ghost: { bg: colors.surface, text: colors.text, border: colors.border },
  danger: { bg: colors.danger, text: colors.white, border: colors.danger },
};

export function Button({
  title,
  loading,
  variant = 'primary',
  style,
  disabled,
  onPress,
  ...rest
}: Props) {
  const v = variantStyles[variant];
  const unavailable = Boolean(disabled || loading);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: unavailable, busy: Boolean(loading) }}
      disabled={unavailable}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: v.bg, borderColor: v.border, opacity: unavailable ? 0.5 : pressed ? 0.8 : 1 },
        style,
      ]}
      {...rest}
    >
      {loading ? <ActivityIndicator color={v.text} /> : (
        <Text style={[styles.label, { color: v.text }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  label: { ...typography.subtitle, fontSize: 15, textAlign: 'center' },
});
