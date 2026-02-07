import { useMutation } from '@tanstack/react-query';
import { authService } from '../services';
import { useAuthStore } from '../store';
import { storage } from '@shared/storage/mmkv';
import type { LoginFormData } from '../schemas/login.schema';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (result) => {
      storage.set('auth-token', result.accessToken);
      storage.set('refresh-token', result.refreshToken);
      setAuth(result.accessToken, result.user);
    },
  });
}
