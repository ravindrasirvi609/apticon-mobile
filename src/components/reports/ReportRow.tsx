import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import type { ReportItem } from '@/api/types';
import { colors, spacing, typography } from '@/theme/tokens';
import { formatDateTime } from '@/utils/formatDate';

type ReportRowProps = {
  item: ReportItem;
};

export function ReportRow({ item }: ReportRowProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.registration.fullName}
        </Text>
        <Text style={styles.code} numberOfLines={1}>
          {item.registration.registrationCode}
          {item.registration.institution ? ` · ${item.registration.institution}` : ''}
        </Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.time}>{formatDateTime(item.at)}</Text>
        <Text style={styles.by} numberOfLines={1}>
          {item.by}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.bodyBold,
  },
  code: {
    ...typography.caption,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 2,
  },
  time: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  by: {
    ...typography.caption,
    fontWeight: '700',
  },
});
