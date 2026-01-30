'use client';

import { Mail, Plus, Loader2 } from 'lucide-react';

interface InviteMemberFormProps {
  email: string;
  isInviting: boolean;
  error?: Error | null;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function InviteMemberForm({
  email,
  isInviting,
  error,
  onEmailChange,
  onSubmit,
}: InviteMemberFormProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-bold text-gray-900">Invite Members</h2>
      </div>
      <form onSubmit={onSubmit} className="flex gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="colleague@example.com"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={isInviting || !email.trim()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isInviting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Invite
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-500">
          {error.message || 'Failed to send invite'}
        </p>
      )}
    </div>
  );
}
