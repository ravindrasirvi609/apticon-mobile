import { apiGet } from '@/api/client';
import type { DashboardStats } from '@/api/types';

export function fetchDashboardStats() {
  return apiGet<DashboardStats>('/dashboard/stats');
}
