import { apiClient } from './client';
import type { User } from '@/store/auth-store';

export interface UpdateProfileDto {
  fullName?: string;
  phoneNumber?: string;
  bio?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface ChangePasswordDto {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
}

export const usersApi = {
  /** Get current user profile */
  getProfile: async (): Promise<{ user: Partial<User>; message: string }> => {
    const response = await apiClient.instance.get('/users');
    return response.data;
  },

  /** Update current user profile */
  updateProfile: async (data: UpdateProfileDto): Promise<{ user: Partial<User>; message: string }> => {
    const response = await apiClient.instance.patch('/users', data);
    return response.data;
  },

  /** Update user avatar (multipart form with 'avatar' file) */
  updateAvatar: async (file: File): Promise<{ user: Partial<User>; message: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.instance.patch('/users/avatar', formData);
    return response.data;
  },

  /** Change password (uses auth controller) */
  changePassword: async (data: ChangePasswordDto): Promise<{ message: string }> => {
    const response = await apiClient.instance.post('/auth/change-password', data);
    return response.data;
  },
};
