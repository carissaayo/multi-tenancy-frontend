'use client';

import { Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { PasswordData } from '@/hooks/page/use-profile';

interface SecuritySectionProps {
  showPasswordForm: boolean;
  togglePasswordForm: () => void;
  passwordData: PasswordData;
  setPasswordData: React.Dispatch<React.SetStateAction<PasswordData>>;
  passwordLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export function SecuritySection({
  showPasswordForm,
  togglePasswordForm,
  passwordData,
  setPasswordData,
  passwordLoading,
  onSubmit,
}: SecuritySectionProps) {
  return (
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
            onClick={togglePasswordForm}
            className="text-purple-600 hover:bg-purple-50"
          >
            {showPasswordForm ? 'Cancel' : 'Change'}
          </Button>
        </div>

        {showPasswordForm && (
          <form onSubmit={onSubmit} className="p-4 bg-gray-50 rounded-lg space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Password
              </label>
              <Input
                type="password"
                value={passwordData.password}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                minLength={1}
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <Input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={passwordData.confirmNewPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({ ...prev, confirmNewPassword: e.target.value }))
                }
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <button
              type="submit"
              disabled={passwordLoading}
              className="inline-flex items-center justify-center gap-2 h-9 px-4 py-2 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              {passwordLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
