import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import type { ApiError } from '@/api/client';
import type { ReportType } from '@/api/types';
import { ReportRow } from '@/components/reports/ReportRow';
import { ReportSummaryCard } from '@/components/reports/ReportSummaryCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterChip } from '@/components/ui/FilterChip';
import { IconButton } from '@/components/ui/IconButton';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { useReport } from '@/hooks/useReports';
import { colors, spacing, typography } from '@/theme/tokens';
import { exportCsv } from '@/utils/csvExport';
import { isToday } from '@/utils/formatDate';

const MEAL_DAYS = [1, 2, 3];

const REPORT_DEFS: { type: ReportType; label: string; icon: keyof typeof Ionicons.glyphMap; dayScoped: boolean }[] = [
  { type: 'checked-in', label: 'Check In', icon: 'checkmark-circle-outline', dayScoped: false },
  { type: 'id-card', label: 'ID Card', icon: 'card-outline', dayScoped: false },
  { type: 'breakfast', label: 'Breakfast', icon: 'cafe-outline', dayScoped: true },
  { type: 'lunch', label: 'Lunch', icon: 'restaurant-outline', dayScoped: true },
  { type: 'dinner', label: 'Dinner', icon: 'moon-outline', dayScoped: true },
  { type: 'kit', label: 'Kit', icon: 'bag-handle-outline', dayScoped: false },
  { type: 'certificate', label: 'Certificate', icon: 'ribbon-outline', dayScoped: false },
];

export default function ReportsScreen() {
  const { showToast } = useToast();
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [day, setDay] = useState(1);

  const selectedDef = REPORT_DEFS.find((def) => def.type === selectedType);

  const { data, isPending, isError, error, refetch } = useReport(
    selectedType ?? 'checked-in',
    { day: selectedDef?.dayScoped ? day : undefined, limit: 100 },
    !!selectedType,
  );

  const todayCount = data ? data.items.filter((item) => isToday(item.at)).length : 0;

  const handleExport = async () => {
    if (!data || !selectedDef) return;
    const rows = [
      ['Name', 'Registration Code', 'Email', 'Phone', 'Institution', 'Day', 'Device', 'Recorded At', 'Recorded By'],
      ...data.items.map((item) => [
        item.registration.fullName,
        item.registration.registrationCode,
        item.registration.email,
        item.registration.phone,
        item.registration.institution ?? '',
        String(item.day ?? ''),
        item.device ?? '',
        item.at,
        item.by,
      ]),
    ];
    try {
      await exportCsv(`${selectedDef.type}-report.csv`, rows);
    } catch {
      showToast('Unable to export report right now.', 'error');
    }
  };

  return (
    <ScreenContainer padded={false}>
      {!selectedType ? (
        <FlatList
          data={REPORT_DEFS}
          keyExtractor={(item) => item.type}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          ListHeaderComponent={<Text style={styles.title}>Reports</Text>}
          renderItem={({ item }) => (
            <ReportSummaryCard
              type={item.type}
              label={item.label}
              icon={item.icon}
              day={item.dayScoped ? 1 : undefined}
              active={false}
              onPress={() => {
                setSelectedType(item.type);
                setDay(1);
              }}
            />
          )}
        />
      ) : (
        selectedDef && (
        <View style={styles.detail}>
          <View style={styles.detailHeader}>
            <IconButton
              name="arrow-back"
              accessibilityLabel="Back to reports"
              onPress={() => setSelectedType(null)}
            />
            <Text style={styles.detailTitle}>{selectedDef.label} Report</Text>
            <IconButton
              name="download-outline"
              accessibilityLabel="Export CSV"
              onPress={handleExport}
              background={colors.primaryMuted}
              color={colors.primary}
            />
          </View>

          {selectedDef.dayScoped && (
            <View style={styles.dayChips}>
              {MEAL_DAYS.map((d) => (
                <FilterChip key={d} label={`Day ${d}`} active={day === d} onPress={() => setDay(d)} />
              ))}
            </View>
          )}

          {isError ? (
            <ErrorState message={(error as ApiError)?.message} onRetry={refetch} />
          ) : isPending ? (
            <View style={styles.summaryRow}>
              <Skeleton height={56} style={styles.summaryHalf} />
              <Skeleton height={56} style={styles.summaryHalf} />
            </View>
          ) : (
            <View style={styles.summaryRow}>
              <View style={styles.summaryBlock}>
                <Text style={styles.summaryCount}>{todayCount}</Text>
                <Text style={styles.summaryLabel}>Today</Text>
              </View>
              <View style={styles.summaryBlock}>
                <Text style={styles.summaryCount}>{data?.total ?? 0}</Text>
                <Text style={styles.summaryLabel}>Total</Text>
              </View>
            </View>
          )}

          {!isPending && !isError && (
            <FlatList
              style={styles.resultsFlex}
              data={data?.items ?? []}
              keyExtractor={(item, index) => `${item.registration.registrationCode}-${index}`}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => <ReportRow item={item} />}
              ListEmptyComponent={
                <EmptyState icon="document-text-outline" title="No records yet" message="Nothing recorded for this report." />
              }
            />
          )}
        </View>
        )
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.headingLarge,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  gridRow: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  gridContent: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  detail: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.sm,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  detailTitle: {
    ...typography.subheading,
  },
  dayChips: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  summaryHalf: {
    flex: 1,
  },
  summaryBlock: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  summaryCount: {
    ...typography.headingLarge,
  },
  summaryLabel: {
    ...typography.caption,
  },
  resultsFlex: {
    flex: 1,
    marginTop: spacing.md,
  },
  list: {
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
});
