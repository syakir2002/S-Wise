import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const storage = {
  get: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          return localStorage.getItem(key);
        }
        return null;
      }
      return await SecureStore.getItemAsync(key);
    } catch (e) {
      console.warn(`[Storage] Failed to read key "${key}":`, e);
      return null;
    }
  },

  set: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(key, value);
        }
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.warn(`[Storage] Failed to save key "${key}":`, e);
    }
  },

  delete: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(key);
        }
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.warn(`[Storage] Failed to delete key "${key}":`, e);
    }
  },
};

export default storage;

