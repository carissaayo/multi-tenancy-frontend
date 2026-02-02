'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationsApi, type WorkspaceInvitation } from '@/lib/api/invitations';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/api-error';

// ============================================================================
// Query Keys
// ============================================================================

export const invitationKeys = {
  all: ['invitations'] as const,
  lists: () => [...invitationKeys.all, 'list'] as const,
};

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch workspace invitations. Requires owner/admin role (enforced by backend).
 */
export function useWorkspaceInvitations() {
  const { currentWorkspace } = useAuthStore();
  const workspaceId = currentWorkspace?.id;

  return useQuery({
    queryKey: invitationKeys.lists(),
    queryFn: async () => {
      const response = await invitationsApi.list();
      return response.invitations ?? [];
    },
    enabled: !!workspaceId,
  });
}

// ============================================================================
// Mutations
// ============================================================================

export function useRevokeInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => invitationsApi.revoke(invitationId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.lists() });
      toast.success(data?.message ?? 'Invitation revoked successfully', { duration: 3000 });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to revoke invitation'), { duration: 4000 });
    },
  });
}

export type { WorkspaceInvitation };
