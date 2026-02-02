import { apiClient } from './client';
import type { User } from '@/store/auth-store';

export interface UpdateProfileDto {
  fullName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export const usersApi = {
  /** Get current user profile */
  getProfile: async (): Promise<{ profile: User }> => {
    const response = await apiClient.instance.get('/users/me');
    return response.data;
  },

  /** Update current user profile */
  updateProfile: async (data: UpdateProfileDto): Promise<{ profile: User }> => {
    const response = await apiClient.instance.patch('/users/me', data);
    return response.data;
  },

  /** Change password */
  changePassword: async (data: ChangePasswordDto): Promise<{ message: string }> => {
    const response = await apiClient.instance.patch('/users/me/password', data);
    return response.data;
  },
};
