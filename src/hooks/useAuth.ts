import { useMutation } from '@tanstack/react-query';

import { changePassword, login, logout as logoutRequest } from '@/api/endpoints/auth';
import type { ApiError } from '@/api/client';
import type { ChangePasswordRequest, LoginRequest } from '@/api/types';
import { useAuthStore } from '@/store/authStore';

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<Awaited<ReturnType<typeof login>>, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: (data) => setSession(data.token, data.user),
  });
}

export function useChangePassword() {
  return useMutation<Awaited<ReturnType<typeof changePassword>>, ApiError, ChangePasswordRequest>({
    mutationFn: changePassword,
  });
}

export function useLogout() {
  const logoutStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: logoutRequest,
    onSettled: () => logoutStore(),
  });
}
