import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services';
import { profileKeys } from './useProfile';
import type { UpdateProfileFormData } from '../schemas/profile.schema';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileFormData) =>
      profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.detail() });
    },
  });
}
