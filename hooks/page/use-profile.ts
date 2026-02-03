'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';
import { usersApi } from '@/lib/api/users';
import { getErrorMessage } from '@/lib/utils/api-error';

export type ProfileFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
};

export type NotificationPreferences = {
  email: boolean;
  push: boolean;
  mentions: boolean;
  directMessages: boolean;
};

export type ThemePreference = 'light' | 'dark' | 'system';

export type Preferences = {
  notifications: NotificationPreferences;
  theme: ThemePreference;
  language: string;
};

export type PasswordData = {
  password: string;
  newPassword: string;
  confirmNewPassword: string;
};

const DEFAULT_PREFERENCES: Preferences = {
  notifications: {
    email: true,
    push: true,
    mentions: true,
    directMessages: true,
  },
  theme: 'light',
  language: 'en',
};

export function useProfile() {
  const { user, setUser } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    password: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { user: updatedUser } = await usersApi.updateProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber || undefined,
      });
      setUser(updatedUser as Parameters<typeof setUser>[0]);
      toast.success('Profile updated successfully!', { duration: 3000 });
      setIsEditing(false);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to update profile'), { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.password?.trim()) {
      toast.error('Current password is required', { duration: 4000 });
      return;
    }
    if (!passwordData.newPassword?.trim()) {
      toast.error('New password is required', { duration: 4000 });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters', { duration: 4000 });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('Passwords do not match', { duration: 4000 });
      return;
    }
    setPasswordLoading(true);
    try {
      await usersApi.changePassword({
        password: passwordData.password,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword,
      });
      toast.success('Password changed successfully!', { duration: 3000 });
      setShowPasswordForm(false);
      setPasswordData({ password: '', newPassword: '', confirmNewPassword: '' });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to change password'), { duration: 4000 });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setAvatarLoading(true);
    try {
      const { user: updatedUser } = await usersApi.updateAvatar(file);
      setUser(updatedUser as Parameters<typeof setUser>[0]);
      setFormData((prev) => ({ ...prev, avatarUrl: updatedUser?.avatarUrl || prev.avatarUrl }));
      toast.success('Avatar updated successfully!', { duration: 3000 });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to update avatar'), { duration: 4000 });
    } finally {
      setAvatarLoading(false);
    }
  };

  const togglePasswordForm = () => setShowPasswordForm((prev) => !prev);

  return {
    user,
    formData,
    setFormData,
    preferences,
    setPreferences,
    passwordData,
    setPasswordData,
    isEditing,
    setIsEditing,
    loading,
    avatarLoading,
    passwordLoading,
    showPasswordForm,
    togglePasswordForm,
    handleSaveProfile,
    handleChangePassword,
    handleAvatarUpload,
  };
}
