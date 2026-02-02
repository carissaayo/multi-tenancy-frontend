import { apiClient } from './client';

export interface AcceptInvitationResponse {
  message: string;
  workspace: {
    id: string;
    slug: string;
    name: string;
  };
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
};
