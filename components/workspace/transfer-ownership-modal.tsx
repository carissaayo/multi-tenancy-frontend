'use client';

import { Button } from '@/components/ui/button';
import { Crown, Loader2 } from 'lucide-react';
import type { WorkspaceMember } from '@/hooks/members';

interface TransferOwnershipModalProps {
  isOpen: boolean;
  adminMembers: WorkspaceMember[];
  selectedTransferTarget: string | null;
  isTransferring: boolean;
  onSelectTarget: (userId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TransferOwnershipModal({
  isOpen,
  adminMembers,
  selectedTransferTarget,
  isTransferring,
  onSelectTarget,
  onConfirm,
  onCancel,
}: TransferOwnershipModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-card rounded-t-2xl sm:rounded-2xl p-6 max-w-md w-full border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-card-foreground">Transfer Ownership</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Select an admin to transfer workspace ownership to. You will become an admin.
        </p>
        {adminMembers.length === 0 ? (
          <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
            No admins available. Promote a member to admin first from the Members page.
          </p>
        ) : (
          <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
            {adminMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => onSelectTarget(member.userId)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  selectedTransferTarget === member.userId
                    ? 'border-primary bg-accent'
                    : 'border-border hover:bg-muted'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold shrink-0">
                  {(member.user?.fullName || member.user?.email || '?').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-card-foreground truncate">
                    {member.user?.fullName || member.user?.email || 'Unknown'}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">{member.user?.email}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            disabled={!selectedTransferTarget || adminMembers.length === 0 || isTransferring}
            className="flex-1"
          >
            {isTransferring ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Transfer'}
          </Button>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isTransferring}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
