import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme/tokens';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'accent';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  return (
    <View style={[styles.base, variantStyles[variant]]}>
      <Text style={[styles.text, variantTextStyles[variant]]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  text: {
    ...typography.caption,
    fontWeight: '700',
  },
});

const variantStyles = StyleSheet.create({
  success: { backgroundColor: colors.successMuted },
  warning: { backgroundColor: colors.warningMuted },
  danger: { backgroundColor: colors.dangerMuted },
  neutral: { backgroundColor: colors.border },
  accent: { backgroundColor: colors.accentMuted },
});

const variantTextStyles = StyleSheet.create({
  success: { color: colors.success },
  warning: { color: colors.warning },
  danger: { color: colors.danger },
  neutral: { color: colors.textSecondary },
  accent: { color: colors.text },
});
