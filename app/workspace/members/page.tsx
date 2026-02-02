'use client';

import { useWorkspaceMembers, useUpdateMemberRole, useRemoveMember, type MemberRole, type WorkspaceMember } from '@/hooks/members';
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

export default function MembersPage() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useWorkspaceMembers();
  const updateRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const handleRoleChange = (userId: string, newRole: MemberRole) => {
    updateRole.mutate({ userId, role: newRole });
  };

  const handleRemoveMember = (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    removeMember.mutate(userId);
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
  const canManageMembers = currentUserMember?.role === 'Owner' || currentUserMember?.role === 'Admin';

  // Owner can change anyone except self. Admin can change only Member/Guest.
  const canChangeRole = (member: WorkspaceMember) =>
    member.userId !== user?.id &&
    (currentUserMember?.role === 'Owner' ||
      (currentUserMember?.role === 'Admin' && (member.role === 'Member' || member.role === 'Guest')));

  // Owner can remove anyone except self. Admin can remove only Member/Guest (not Owner or other Admins).
  const canRemoveMember = (member: WorkspaceMember) =>
    member.userId !== user?.id &&
    (currentUserMember?.role === 'Owner' ||
      (currentUserMember?.role === 'Admin' && (member.role === 'Member' || member.role === 'Guest')));

  const getRole = (member: WorkspaceMember) => member.role ?? (member as any).member?.role ?? '';
  const getDisplayName = (member: WorkspaceMember) =>
    member.user?.fullName || member.user?.email || 'Unknown';

  return (
    <div className="flex flex-col h-screen">
      <WorkspaceHeader title="Members" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Workspace Members</h2>
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
                    {canManageMembers && member.userId !== user?.id && canChangeRole(member) ? (
                      <>
                        <Select
                          value={getRole(member)}
                          onValueChange={(value: string) =>
                            handleRoleChange(member.userId ?? member.user?.id ?? '', value as MemberRole)
                          }
                        >
                          <SelectTrigger
                            className="w-[120px] h-8"
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
    </div>
  );
}
