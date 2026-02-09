import { apiClient } from '@shared/api/client';
import type { ApiResponse } from '@shared/api/client';
import type { User } from '@shared/storages/auth.store';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiClient.post<ApiResponse<AuthTokens & { user: User }>>(
      '/auth/login',
      data,
    );
    return response.data.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiClient.post<ApiResponse<AuthTokens & { user: User }>>(
      '/auth/register',
      data,
    );
    return response.data.data;
  },

  logout: async () => {
    await apiClient.post('/auth/logout');
  },

  getMe: async () => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post<ApiResponse<AuthTokens>>(
      '/auth/refresh',
      { refreshToken },
    );
    return response.data.data;
  },
};
