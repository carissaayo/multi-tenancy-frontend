'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  workspaceName?: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteWorkspaceModal({
  isOpen,
  workspaceName,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteWorkspaceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Delete Workspace?</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{workspaceName}</strong>? This action cannot be
          undone and all data will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={isDeleting} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
