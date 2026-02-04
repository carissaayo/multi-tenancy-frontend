'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitationsApi, type WorkspaceInvitation, type UserPendingInvitation } from '@/lib/api/invitations';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/api-error';

// ============================================================================
// Query Keys
// ============================================================================

export const invitationKeys = {
  all: ['invitations'] as const,
  lists: () => [...invitationKeys.all, 'list'] as const,
  myPending: () => [...invitationKeys.all, 'my-pending'] as const,
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

/**
 * Fetch pending invitations for the current user (invitations sent to their email).
 * Useful when email sending is unavailable (e.g., Render free tier).
 */
export function useMyPendingInvitations() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: invitationKeys.myPending(),
    queryFn: async () => {
      const response = await invitationsApi.getMyPendingInvitations();
      return response.invitations ?? [];
    },
    enabled: isAuthenticated,
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

/**
 * Accept an invitation by ID (for UI-based acceptance without email link).
 */
export function useAcceptInvitationById() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) => invitationsApi.acceptById(invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.myPending() });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to accept invitation'), { duration: 4000 });
    },
  });
}

/**
 * Accept an invitation by token. Uses the same endpoint as the email link (PATCH /invitations/accept?token=...).
 * Use this when the invitation object includes a token (e.g. from GET /invitations/me) to avoid workspace-scoped routing.
 */
export function useAcceptInvitationByToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => invitationsApi.accept(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: invitationKeys.myPending() });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to accept invitation'), { duration: 4000 });
    },
  });
}

export type { WorkspaceInvitation, UserPendingInvitation };
