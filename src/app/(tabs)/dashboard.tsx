import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/ui/Avatar';
import { ErrorState } from '@/components/ui/ErrorState';
import { QuickAction } from '@/components/ui/QuickAction';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatCard } from '@/components/ui/StatCard';
import type { ApiError } from '@/api/client';
import { useDashboardStats } from '@/hooks/useDashboard';
import { useAuthStore } from '@/store/authStore';
import { colors, spacing, typography } from '@/theme/tokens';

const ROLE_LABEL: Record<string, string> = {
  checkin_staff: 'Registration Desk',
  super_admin: 'Super Admin',
};

function useGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function sumDays(byDay: Record<string, number>) {
  return Object.values(byDay).reduce((total, count) => total + count, 0);
}

export default function DashboardScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data, isPending, isError, error, refetch, isRefetching } = useDashboardStats();

  const greeting = useGreeting();
  const roleLabel = user ? ROLE_LABEL[user.role] ?? user.role : '';

  return (
    <ScreenContainer padded={false}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Avatar name={user?.name ?? ''} size={52} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              {greeting}, {user?.name?.split(' ')[0] ?? 'there'}
            </Text>
            <Text style={styles.role}>{roleLabel}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>

        {isError ? (
          <ErrorState message={(error as ApiError)?.message} onRetry={refetch} />
        ) : isPending ? (
          <View style={styles.grid}>
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} height={92} radius={16} style={styles.skeletonCard} />
            ))}
          </View>
        ) : (
          <View style={styles.grid}>
            <StatCard icon="people-outline" count={data?.totalRegistered ?? 0} label="Total Registered" />
            <StatCard icon="checkmark-circle-outline" count={data?.checkedIn ?? 0} label="Checked In" tint={colors.success} />
            <StatCard icon="card-outline" count={data?.idCardIssued ?? 0} label="ID Cards" />
            <StatCard
              icon="cafe-outline"
              count={sumDays(data?.breakfast ?? {})}
              label="Breakfast"
              tint={colors.warning}
            />
            <StatCard icon="restaurant-outline" count={sumDays(data?.lunch ?? {})} label="Lunch" tint={colors.warning} />
            <StatCard icon="moon-outline" count={sumDays(data?.dinner ?? {})} label="Dinner" tint={colors.warning} />
            <StatCard icon="bag-handle-outline" count={data?.kitDistributed ?? 0} label="Kit" />
            <StatCard
              icon="ribbon-outline"
              count={data?.certificatesDistributed ?? 0}
              label="Certificate"
              tint={colors.success}
            />
          </View>
        )}
        {isRefetching && !isPending && <Text style={styles.refreshHint}>Refreshing…</Text>}

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <QuickAction icon="qr-code-outline" label="Scan QR" onPress={() => router.push('/(tabs)/scanner')} />
          <QuickAction icon="search-outline" label="Search" onPress={() => router.push('/(tabs)/search')} />
          <QuickAction icon="bar-chart-outline" label="Reports" onPress={() => router.push('/(tabs)/reports')} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  headerText: {
    gap: 2,
  },
  greeting: {
    ...typography.headingLarge,
  },
  role: {
    ...typography.body,
    color: colors.textSecondary,
  },
  sectionTitle: {
    ...typography.subheading,
    marginTop: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  skeletonCard: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  refreshHint: {
    ...typography.caption,
    alignSelf: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
