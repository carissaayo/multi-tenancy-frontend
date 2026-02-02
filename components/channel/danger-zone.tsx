'use client';

import { AlertCircle, LogOut, Trash2 } from 'lucide-react';

interface DangerZoneProps {
  canDelete: boolean;
  onLeaveClick: () => void;
  onDeleteClick: () => void;
}

export function DangerZone({
  canDelete,
  onLeaveClick,
  onDeleteClick,
}: DangerZoneProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900">Leave Channel</h3>
            <p className="text-sm text-gray-500">
              You will no longer have access to this channel
            </p>
          </div>
          <button
            onClick={onLeaveClick}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Leave
          </button>
        </div>

        {canDelete && (
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h3 className="font-semibold text-red-600">Delete Channel</h3>
              <p className="text-sm text-red-500">
                Permanently delete this channel and all its messages
              </p>
            </div>
            <button
              onClick={onDeleteClick}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
