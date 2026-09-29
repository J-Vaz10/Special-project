import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/colors';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  testID?: string;
}

export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled,
  loading,
  icon,
  fullWidth = true,
  testID,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant].container,
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles[variant].text.color as string} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text style={[styles.label, variantStyles[variant].text]}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
});

const variantStyles: Record<Variant, { container: object; text: { color: string } }> = {
  primary: {
    container: { backgroundColor: colors.primary },
    text: { color: colors.white },
  },
  secondary: {
    container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
    text: { color: colors.navy },
  },
  danger: {
    container: { backgroundColor: colors.danger },
    text: { color: colors.white },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: colors.primary },
  },
};
