import { authStore } from "@shared/storages/auth.store";
import { AUTH_INITIAL_STATE } from "@shared/utils/constants";
import type { User } from "@shared/storages/auth.store";

export type { User } from "@shared/storages/auth.store";

export function useAuth() {
  const state = authStore();

  const signIn = (token: string, refreshToken: string, user: User) => {
    authStore.setState({ token, refreshToken, user, isAuthenticated: true });
  };

  const signOut = () => {
    authStore.setState(AUTH_INITIAL_STATE);
  };

  const updateUser = (user: User) => {
    authStore.setState({ user });
  };

  return {
    ...state,
    signIn,
    signOut,
    updateUser,
  };
}
