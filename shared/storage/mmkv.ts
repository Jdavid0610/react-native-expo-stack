import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export const storage = createMMKV({
  id: 'expo-stack-storage',
});

/**
 * Zustand-compatible storage adapter for MMKV.
 * Used with zustand's persist middleware via createJSONStorage.
 */
export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    storage.set(name, value);
  },
  getItem: (name) => {
    return storage.getString(name) ?? null;
  },
  removeItem: (name) => {
    storage.remove(name);
  },
};
