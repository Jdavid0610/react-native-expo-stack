import { apiClient } from '@shared/api/client';
import type { ApiResponse } from '@shared/api/client';

export type Profile = {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
};

type UpdateProfileRequest = {
  name: string;
  bio?: string;
};

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<Profile>>('/profile');
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await apiClient.patch<ApiResponse<Profile>>('/profile', data);
    return response.data.data;
  },
};
