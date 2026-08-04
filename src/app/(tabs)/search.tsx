import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import type { ApiError } from '@/api/client';
import type { AttendeeSearchField } from '@/api/types';
import { AttendeeResultCard } from '@/components/attendee/AttendeeResultCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { FilterChip } from '@/components/ui/FilterChip';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { SearchBar } from '@/components/ui/SearchBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAttendeeSearchInfinite } from '@/hooks/useAttendee';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { spacing } from '@/theme/tokens';

const FIELD_OPTIONS: { label: string; value: AttendeeSearchField }[] = [
  { label: 'All', value: 'all' },
  { label: 'Reg. Number', value: 'registrationCode' },
  { label: 'Mobile', value: 'phone' },
  { label: 'Email', value: 'email' },
  { label: 'Name', value: 'fullName' },
];

const PAGE_LIMIT = 25;

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [field, setField] = useState<AttendeeSearchField>('all');

  const debouncedQuery = useDebouncedValue(query, 300);
  const hasQuery = debouncedQuery.trim().length > 0;

  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage, isError, error, refetch } =
    useAttendeeSearchInfinite({ q: debouncedQuery.trim(), field, limit: PAGE_LIMIT }, hasQuery);

  const items = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <ScreenContainer>
      <View style={styles.controls}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, reg. number, mobile, email"
        />
        <FlatList
          horizontal
          data={FIELD_OPTIONS}
          keyExtractor={(item) => item.value}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          renderItem={({ item }) => (
            <FilterChip label={item.label} active={field === item.value} onPress={() => setField(item.value)} />
          )}
        />
      </View>

      <View style={styles.body}>
        {!hasQuery ? (
          <EmptyState
            icon="search-outline"
            title="Search for an attendee"
            message="Type a name, registration number, mobile number, or email to get started."
          />
        ) : isError ? (
          <ErrorState message={(error as ApiError)?.message} onRetry={refetch} />
        ) : isPending ? (
          <View style={styles.list}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} height={76} radius={16} style={styles.skeletonRow} />
            ))}
          </View>
        ) : items.length === 0 ? (
          <EmptyState
            icon="person-remove-outline"
            title="No attendees found"
            message="Try a different name, registration number, mobile, or email."
          />
        ) : (
          <FlatList
            style={styles.resultsFlex}
            data={items}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <AttendeeResultCard attendee={item} onPress={() => router.push(`/attendee/${item._id}`)} />
            )}
            onEndReachedThreshold={0.4}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            ListFooterComponent={
              isFetchingNextPage ? (
                <Skeleton height={76} radius={16} style={styles.skeletonRow} />
              ) : hasNextPage ? (
                <Button title="Load more" variant="secondary" onPress={() => fetchNextPage()} />
              ) : null
            }
            removeClippedSubviews
            initialNumToRender={10}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  controls: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  chipRow: {
    gap: spacing.sm,
  },
  body: {
    flex: 1,
  },
  resultsFlex: {
    flex: 1,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  skeletonRow: {
    width: '100%',
  },
});
