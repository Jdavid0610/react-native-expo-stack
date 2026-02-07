import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services';
import { useAuthStore } from '../store';
import { storage } from '@shared/storage/mmkv';

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      storage.remove('auth-token');
      storage.remove('refresh-token');
      logout();
      queryClient.clear();
    },
  });
}
