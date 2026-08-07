import type { RegistrationStatus } from '@/api/types';

type StatusBadgeVariant = 'success' | 'warning' | 'danger' | 'neutral';

export const STATUS_BADGE: Record<RegistrationStatus, { label: string; variant: StatusBadgeVariant }> = {
  approved: { label: 'Approved', variant: 'success' },
  payment_review: { label: 'Payment Review', variant: 'warning' },
  submitted: { label: 'Payment Pending', variant: 'neutral' },
  resubmitted: { label: 'Resubmitted', variant: 'neutral' },
  rejected: { label: 'Rejected', variant: 'danger' },
};
