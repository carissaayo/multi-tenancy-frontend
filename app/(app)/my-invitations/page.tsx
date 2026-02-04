'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyPendingInvitations, useAcceptInvitationById, type UserPendingInvitation } from '@/hooks/invitations';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth';
import { queryKeys } from '@/hooks/query-keys';
import { useQueryClient } from '@tanstack/react-query';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import {
  Loader2,
  Mail,
  Building2,
  Clock,
  CheckCircle,
  ArrowLeft,
  Users,
  Shield,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

const ROLE_LABELS: Record<string, string> = {
  member: 'Member',
  admin: 'Admin',
  guest: 'Guest',
};

const ROLE_ICONS: Record<string, React.ReactNode> = {
  member: <Users className="w-4 h-4" />,
  admin: <Shield className="w-4 h-4" />,
  guest: <UserCheck className="w-4 h-4" />,
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function formatTimeRemaining(expiresAt: string): string {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
  return 'Less than an hour';
}

function getInviterName(inv: UserPendingInvitation): string {
  const invitedBy = inv.invitedBy;
  if (!invitedBy) return 'Unknown';
  return invitedBy.fullName?.trim() || invitedBy.email || 'Unknown';
}

export default function MyInvitationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { data: invitations, isLoading, error, refetch } = useMyPendingInvitations();
  const acceptInvitation = useAcceptInvitationById();

  const [invitationToAccept, setInvitationToAccept] = useState<UserPendingInvitation | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAcceptClick = (inv: UserPendingInvitation) => {
    setInvitationToAccept(inv);
  };

  const handleAcceptConfirm = async () => {
    if (!invitationToAccept) return;

    setIsAccepting(true);
    try {
      const result = await acceptInvitation.mutateAsync(invitationToAccept.id);

      // Select the workspace and navigate
      await authApi.selectWorkspace(result.workspace.id);
      useAuthStore.getState().setCurrentWorkspace({
        id: result.workspace.id,
        slug: result.workspace.slug,
        name: result.workspace.name,
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.forSelect });

      setInvitationToAccept(null);
      router.push('/workspace');
    } catch {
      // Error is handled by the mutation's onError
      setIsAccepting(false);
    }
  };

  const handleAcceptCancel = () => {
    if (!isAccepting) {
      setInvitationToAccept(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white dark:bg-gray-800 rounded-xl animate-pulse shadow" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <ErrorDisplay
          error={error}
          fallback="Failed to load invitations"
          title="Could not load your invitations"
          onRetry={() => refetch()}
          variant="full"
        />
      </div>
    );
  }

  const pendingInvitations = (invitations ?? []).filter(
    (inv) => inv.status === 'pending' && new Date(inv.expiresAt) > new Date()
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/select-workspace"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Workspaces</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Mail className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Workspace Invitations
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Invitations sent to {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {pendingInvitations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No pending invitations
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              You don&apos;t have any pending workspace invitations. When someone invites you to a workspace, it will appear here.
            </p>
            <Button onClick={() => router.push('/select-workspace')}>
              Go to Your Workspaces
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingInvitations.map((inv) => (
              <div
                key={inv.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {inv.workspace.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {inv.workspace.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {inv.workspace.slug}
                        </span>
                        <span className="flex items-center gap-1">
                          {ROLE_ICONS[inv.role]}
                          {ROLE_LABELS[inv.role] ?? inv.role}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTimeRemaining(inv.expiresAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                        Invited by <span className="font-medium">{getInviterName(inv)}</span> on{' '}
                        {formatDate(inv.invitedAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAcceptClick(inv)}
                    className="shrink-0"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info box for email functionality */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> This page shows all pending invitations sent to your email address.
            When email notifications are enabled, you&apos;ll also receive invitation links directly in your inbox.
          </p>
        </div>
      </div>

      {/* Accept Confirmation Modal */}
      <Modal
        isOpen={!!invitationToAccept}
        onClose={handleAcceptCancel}
        title="Accept Invitation"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
              {invitationToAccept?.workspace.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-foreground">
                Join <span className="font-semibold">{invitationToAccept?.workspace.name}</span> as a{' '}
                <span className="font-semibold">{ROLE_LABELS[invitationToAccept?.role ?? 'member']}</span>?
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                You&apos;ll be added to this workspace and can start collaborating immediately.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleAcceptCancel}
              disabled={isAccepting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAcceptConfirm}
              disabled={isAccepting}
            >
              {isAccepting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept & Join
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
