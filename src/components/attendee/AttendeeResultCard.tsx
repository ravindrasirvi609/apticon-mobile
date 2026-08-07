import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import type { AttendeeSearchItem } from '@/api/types';
import { colors, spacing, typography } from '@/theme/tokens';
import { STATUS_BADGE } from '@/utils/registrationStatus';
import { capitalize } from '@/utils/text';

type AttendeeResultCardProps = {
  attendee: AttendeeSearchItem;
  onPress: () => void;
};

export function AttendeeResultCard({ attendee, onPress }: AttendeeResultCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Card style={styles.card}>
        <Avatar uri={attendee.photoUrl} name={attendee.fullName} size={52} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {attendee.fullName}
          </Text>
          <Text style={styles.code} numberOfLines={1}>
            {attendee.registrationCode}
          </Text>
          {attendee.institution ? (
            <Text style={styles.institution} numberOfLines={1}>
              {attendee.institution}
            </Text>
          ) : null}
          {(attendee.checkedInAt || attendee.kitIssuedAt || attendee.status !== 'approved') && (
            <View style={styles.statusRow}>
              {attendee.status !== 'approved' ? (
                <Badge label={STATUS_BADGE[attendee.status].label} variant={STATUS_BADGE[attendee.status].variant} />
              ) : null}
              {attendee.checkedInAt ? <Badge label="Checked in" variant="success" /> : null}
              {attendee.kitIssuedAt ? <Badge label="Kit issued" variant="accent" /> : null}
            </View>
          )}
        </View>
        <Badge label={capitalize(attendee.category)} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 2,
  },
  name: {
    ...typography.subheading,
  },
  code: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  institution: {
    ...typography.caption,
  },
});
