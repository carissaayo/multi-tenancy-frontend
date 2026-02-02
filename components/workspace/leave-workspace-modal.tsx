'use client';

import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';

interface LeaveWorkspaceModalProps {
  isOpen: boolean;
  workspaceName?: string;
  isLeaving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function LeaveWorkspaceModal({
  isOpen,
  workspaceName,
  isLeaving,
  onConfirm,
  onCancel,
}: LeaveWorkspaceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <LogOut className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Leave Workspace?</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to leave <strong>{workspaceName}</strong>? You will need to be
          re-invited to access this workspace again.
        </p>
        <div className="flex gap-3">
          <Button
            variant="default"
            onClick={onConfirm}
            disabled={isLeaving}
            className="flex-1 bg-gray-600 hover:bg-gray-700"
          >
            {isLeaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Leave'}
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={isLeaving} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
