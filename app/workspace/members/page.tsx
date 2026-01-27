'use client';

import { useQuery } from '@tanstack/react-query';
import { membersApi, MemberRole } from '@/lib/api/members';
import { WorkspaceHeader } from '@/components/workspace/channel-navbar';
import { useAuthStore } from '@/store/auth-store';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function MembersPage() {
  const { user } = useAuthStore();
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      const response = await membersApi.list();
      return response.members;
    },
  });

  const handleRoleChange = async (userId: string, newRole: MemberRole) => {
    setUpdatingRole(userId);
    try {
      await membersApi.updateRole(userId, { role: newRole });
      queryClient.invalidateQueries({ queryKey: ['members'] });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    
    try {
      await membersApi.remove(userId);
      queryClient.invalidateQueries({ queryKey: ['members'] });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader />
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
        <WorkspaceHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">Failed to load members</div>
        </div>
      </div>
    );
  }

  const currentUserMember = data?.find((m) => m.userId === user?.id);
  const canManageMembers = currentUserMember?.role === 'Owner' || currentUserMember?.role === 'Admin';

  return (
    <div className="flex flex-col h-screen">
      <WorkspaceHeader />
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
                      {member.user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{member.user.fullName}</div>
                      <div className="text-sm text-gray-500">{member.user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {canManageMembers && member.userId !== user?.id ? (
                      <>
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.userId, e.target.value as MemberRole)}
                          disabled={updatingRole === member.userId}
                          className="px-3 py-1 border rounded-md"
                        >
                          <option value="Guest">Guest</option>
                          <option value="Member">Member</option>
                          <option value="Admin">Admin</option>
                          {currentUserMember?.role === 'Owner' && (
                            <option value="Owner">Owner</option>
                          )}
                        </select>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveMember(member.userId)}
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 rounded-md text-sm">
                        {member.role}
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
