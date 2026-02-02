'use client';

import { useState } from 'react';
import { useWorkspaceMembers, useUpdateMemberRole, useRemoveMember, useInviteMember, memberKeys, type MemberRole, type WorkspaceMember } from '@/hooks/members';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import { ErrorDisplay } from '@/components/ui/error-display';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { workspacesApi } from '@/lib/api/workspaces';
import { useWorkspace } from '@/hooks/workspace';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/api-error';
import { Crown, Loader2, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MembersPage() {
  const { user, currentWorkspace } = useAuthStore();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useWorkspaceMembers();
  const { data: workspaceData } = useWorkspace(currentWorkspace?.id ?? null);
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();
  const inviteMember = useInviteMember();
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<MemberRole>('Member');
  const [isTransferring, setIsTransferring] = useState(false);
  const [selectedTransferTarget, setSelectedTransferTarget] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: MemberRole) => {
    updateRole.mutate({ userId, role: newRole });
  };

  const handleRemoveMember = (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    removeMember.mutate(userId);
  };

  const handleTransferOwnership = async () => {
    if (!selectedTransferTarget) return;
    setIsTransferring(true);
    try {
      await workspacesApi.transferOwnership(selectedTransferTarget);
      queryClient.invalidateQueries({ queryKey: ['workspace', currentWorkspace?.id] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      setShowTransferModal(false);
      setSelectedTransferTarget(null);
      toast.success('Ownership transferred successfully', { duration: 3000 });
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to transfer ownership'), { duration: 4000 });
    } finally {
      setIsTransferring(false);
    }
  };

  const adminMembers = data?.filter((m) => m.role === 'Admin') ?? [];

  const handleInvite = () => {
    const email = inviteEmail.trim();
    if (!email) return;
    inviteMember.mutate(
      { email, role: inviteRole },
      {
        onSuccess: () => {
          setShowInviteModal(false);
          setInviteEmail('');
          setInviteRole('Member');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader title="Members" />
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader title="Members" />
        <div className="flex-1 flex items-center justify-center p-6">
          <ErrorDisplay
            error={error}
            fallback="Failed to load members"
            title="Could not load members"
            onRetry={() => window.location.reload()}
            variant="full"
          />
        </div>
      </div>
    );
  }

  const currentUserMember = data?.find(
    (m) => m.userId === user?.id || m.user?.id === user?.id
  );
  const currentUserRole =
    currentUserMember?.role ??
    (currentUserMember as any)?.member?.role ??
    workspaceData?.workspace?.userRole ??
    '';
  const canManageMembers = ['owner', 'admin'].includes(currentUserRole?.toLowerCase());


  const canChangeRole = (member: WorkspaceMember) =>
    member.userId !== user?.id &&
    (currentUserRole?.toLowerCase() === 'owner' ||
      (currentUserRole?.toLowerCase() === 'admin' &&
        ['member', 'guest'].includes((member.role ?? '').toLowerCase())));

  const canRemoveMember = (member: WorkspaceMember) =>
    member.userId !== user?.id &&
    (currentUserRole?.toLowerCase() === 'owner' ||
      (currentUserRole?.toLowerCase() === 'admin' &&
        ['member', 'guest'].includes((member.role ?? '').toLowerCase())));

  const getRole = (member: WorkspaceMember) => member.role ?? (member as any).member?.role ?? '';
  const getDisplayName = (member: WorkspaceMember) =>
    member.user?.fullName || member.user?.email || 'Unknown';

  return (
    <div className="flex flex-col h-screen">
      <WorkspaceHeader title="Members" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Workspace Members</h2>
            {canManageMembers && (
              <Button onClick={() => setShowInviteModal(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite to Workspace
              </Button>
            )}
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="divide-y">
              {data?.map((member) => (
                <div
                  key={member.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {(getDisplayName(member).charAt(0) || '?').toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{getDisplayName(member)}</div>
                      <div className="text-sm text-gray-500">{member.user?.email ?? ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {member.userId === user?.id && currentUserRole?.toLowerCase() === 'owner' ? (
                      <>
                        <span className="px-3 py-1 bg-gray-100 rounded-md text-sm capitalize">
                          {getRole(member) || '—'}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowTransferModal(true)}
                          className="border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Transfer Ownership
                        </Button>
                      </>
                    ) : canManageMembers && canChangeRole(member) ? (
                      <>
                        <Select
                          value={getRole(member)}
                          onValueChange={(value: string) =>
                            handleRoleChange(member.userId ?? member.user?.id ?? '', value as MemberRole)
                          }
                        >
                          <SelectTrigger
                            className="w-[120px] h-8 cursor-pointer"
                            disabled={updateRole.isPending && updateRole.variables?.userId === member.userId}
                          >
                            <SelectValue placeholder="Role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Guest">Guest</SelectItem>
                            <SelectItem value="Member">Member</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        {canRemoveMember(member) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveMember(member.userId ?? member.user?.id ?? '')}
                            disabled={removeMember.isPending}
                          >
                            Remove
                          </Button>
                        )}
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 rounded-md text-sm capitalize">
                        {getRole(member) || '—'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Invite to Workspace Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Invite to Workspace</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Send an invitation email to add a user to this workspace.
            </p>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as MemberRole)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Guest">Guest</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail.trim() || inviteMember.isPending}
                className="flex-1"
              >
                {inviteMember.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Send Invite'
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail('');
                  setInviteRole('Member');
                }}
                disabled={inviteMember.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Ownership Modal */}
      {showTransferModal && (
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
                No admins available. Promote a member to admin first.
              </p>
            ) : (
              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                {adminMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setSelectedTransferTarget(member.userId)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      selectedTransferTarget === member.userId
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold shrink-0">
                      {(getDisplayName(member).charAt(0) || '?').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{getDisplayName(member)}</div>
                      <div className="text-sm text-gray-500 truncate">{member.user?.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                onClick={handleTransferOwnership}
                disabled={!selectedTransferTarget || adminMembers.length === 0 || isTransferring}
                className="flex-1 bg-purple-600 hover:bg-purple-700 cursor-pointer"
              >
                {isTransferring ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Transfer'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedTransferTarget(null);
                }}
                disabled={isTransferring}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
