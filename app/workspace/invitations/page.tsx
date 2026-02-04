'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceInvitations, useRevokeInvitation, type WorkspaceInvitation } from '@/hooks/invitations';
import { useWorkspaceMembers } from '@/hooks/members';
import { useWorkspace } from '@/hooks/workspace';
import { useAuthStore } from '@/store/auth-store';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Loader2, Mail, Ban, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  expired: 'Expired',
  revoked: 'Revoked',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
  expired: 'bg-muted text-muted-foreground',
  revoked: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function getInviterName(inv: WorkspaceInvitation): string {
  const invitedBy = inv.invitedBy;
  if (!invitedBy) return '—';
  return invitedBy.fullName?.trim() || invitedBy.email || 'Unknown';
}

export default function InvitationsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: membersData } = useWorkspaceMembers();
  const { currentWorkspace } = useAuthStore();
  const { data: workspaceData } = useWorkspace(currentWorkspace?.id ?? null);
  const { data: invitations, isLoading, error } = useWorkspaceInvitations();
  const revokeInvitation = useRevokeInvitation();

  // State for revoke confirmation modal
  const [invitationToRevoke, setInvitationToRevoke] = useState<WorkspaceInvitation | null>(null);

  const currentUserRole = useMemo(() => {
    const member = membersData?.find(
      (m) => m.userId === user?.id || m.user?.id === user?.id
    );
    return (
      member?.role ??
      workspaceData?.workspace?.userRole ??
      ''
    );
  }, [membersData, user?.id, workspaceData?.workspace?.userRole]);

  const canAccess = useMemo(
    () => ['owner', 'admin'].includes(currentUserRole?.toLowerCase()),
    [currentUserRole]
  );

  const handleRevokeClick = (inv: WorkspaceInvitation) => {
    setInvitationToRevoke(inv);
  };

  const handleRevokeConfirm = () => {
    if (invitationToRevoke) {
      revokeInvitation.mutate(invitationToRevoke.id, {
        onSuccess: () => setInvitationToRevoke(null),
      });
    }
  };

  const handleRevokeCancel = () => {
    setInvitationToRevoke(null);
  };

  if (!canAccess) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader title="Invitations" />
        <div className="flex-1 flex items-center justify-center p-6 bg-background">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              Only workspace owners and admins can view invitations.
            </p>
            <Button variant="outline" onClick={() => router.push('/workspace/members')}>
              Back to Members
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader title="Invitations" />
        <div className="flex-1 p-6 bg-background">
          <div className="space-y-4 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader title="Invitations" />
        <div className="flex-1 flex items-center justify-center p-6">
          <ErrorDisplay
            error={error}
            fallback="Failed to load invitations"
            title="Could not load invitations"
            onRetry={() => window.location.reload()}
            variant="full"
          />
        </div>
      </div>
    );
  }

  const sortedInvitations = [...(invitations ?? [])].sort(
    (a, b) => new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime()
  );

  return (
    <div className="flex flex-col h-screen">
      <WorkspaceHeader title="Invitations" />
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/workspace/members"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Members</span>
          </Link>
          <h2 className="text-2xl font-bold mb-6 text-foreground">Workspace Invitations</h2>
          <div className="bg-card rounded-lg shadow border border-border">
            {sortedInvitations.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60" />
                <p className="font-medium text-foreground">No invitations yet</p>
                <p className="text-sm mt-1">
                  Invitations sent from the Members page will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border overflow-x-auto">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-3">Email</div>
                  <div className="col-span-2">Role</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Invited by</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-1 text-right">Actions</div>
                </div>
                {sortedInvitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-muted/50 text-foreground"
                  >
                    <div className="col-span-3 min-w-0">
                      <span className="font-medium truncate block">
                        {inv.email}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="capitalize">{inv.role}</span>
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[inv.status] ?? 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {STATUS_LABELS[inv.status] ?? inv.status}
                      </span>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <span className="text-muted-foreground truncate block">
                        {getInviterName(inv)}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-muted-foreground">
                      {formatDate(inv.invitedAt)}
                    </div>
                    <div className="col-span-1 text-right">
                      {inv.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeClick(inv)}
                          disabled={revokeInvitation.isPending}
                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                        >
                          {revokeInvitation.isPending &&
                          revokeInvitation.variables === inv.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Ban className="w-4 h-4 mr-1" />
                              Revoke
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revoke Invitation Confirmation Modal */}
      <Modal
        isOpen={!!invitationToRevoke}
        onClose={handleRevokeCancel}
        title="Revoke Invitation"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-foreground">
                Are you sure you want to revoke the invitation sent to{' '}
                <span className="font-semibold">{invitationToRevoke?.email}</span>?
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                This action cannot be undone. The recipient will no longer be able to join the workspace using this invitation.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleRevokeCancel}
              disabled={revokeInvitation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevokeConfirm}
              disabled={revokeInvitation.isPending}
            >
              {revokeInvitation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Revoking...
                </>
              ) : (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Revoke Invitation
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
