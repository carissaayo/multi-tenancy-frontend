'use client';

import { UserPlus } from 'lucide-react';

interface AddMemberSectionProps {
  onOpenPicker: () => void;
}

export function AddMemberSection({ onOpenPicker }: AddMemberSectionProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900">Add Members</h2>
        </div>
        <button
          onClick={onOpenPicker}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add from Workspace
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        Add existing workspace members to this channel
      </p>
    </div>
  );
}
