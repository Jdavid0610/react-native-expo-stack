import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@shared/storage/mmkv';
import type { User } from './services';

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

type AuthActions = {
  setAuth: (token: string, user: User) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      setAuth: (token, user) =>
        set({ token, user, isAuthenticated: true }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({ token: null, user: null, isAuthenticated: false }),

      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
