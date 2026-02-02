'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Camera,
  Check,
  AlertCircle,
  Lock,
  Bell,
  Globe,
  Moon,
  Sun,
  Shield,
  Trash2,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { usersApi } from '@/lib/api/users';
import { getErrorMessage } from '@/lib/utils/api-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';

export default function UserProfilePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    avatarUrl: user?.avatarUrl || '',
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      mentions: true,
      directMessages: true,
    },
    theme: 'light' as 'light' | 'dark' | 'system',
    language: 'en',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

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
    setError('');
    setSuccess('');

    try {
      const { profile } = await usersApi.updateProfile({
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber || undefined,
        avatarUrl: formData.avatarUrl || undefined,
      });
      setUser(profile);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to update profile'));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await usersApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password changed successfully!');
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to change password'));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex flex-col h-screen">
      <WorkspaceHeader title="Account Settings" />
      <div className="flex-1 overflow-y-auto p-6 bg-linear-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Profile Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                <p className="text-sm text-gray-500 mt-1">Update your personal details</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
                className="text-purple-600 hover:text-purple-700"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>

            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
              <div className="relative">
                {formData.avatarUrl ? (
                  <Image
                    src={formData.avatarUrl}
                    alt={formData.fullName}
                    width={80}
                    height={80}
                    className="rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    {getInitials(formData.fullName || 'User')}
                  </div>
                )}
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{formData.fullName}</h3>
                <p className="text-sm text-gray-500">{formData.email}</p>
                {isEditing && (
                  <p className="text-xs text-gray-400 mt-2">Click the camera icon to change your avatar</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  disabled={!isEditing}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSaveProfile} disabled={loading}>
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Password</h3>
                    <p className="text-sm text-gray-500">Change your password</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-purple-600 hover:bg-purple-50"
                >
                  {showPasswordForm ? 'Cancel' : 'Change'}
                </Button>
              </div>

              {showPasswordForm && (
                <form onSubmit={handleChangePassword} className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                    <Input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                    <Input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <Input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    Update Password
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Preferences</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Notifications</h3>
                <div className="space-y-3">
                  {Object.entries(preferences.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-sm text-gray-700 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              [key]: !value,
                            },
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                          value ? 'bg-purple-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                    className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      preferences.theme === 'light'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Sun className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                    <p className="text-xs font-medium text-gray-900">Light</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                    className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      preferences.theme === 'dark'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Moon className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                    <p className="text-xs font-medium text-gray-900">Dark</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...preferences, theme: 'system' })}
                    className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                      preferences.theme === 'system'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Globe className="w-5 h-5 mx-auto mb-1 text-gray-700" />
                    <p className="text-xs font-medium text-gray-900">System</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-bold text-red-600">Danger Zone</h2>
            </div>

            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h3 className="font-semibold text-red-600">Delete Account</h3>
                <p className="text-sm text-red-500">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button variant="destructive" className="cursor-pointer">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
