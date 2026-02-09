import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services';
import { useAuth } from '@shared/hooks/useAuth';

export function useLogout() {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      signOut();
      queryClient.clear();
    },
  });
}
