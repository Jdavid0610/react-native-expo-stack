import { useMutation } from '@tanstack/react-query';
import { authService } from '../services';
import { useAuthStore } from '../store';
import { storage } from '@shared/storage/mmkv';
import type { RegisterFormData } from '../schemas/register.schema';

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: ({ confirmPassword: _, ...data }: RegisterFormData) =>
      authService.register(data),
    onSuccess: (result) => {
      storage.set('auth-token', result.accessToken);
      storage.set('refresh-token', result.refreshToken);
      setAuth(result.accessToken, result.user);
    },
  });
}
