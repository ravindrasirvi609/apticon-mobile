import { apiGet } from '@/api/client';
import type { ReportParams, ReportResponse, ReportType } from '@/api/types';

export function fetchReport(type: ReportType, params: ReportParams) {
  return apiGet<ReportResponse>(`/reports/${type}`, { params });
}
