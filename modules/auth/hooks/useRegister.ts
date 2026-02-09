import { useMutation } from '@tanstack/react-query';
import { authService } from '../services';
import { useAuth } from '@shared/hooks/useAuth';
import type { RegisterFormData } from '../schemas/register.schema';

export function useRegister() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: ({ confirmPassword: _, ...data }: RegisterFormData) =>
      authService.register(data),
    onSuccess: (result) => {
      signIn(result.accessToken, result.refreshToken, result.user);
    },
  });
}
