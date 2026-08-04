import { useQuery } from '@tanstack/react-query';

import { fetchReport } from '@/api/endpoints/reports';
import type { ReportParams, ReportType } from '@/api/types';

export function useReport(type: ReportType, params: ReportParams, enabled = true) {
  return useQuery({
    queryKey: ['reports', type, params],
    queryFn: () => fetchReport(type, params),
    enabled,
  });
}
