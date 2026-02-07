import { useQuery } from '@tanstack/react-query';
import { profileService } from '../services';

export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: profileService.getProfile,
  });
}
