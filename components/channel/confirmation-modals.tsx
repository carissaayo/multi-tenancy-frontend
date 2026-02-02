'use client';

import { Trash2, LogOut, Loader2 } from 'lucide-react';

interface DeleteChannelModalProps {
  channelName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteChannelModal({
  channelName,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteChannelModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Delete Channel?</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>#{channelName}</strong>?
          This action cannot be undone and all messages will be permanently
          deleted.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-red-700"
          >
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Channel
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

interface LeaveChannelModalProps {
  channelName: string;
  isLeaving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LeaveChannelModal({
  channelName,
  isLeaving,
  onConfirm,
  onCancel,
}: LeaveChannelModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <LogOut className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Leave Channel?</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to leave <strong>#{channelName}</strong>?
          You&apos;ll need to be re-invited to access this channel again.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isLeaving}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-gray-700"
          >
            {isLeaving && <Loader2 className="w-4 h-4 animate-spin" />}
            Leave Channel
          </button>
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
