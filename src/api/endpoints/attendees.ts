import { apiGet, apiPost } from '@/api/client';
import type {
  AttendeeDetailResponse,
  AttendeeHistoryResponse,
  AttendeeSearchParams,
  AttendeeSearchResponse,
  RecordActionRequest,
  RecordActionResponse,
} from '@/api/types';

export function searchAttendees(params: AttendeeSearchParams) {
  return apiGet<AttendeeSearchResponse>('/attendees/search', { params });
}

export function fetchAttendeeById(id: string) {
  return apiGet<AttendeeDetailResponse>(`/attendees/${id}`);
}

export function fetchAttendeeByCode(code: string) {
  return apiGet<AttendeeDetailResponse>(`/attendees/by-code/${encodeURIComponent(code)}`);
}

export function recordAction(id: string, body: RecordActionRequest) {
  return apiPost<RecordActionResponse>(`/attendees/${id}/actions`, body);
}

export function fetchAttendeeHistory(id: string) {
  return apiGet<AttendeeHistoryResponse>(`/attendees/${id}/history`);
}
