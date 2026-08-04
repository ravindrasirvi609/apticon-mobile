export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
};

export type StaffRole = 'checkin_staff' | 'super_admin';

export type StaffUser = {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  isActive?: boolean;
  mustChangePassword: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: StaffUser;
};

export type MeResponse = {
  user: StaffUser;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type AttendeeCategory = string;

export type RegistrationStatus =
  | 'submitted'
  | 'payment_review'
  | 'approved'
  | 'rejected'
  | 'resubmitted';

export type PaymentStatus = string;

export type AttendeeSearchItem = {
  _id: string;
  registrationCode: string;
  fullName: string;
  email: string;
  phone: string;
  institution?: string;
  designation?: string;
  category: AttendeeCategory;
  feeTier?: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  photoUrl?: string;
  createdAt: string;
};

export type AttendeeSearchField = 'all' | 'registrationCode' | 'email' | 'phone' | 'fullName';

export type AttendeeSearchParams = {
  q?: string;
  field?: AttendeeSearchField;
  status?: RegistrationStatus;
  sort?: string;
  page?: number;
  limit?: number;
};

export type AttendeeSearchResponse = {
  total: number;
  page: number;
  limit: number;
  items: AttendeeSearchItem[];
};

export type AttendeeRegistration = AttendeeSearchItem & {
  city?: string;
  state?: string;
  feeAmount?: number;
};

export type ActionStamp = { at: string; by: string } | null;
export type DayActionStamp = { day: number; at: string; by: string };

export type AttendeeStatus = {
  checkIn: ActionStamp;
  idCard: ActionStamp;
  kit: ActionStamp;
  certificate: ActionStamp;
  breakfast: DayActionStamp[];
  lunch: DayActionStamp[];
  dinner: DayActionStamp[];
};

export type AttendeeDetailResponse = {
  registration: AttendeeRegistration;
  status: AttendeeStatus;
};

export type ActionType =
  | 'check_in'
  | 'id_card'
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'kit'
  | 'certificate';

export type RecordActionRequest = {
  actionType: ActionType;
  day?: number;
  device?: string;
};

export type RecordActionResponse = {
  status: AttendeeStatus;
};

export type HistoryEntry = {
  actionType: ActionType;
  day: number;
  device?: string;
  at: string;
  by: string;
};

export type AttendeeHistoryResponse = {
  history: HistoryEntry[];
};

export type DashboardStats = {
  totalRegistered: number;
  checkedIn: number;
  idCardIssued: number;
  kitDistributed: number;
  certificatesDistributed: number;
  breakfast: Record<string, number>;
  lunch: Record<string, number>;
  dinner: Record<string, number>;
};

export type ReportType =
  | 'checked-in'
  | 'id-card'
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'kit'
  | 'certificate';

export type ReportParams = {
  day?: number;
  page?: number;
  limit?: number;
};

export type ReportItem = {
  registration: {
    registrationCode: string;
    fullName: string;
    email: string;
    phone: string;
    institution?: string;
  };
  day?: number;
  device?: string;
  at: string;
  by: string;
};

export type ReportResponse = {
  total: number;
  page: number;
  limit: number;
  items: ReportItem[];
};
