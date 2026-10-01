import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, gradients, motion, radius, shadows, spacing, typography } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

const variantStyles: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.brand, text: colors.white },
  secondary: { bg: colors.brandSoft, text: colors.brandDark },
  ghost: { bg: 'transparent', text: colors.brand, border: colors.border },
  danger: { bg: colors.danger, text: colors.white },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = loading ? (
    <ActivityIndicator color={v.text} />
  ) : (
    <Text style={[styles.label, { color: v.text }]}>{title}</Text>
  );

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      onPressIn={() => {
        scale.value = withSpring(0.96, motion.press);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, motion.release);
      }}
      onPress={(e) => {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      }}
      style={[
        animatedStyle,
        { opacity: disabled || loading ? 0.55 : 1 },
        style,
      ]}
      {...rest}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={gradients.brandButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, shadows.card]}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.base,
            {
              backgroundColor: v.bg,
              borderColor: v.border || 'transparent',
              borderWidth: v.border ? 1 : 0,
            },
          ]}
        >
          {content}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    ...typography.subtitle,
    fontSize: 15,
  },
});
