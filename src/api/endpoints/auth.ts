import { apiGet, apiPost } from '@/api/client';
import type {
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  MeResponse,
} from '@/api/types';

export function login(body: LoginRequest) {
  return apiPost<LoginResponse>('/auth/login', body);
}

export function fetchMe(tokenOverride?: string) {
  return apiGet<MeResponse>(
    '/auth/me',
    tokenOverride ? { headers: { Authorization: `Bearer ${tokenOverride}` } } : undefined,
  );
}

export function changePassword(body: ChangePasswordRequest) {
  return apiPost<null>('/auth/change-password', body);
}

export function logout() {
  return apiPost<null>('/auth/logout');
}
