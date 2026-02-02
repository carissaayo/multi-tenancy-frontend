'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceInvitations, useRevokeInvitation, type WorkspaceInvitation } from '@/hooks/invitations';
import { useWorkspaceMembers } from '@/hooks/members';
import { useWorkspace } from '@/hooks/workspace';
import { useAuthStore } from '@/store/auth-store';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Ban } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  expired: 'Expired',
  revoked: 'Revoked',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-green-100 text-green-800',
  expired: 'bg-gray-100 text-gray-600',
  revoked: 'bg-red-100 text-red-800',
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

  const handleRevoke = (inv: WorkspaceInvitation) => {
    if (!confirm(`Revoke invitation sent to ${inv.email}?`)) return;
    revokeInvitation.mutate(inv.id);
  };

  if (!canAccess) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader title="Invitations" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
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
        <div className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
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
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Workspace Invitations</h2>
          <div className="bg-white rounded-lg shadow">
            {sortedInvitations.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="font-medium">No invitations yet</p>
                <p className="text-sm mt-1">
                  Invitations sent from the Members page will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y overflow-x-auto">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                    className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50"
                  >
                    <div className="col-span-3 min-w-0">
                      <span className="font-medium text-gray-900 truncate block">
                        {inv.email}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="capitalize">{inv.role}</span>
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          STATUS_COLORS[inv.status] ?? 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {STATUS_LABELS[inv.status] ?? inv.status}
                      </span>
                    </div>
                    <div className="col-span-2 min-w-0">
                      <span className="text-gray-600 truncate block">
                        {getInviterName(inv)}
                      </span>
                    </div>
                    <div className="col-span-2 text-sm text-gray-500">
                      {formatDate(inv.invitedAt)}
                    </div>
                    <div className="col-span-1 text-right">
                      {inv.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevoke(inv)}
                          disabled={revokeInvitation.isPending}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
    </div>
  );
}
