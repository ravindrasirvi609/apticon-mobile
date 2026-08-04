import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import type { ApiEnvelope } from '@/api/types';
import { useAuthStore } from '@/store/authStore';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://apticon-2026.vercel.app/api/mobile';

export class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(message: string, status: number, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const envelope = response.data as ApiEnvelope<unknown>;
    if (!envelope?.success) {
      throw new ApiError(envelope?.message ?? 'Something went wrong', response.status, envelope?.errors ?? []);
    }
    return envelope.data as unknown as AxiosResponse;
  },
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        useAuthStore.getState().logout();
      }
      throw new ApiError(data?.message ?? 'Something went wrong', status, data?.errors ?? []);
    }
    throw new ApiError('Unable to reach the server. Check your connection.', 0, []);
  },
);

// The response interceptor above unwraps the `{success, message, data}` envelope
// and resolves with `data` directly, so these helpers re-type the axios call to
// match what actually comes back at runtime.
export function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.get(url, config) as unknown as Promise<T>;
}

export function apiPost<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.post(url, body, config) as unknown as Promise<T>;
}
