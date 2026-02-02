'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Power } from 'lucide-react';

interface ActivateWorkspaceModalProps {
  isOpen: boolean;
  workspaceName?: string;
  isActivating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ActivateWorkspaceModal({
  isOpen,
  workspaceName,
  isActivating,
  onConfirm,
  onCancel,
}: ActivateWorkspaceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Power className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Activate Workspace?</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Reactivate <strong>{workspaceName}</strong>? The workspace will be accessible again.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            disabled={isActivating}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isActivating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate'}
          </Button>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isActivating}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
