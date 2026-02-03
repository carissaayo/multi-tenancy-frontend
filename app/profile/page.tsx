'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useProfile } from '@/hooks/page/use-profile';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import {
  ProfileInformationSection,
  SecuritySection,
  PreferencesSection,
  DangerZoneSection,
} from '@/components/profile';

export default function UserProfilePage() {
  const router = useRouter();
  const {
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
  } = useProfile();

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

          <ProfileInformationSection
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            loading={loading}
            avatarLoading={avatarLoading}
            onSaveProfile={handleSaveProfile}
            onAvatarUpload={handleAvatarUpload}
          />

          <SecuritySection
            showPasswordForm={showPasswordForm}
            togglePasswordForm={togglePasswordForm}
            passwordData={passwordData}
            setPasswordData={setPasswordData}
            passwordLoading={passwordLoading}
            onSubmit={handleChangePassword}
          />

          <PreferencesSection preferences={preferences} setPreferences={setPreferences} />

          <DangerZoneSection />
        </div>
      </div>
    </div>
  );
}
