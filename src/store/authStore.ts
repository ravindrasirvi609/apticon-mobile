import { create } from 'zustand';

import { fetchMe } from '@/api/endpoints/auth';
import type { StaffUser } from '@/api/types';
import { clearToken, getToken, setToken } from '@/utils/secureToken';

export type AuthStatus = 'hydrating' | 'authenticated' | 'unauthenticated';

type AuthState = {
  token: string | null;
  user: StaffUser | null;
  status: AuthStatus;
  hydrate: () => Promise<void>;
  setSession: (token: string, user: StaffUser) => Promise<void>;
  setUser: (user: StaffUser) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  status: 'hydrating',

  hydrate: async () => {
    const token = await getToken();
    if (!token) {
      set({ token: null, user: null, status: 'unauthenticated' });
      return;
    }
    try {
      const { user } = await fetchMe(token);
      set({ token, user, status: 'authenticated' });
    } catch {
      await clearToken();
      set({ token: null, user: null, status: 'unauthenticated' });
    }
  },

  setSession: async (token, user) => {
    await setToken(token);
    set({ token, user, status: 'authenticated' });
  },

  setUser: (user) => set({ user }),

  logout: async () => {
    await clearToken();
    set({ token: null, user: null, status: 'unauthenticated' });
  },
}));
