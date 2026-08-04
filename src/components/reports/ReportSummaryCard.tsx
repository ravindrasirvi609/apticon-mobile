import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { ReportType } from '@/api/types';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useReport } from '@/hooks/useReports';
import { colors, radii, spacing, typography } from '@/theme/tokens';
import { isToday } from '@/utils/formatDate';

type ReportSummaryCardProps = {
  type: ReportType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  day?: number;
  active: boolean;
  onPress: () => void;
};

export function ReportSummaryCard({ type, label, icon, day, active, onPress }: ReportSummaryCardProps) {
  const { data, isPending } = useReport(type, { day, limit: 100 });
  const todayCount = data ? data.items.filter((item) => isToday(item.at)).length : 0;

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.wrap}>
      <Card style={[styles.card, active && styles.cardActive]}>
        <View style={styles.iconWrap}>
          <Ionicons name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        {isPending ? (
          <Skeleton height={26} width="50%" />
        ) : (
          <>
            <Text style={styles.total}>{data?.total ?? 0}</Text>
            <Text style={styles.today}>Today: {todayCount}</Text>
          </>
        )}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  card: {
    gap: spacing.xs,
  },
  cardActive: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.bodyBold,
  },
  total: {
    ...typography.headingLarge,
  },
  today: {
    ...typography.caption,
  },
});
