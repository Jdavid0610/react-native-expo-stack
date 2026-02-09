import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "@shared/storage/mmkv";
import { AUTH_INITIAL_STATE } from "@shared/utils/constants";

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

export const authStore = create<AuthState>()(
  persist(
    (_, __) => ({
      ...AUTH_INITIAL_STATE,
      isHydrated: false,
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorage),
      partialize: ({ isHydrated, ...state }) => state,
      onRehydrateStorage: () => (state) => {
        if (state) {
          authStore.setState({ isHydrated: true });
        }
      },
    },
  ),
);
