import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'apticon_staff_token';

// expo-secure-store has no real web implementation (native Keychain/Keystore only),
// so the web build falls back to AsyncStorage, which is backed by localStorage there.
const isWeb = Platform.OS === 'web';

export async function getToken(): Promise<string | null> {
  return isWeb ? AsyncStorage.getItem(TOKEN_KEY) : SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function clearToken(): Promise<void> {
  if (isWeb) {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}
