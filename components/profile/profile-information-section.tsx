'use client';

import Image from 'next/image';
import { User, Mail, Phone, Camera, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ProfileFormData } from '@/hooks/page/use-profile';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface ProfileInformationSectionProps {
  formData: ProfileFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileFormData>>;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  loading: boolean;
  avatarLoading: boolean;
  onSaveProfile: () => Promise<void>;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function ProfileInformationSection({
  formData,
  setFormData,
  isEditing,
  setIsEditing,
  loading,
  avatarLoading,
  onSaveProfile,
  onAvatarUpload,
}: ProfileInformationSectionProps) {
  return (
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
            <label
              className={`absolute -bottom-2 -right-2 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center transition-colors shadow-lg ${
                avatarLoading
                  ? 'opacity-50 cursor-not-allowed pointer-events-none'
                  : 'cursor-pointer hover:bg-purple-700'
              }`}
            >
              {avatarLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-white" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onAvatarUpload}
                disabled={avatarLoading}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
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
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
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
            onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
            disabled={!isEditing}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <Button onClick={onSaveProfile} disabled={loading}>
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
  );
}
