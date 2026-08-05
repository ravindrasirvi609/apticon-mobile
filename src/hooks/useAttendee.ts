import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/api/client';
import {
  fetchAttendeeByCode,
  fetchAttendeeById,
  fetchAttendeeHistory,
  recordAction,
  searchAttendees,
} from '@/api/endpoints/attendees';
import type { AttendeeSearchParams, RecordActionRequest } from '@/api/types';

export function useAttendeeSearchInfinite(params: Omit<AttendeeSearchParams, 'page'>, enabled: boolean) {
  const limit = params.limit ?? 25;

  return useInfiniteQuery({
    queryKey: ['attendees', 'search', params],
    queryFn: ({ pageParam }) => searchAttendees({ ...params, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.page * lastPage.limit < lastPage.total ? lastPage.page + 1 : undefined),
    enabled,
  });
}

export function useAttendeeById(id: string | undefined) {
  return useQuery({
    queryKey: ['attendees', 'byId', id],
    queryFn: () => fetchAttendeeById(id as string),
    enabled: !!id,
  });
}

export function useAttendeeByCode(code: string | undefined) {
  return useQuery({
    queryKey: ['attendees', 'byCode', code],
    queryFn: () => fetchAttendeeByCode(code as string),
    enabled: !!code,
  });
}

export function useAttendeeHistory(id: string | undefined) {
  return useQuery({
    queryKey: ['attendees', 'history', id],
    queryFn: () => fetchAttendeeHistory(id as string),
    enabled: !!id,
  });
}

export function useRecordAction(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: RecordActionRequest) => recordAction(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendees', 'byId', id] });
      queryClient.invalidateQueries({ queryKey: ['attendees', 'history', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
    onError: (err) => {
      if ((err as ApiError).status === 409) {
        queryClient.invalidateQueries({ queryKey: ['attendees', 'byId', id] });
        queryClient.invalidateQueries({ queryKey: ['attendees', 'history', id] });
      }
    },
  });
}
