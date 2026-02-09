import { useMutation } from '@tanstack/react-query';
import { authService } from '../services';
import { useAuth } from '@shared/hooks/useAuth';
import type { LoginFormData } from '../schemas/login.schema';

export function useLogin() {
  const { signIn } = useAuth();

  return useMutation({
    mutationFn: (data: LoginFormData) => authService.login(data),
    onSuccess: (result) => {
      signIn(result.accessToken, result.refreshToken, result.user);
    },
  });
}
