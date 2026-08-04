import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { colors, radii, spacing, typography } from '@/theme/tokens';
import { formatDateTime } from '@/utils/formatDate';

type ActionCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  completedAt?: string;
  completedBy?: string;
  loading?: boolean;
  onPress: () => void;
};

export function ActionCard({ icon, title, completedAt, completedBy, loading, onPress }: ActionCardProps) {
  const isCompleted = !!completedAt;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, isCompleted && styles.iconWrapCompleted]}>
          <Ionicons name={icon} size={20} color={isCompleted ? colors.success : colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{title}</Text>
          {isCompleted ? (
            <Text style={styles.meta} numberOfLines={1}>
              {formatDateTime(completedAt as string)}
              {completedBy ? ` · ${completedBy}` : ''}
            </Text>
          ) : (
            <Text style={styles.meta}>Not recorded yet</Text>
          )}
        </View>
        {isCompleted && <Badge label="Done" variant="success" />}
      </View>
      {!isCompleted && (
        <Button title="Mark done" variant="primary" loading={loading} onPress={onPress} style={styles.button} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapCompleted: {
    backgroundColor: colors.successMuted,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.subheading,
  },
  meta: {
    ...typography.caption,
  },
  button: {
    marginTop: 0,
  },
});
