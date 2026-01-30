'use client';

import { useQuery } from '@tanstack/react-query';
import { membersApi, WorkspaceMember } from '@/lib/api/members';
import { useAuthStore } from '@/store/auth-store';

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
      return response.members;
    },
    enabled: !!workspaceId,
  });
}

export type { WorkspaceMember };
