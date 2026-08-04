import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme/tokens';

type StatusBannerProps = {
  positive: boolean;
  title: string;
  subtitle?: string;
};

export function StatusBanner({ positive, title, subtitle }: StatusBannerProps) {
  return (
    <View style={[styles.container, positive ? styles.positive : styles.neutral]}>
      <Ionicons
        name={positive ? 'checkmark-circle' : 'time-outline'}
        size={22}
        color={positive ? colors.success : colors.textSecondary}
      />
      <View style={styles.text}>
        <Text style={[styles.title, positive && styles.titlePositive]}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  positive: {
    backgroundColor: colors.successMuted,
  },
  neutral: {
    backgroundColor: colors.border,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.bodyBold,
  },
  titlePositive: {
    color: colors.success,
  },
  subtitle: {
    ...typography.caption,
  },
});
