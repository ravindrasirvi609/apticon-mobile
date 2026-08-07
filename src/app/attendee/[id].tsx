import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import type { ApiError } from '@/api/client';
import type { ActionType } from '@/api/types';
import { InfoRow } from '@/components/attendee/InfoRow';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { ActionCard } from '@/components/ui/ActionCard';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterChip } from '@/components/ui/FilterChip';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusBanner } from '@/components/ui/StatusBanner';
import { useToast } from '@/components/ui/Toast';
import { useAttendeeById, useRecordAction } from '@/hooks/useAttendee';
import { colors, spacing, typography } from '@/theme/tokens';
import { formatDateTime } from '@/utils/formatDate';
import { STATUS_BADGE } from '@/utils/registrationStatus';
import { capitalize } from '@/utils/text';

const MEAL_DAYS = [1, 2, 3];

type PendingAction = {
  actionType: ActionType;
  day?: number;
  title: string;
  message: string;
};

export default function AttendeeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const { data, isPending, isError, error, refetch } = useAttendeeById(id);
  const recordAction = useRecordAction(id);

  const [mealDay, setMealDay] = useState(1);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

  const runAction = (action: PendingAction) => {
    recordAction.mutate(
      { actionType: action.actionType, day: action.day, device: Device.deviceName ?? undefined },
      {
        onSuccess: () => {
          setPendingAction(null);
          showToast(`${action.title} recorded`, 'success');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
        onError: (err) => {
          setPendingAction(null);
          const apiError = err as ApiError;
          showToast(apiError.message ?? 'Something went wrong', apiError.status === 409 ? 'info' : 'error');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        },
      },
    );
  };

  if (isPending) {
    return (
      <ScreenContainer edges={['top', 'bottom']}>
        <View style={styles.skeletonHeader}>
          <Skeleton width={96} height={96} radius={48} />
          <Skeleton width="60%" height={20} style={{ marginTop: spacing.md }} />
          <Skeleton width="40%" height={14} style={{ marginTop: spacing.sm }} />
        </View>
        <Skeleton height={160} radius={16} style={{ marginTop: spacing.lg }} />
      </ScreenContainer>
    );
  }

  if (isError || !data) {
    return (
      <ScreenContainer edges={['top', 'bottom']}>
        <ErrorState
          title={(error as ApiError)?.status === 404 ? 'Attendee not found' : 'Something went wrong'}
          message={(error as ApiError)?.message}
          onRetry={refetch}
        />
      </ScreenContainer>
    );
  }

  const { registration, status } = data;
  const breakfastToday = status.breakfast.find((entry) => entry.day === mealDay);
  const lunchToday = status.lunch.find((entry) => entry.day === mealDay);
  const dinnerToday = status.dinner.find((entry) => entry.day === mealDay);

  const isApproved = registration.status === 'approved';
  const actionDisabledReason = `Registration not approved (${STATUS_BADGE[registration.status].label.toLowerCase()})`;

  return (
    <ScreenContainer edges={['top', 'bottom']} padded={false}>
      <View style={styles.topBar}>
        <IconButton name="arrow-back" accessibilityLabel="Go back" onPress={() => router.back()} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Avatar uri={registration.photoUrl} name={registration.fullName} size={96} />
          <Text style={styles.name}>{registration.fullName}</Text>
          <View style={styles.badgeChip}>
            <Ionicons name="pricetag-outline" size={14} color={colors.primary} />
            <Text style={styles.badgeChipText}>Badge No. {registration.registrationCode}</Text>
          </View>
          <View style={styles.tagRow}>
            <Badge label={STATUS_BADGE[registration.status].label} variant={STATUS_BADGE[registration.status].variant} />
            <Badge label={capitalize(registration.category)} />
            {registration.institution ? <Badge label={registration.institution} variant="neutral" /> : null}
          </View>
        </View>

        <StatusBanner
          positive={!!status.checkIn}
          title={status.checkIn ? 'Checked in' : 'Not checked in yet'}
          subtitle={
            status.checkIn ? `${formatDateTime(status.checkIn.at)} · by ${status.checkIn.by}` : undefined
          }
        />

        <Card style={styles.infoCard}>
          <InfoRow icon="pricetag-outline" label="Reg. No" value={registration.registrationCode} />
          <InfoRow icon="business-outline" label="Company" value={registration.institution ?? '—'} />
          <InfoRow icon="mail-outline" label="Email" value={registration.email} />
          <InfoRow icon="call-outline" label="Phone" value={registration.phone} />
          <InfoRow icon="card-outline" label="Payment" value={capitalize(registration.paymentStatus)} />
        </Card>

        <Text style={styles.sectionTitle}>Actions</Text>

        {!isApproved && (
          <View style={styles.blockedNotice}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.warning} />
            <Text style={styles.blockedNoticeText}>
              Actions are disabled until this registration is approved.
              {registration.status === 'rejected' && registration.reviewNote ? `\n${registration.reviewNote}` : ''}
            </Text>
          </View>
        )}

        <ActionCard
          icon="log-in-outline"
          title="Check In"
          completedAt={status.checkIn?.at}
          completedBy={status.checkIn?.by}
          loading={recordAction.isPending && pendingAction?.actionType === 'check_in'}
          disabled={!isApproved}
          disabledReason={actionDisabledReason}
          onPress={() =>
            setPendingAction({
              actionType: 'check_in',
              title: 'Check In',
              message: 'Confirm check-in for this attendee?',
            })
          }
        />

        <ActionCard
          icon="card-outline"
          title="Issue ID Card"
          completedAt={status.idCard?.at}
          completedBy={status.idCard?.by}
          loading={recordAction.isPending && pendingAction?.actionType === 'id_card'}
          disabled={!isApproved}
          disabledReason={actionDisabledReason}
          onPress={() =>
            setPendingAction({
              actionType: 'id_card',
              title: 'Issue ID Card',
              message: 'Confirm ID card issuance for this attendee?',
            })
          }
        />

        <View style={styles.mealHeader}>
          <Text style={styles.mealTitle}>Meals</Text>
          <View style={styles.dayChips}>
            {MEAL_DAYS.map((day) => (
              <FilterChip key={day} label={`Day ${day}`} active={mealDay === day} onPress={() => setMealDay(day)} />
            ))}
          </View>
        </View>

        <ActionCard
          icon="cafe-outline"
          title={`Breakfast · Day ${mealDay}`}
          completedAt={breakfastToday?.at}
          completedBy={breakfastToday?.by}
          loading={recordAction.isPending && pendingAction?.actionType === 'breakfast'}
          disabled={!isApproved}
          disabledReason={actionDisabledReason}
          onPress={() =>
            setPendingAction({
              actionType: 'breakfast',
              day: mealDay,
              title: 'Breakfast',
              message: `Confirm breakfast for Day ${mealDay}?`,
            })
          }
        />

        <ActionCard
          icon="restaurant-outline"
          title={`Lunch · Day ${mealDay}`}
          completedAt={lunchToday?.at}
          completedBy={lunchToday?.by}
          loading={recordAction.isPending && pendingAction?.actionType === 'lunch'}
          disabled={!isApproved}
          disabledReason={actionDisabledReason}
          onPress={() =>
            setPendingAction({
              actionType: 'lunch',
              day: mealDay,
              title: 'Lunch',
              message: `Confirm lunch for Day ${mealDay}?`,
            })
          }
        />

        <ActionCard
          icon="moon-outline"
          title={`Dinner · Day ${mealDay}`}
          completedAt={dinnerToday?.at}
          completedBy={dinnerToday?.by}
          loading={recordAction.isPending && pendingAction?.actionType === 'dinner'}
          disabled={!isApproved}
          disabledReason={actionDisabledReason}
          onPress={() =>
            setPendingAction({
              actionType: 'dinner',
              day: mealDay,
              title: 'Dinner',
              message: `Confirm dinner for Day ${mealDay}?`,
            })
          }
        />

        <ActionCard
          icon="bag-handle-outline"
          title="Kit"
          completedAt={status.kit?.at}
          completedBy={status.kit?.by}
          loading={recordAction.isPending && pendingAction?.actionType === 'kit'}
          disabled={!isApproved}
          disabledReason={actionDisabledReason}
          onPress={() =>
            setPendingAction({ actionType: 'kit', title: 'Kit', message: 'Confirm kit distribution?' })
          }
        />

        <ActionCard
          icon="ribbon-outline"
          title="Certificate"
          completedAt={status.certificate?.at}
          completedBy={status.certificate?.by}
          loading={recordAction.isPending && pendingAction?.actionType === 'certificate'}
          disabled={!isApproved}
          disabledReason={actionDisabledReason}
          onPress={() =>
            setPendingAction({
              actionType: 'certificate',
              title: 'Certificate',
              message: 'Confirm certificate issuance?',
            })
          }
        />
      </ScrollView>

      <ConfirmDialog
        visible={!!pendingAction}
        title={pendingAction?.title ?? ''}
        message={pendingAction?.message}
        confirmLabel="Confirm"
        loading={recordAction.isPending}
        onConfirm={() => pendingAction && runAction(pendingAction)}
        onCancel={() => setPendingAction(null)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  profileHeader: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  name: {
    ...typography.headingLarge,
    textAlign: 'center',
  },
  badgeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryMuted,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeChipText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  tagRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  infoCard: {
    gap: 0,
  },
  sectionTitle: {
    ...typography.subheading,
    marginTop: spacing.sm,
  },
  blockedNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.warningMuted,
    borderRadius: 12,
    padding: spacing.md,
  },
  blockedNoticeText: {
    ...typography.caption,
    color: colors.warning,
    flex: 1,
  },
  mealHeader: {
    gap: spacing.sm,
  },
  mealTitle: {
    ...typography.subheading,
    marginTop: spacing.sm,
  },
  dayChips: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  skeletonHeader: {
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
});
