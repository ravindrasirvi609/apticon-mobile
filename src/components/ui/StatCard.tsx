import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { colors, radii, spacing, typography } from '@/theme/tokens';

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  count: number;
  label: string;
  tint?: string;
};

export function StatCard({ icon, count, label, tint = colors.primary }: StatCardProps) {
  return (
    <Card style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${tint}1A` }]}>
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '48%',
    flexGrow: 1,
    gap: spacing.xs,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  count: {
    ...typography.headingLarge,
  },
  label: {
    ...typography.caption,
  },
});
