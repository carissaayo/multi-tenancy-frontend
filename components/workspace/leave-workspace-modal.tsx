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
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-card rounded-t-2xl sm:rounded-2xl p-6 max-w-md w-full border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
            <LogOut className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-card-foreground">Leave Workspace?</h3>
        </div>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to leave <strong className="text-foreground">{workspaceName}</strong>? You will need to be
          re-invited to access this workspace again.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onConfirm}
            disabled={isLeaving}
            className="flex-1"
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
