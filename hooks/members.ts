'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membersApi, WorkspaceMember, MemberRole, normalizeWorkspaceMember } from '@/lib/api/members';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/api-error';

// ============================================================================
// Query Keys
// ============================================================================

export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (workspaceId: string) => [...memberKeys.lists(), workspaceId] as const,
};

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch all workspace members
 */
export function useWorkspaceMembers() {
  const { currentWorkspace } = useAuthStore();
  const workspaceId = currentWorkspace?.id;

  return useQuery({
    queryKey: memberKeys.list(workspaceId || ''),
    queryFn: async () => {
      if (!workspaceId) throw new Error('No workspace selected');
      const response = await membersApi.list(workspaceId);
      const members = response.members ?? [];
      return members.map(normalizeWorkspaceMember);
    },
    enabled: !!workspaceId,
  });
}

// ============================================================================
// Mutations
// ============================================================================

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useAuthStore();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: MemberRole }) =>
      membersApi.updateRole(userId, { role }),
    onSuccess: () => {
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: memberKeys.list(workspaceId) });
      }
      toast.success('Role updated successfully', { duration: 3000 });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update role'), { duration: 4000 });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useAuthStore();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: (userId: string) => membersApi.remove(userId),
    onSuccess: () => {
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: memberKeys.list(workspaceId) });
      }
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to remove member'), { duration: 4000 });
    },
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();
  const { currentWorkspace } = useAuthStore();
  const workspaceId = currentWorkspace?.id;

  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: MemberRole }) =>
      membersApi.invite(email, role),
    onSuccess: (data) => {
      if (workspaceId) {
        queryClient.invalidateQueries({ queryKey: memberKeys.list(workspaceId) });
      }
      toast.success(data?.message ?? 'Invitation sent successfully', { duration: 4000 });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to send invitation'), { duration: 4000 });
    },
  });
}

export type { WorkspaceMember, MemberRole };
