'use client';

import { useQuery } from '@tanstack/react-query';
import { membersApi, WorkspaceMember } from '@/lib/api/members';

// ============================================================================
// Query Keys
// ============================================================================

export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...memberKeys.lists(), filters] as const,
};

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch all workspace members
 */
export function useWorkspaceMembers() {
  return useQuery({
    queryKey: memberKeys.lists(),
    queryFn: async () => {
      const response = await membersApi.list();
      return response.members;
    },
  });
}

export type { WorkspaceMember };
