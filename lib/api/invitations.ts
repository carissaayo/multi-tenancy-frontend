import { apiClient } from './client';

export interface AcceptInvitationResponse {
  message: string;
  workspace: {
    id: string;
    slug: string;
    name: string;
  };
}

/** Workspace invitation status from backend */
export type WorkspaceInvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

/** Workspace invitation role from backend */
export type WorkspaceInvitationRole = 'member' | 'admin' | 'guest';

/** Invitation item from list API */
export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  role: WorkspaceInvitationRole;
  status: WorkspaceInvitationStatus;
  invitedAt: string;
  expiresAt: string;
  acceptedAt?: string | null;
  revokedAt?: string | null;
  invitedBy?: {
    id: string;
    fullName?: string | null;
    email: string;
  } | null;
}

export interface ListInvitationsResponse {
  invitations: WorkspaceInvitation[];
  total?: number;
}

export const invitationsApi = {
  /** Accept a workspace invitation by token. Requires auth. */
  accept: async (token: string): Promise<AcceptInvitationResponse> => {
    const response = await apiClient.instance.patch<AcceptInvitationResponse>(
      '/invitations/accept',
      undefined,
      { params: { token } }
    );
    return response.data;
  },

  /** List workspace invitations. Workspace-scoped (subdomain). Owner/Admin only. */
  list: async (): Promise<ListInvitationsResponse> => {
    const response = await apiClient.instance.get<ListInvitationsResponse>('/invitations');
    return response.data;
  },

  /** Revoke a pending invitation. Workspace-scoped (subdomain). Owner/Admin only. */
  revoke: async (invitationId: string): Promise<{ message: string }> => {
    const response = await apiClient.instance.patch<{ message: string }>(
      `/invitations/${invitationId}/revoke`
    );
    return response.data;
  },
};
