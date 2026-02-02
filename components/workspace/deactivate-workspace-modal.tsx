'use client';

import { Button } from '@/components/ui/button';
import { Loader2, PowerOff } from 'lucide-react';

interface DeactivateWorkspaceModalProps {
  isOpen: boolean;
  workspaceName?: string;
  isDeactivating: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeactivateWorkspaceModal({
  isOpen,
  workspaceName,
  isDeactivating,
  onConfirm,
  onCancel,
}: DeactivateWorkspaceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <PowerOff className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Deactivate Workspace?</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to deactivate <strong>{workspaceName}</strong>? The workspace will
          be temporarily disabled. You can reactivate it later from workspace settings.
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onConfirm}
            disabled={isDeactivating}
            className="flex-1 border-amber-500 text-amber-700 hover:bg-amber-50"
          >
            {isDeactivating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deactivate'}
          </Button>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isDeactivating}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
