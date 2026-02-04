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
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-card rounded-t-2xl sm:rounded-2xl p-6 max-w-md w-full border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Power className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-card-foreground">Activate Workspace?</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Reactivate <strong className="text-foreground">{workspaceName}</strong>? The workspace will be accessible again.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            disabled={isActivating}
            className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
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
