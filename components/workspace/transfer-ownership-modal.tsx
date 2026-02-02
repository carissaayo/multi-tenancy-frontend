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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Transfer Ownership</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Select an admin to transfer workspace ownership to. You will become an admin.
        </p>
        {adminMembers.length === 0 ? (
          <p className="text-sm text-amber-600 mb-4">
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
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold shrink-0">
                  {(member.user?.fullName || member.user?.email || '?').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {member.user?.fullName || member.user?.email || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-500 truncate">{member.user?.email}</div>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            disabled={!selectedTransferTarget || adminMembers.length === 0 || isTransferring}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
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
