import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const REMEMBERED_EMAIL_KEY = 'apticon_remembered_email';

type SettingsState = {
  rememberedEmail: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setRememberedEmail: (email: string | null) => Promise<void>;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  rememberedEmail: null,
  hydrated: false,

  hydrate: async () => {
    const email = await AsyncStorage.getItem(REMEMBERED_EMAIL_KEY);
    set({ rememberedEmail: email, hydrated: true });
  },

  setRememberedEmail: async (email) => {
    if (email) {
      await AsyncStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      await AsyncStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }
    set({ rememberedEmail: email });
  },
}));
