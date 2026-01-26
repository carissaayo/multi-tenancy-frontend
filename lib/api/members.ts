import { apiClient } from './client';

export type MemberRole = 'Owner' | 'Admin' | 'Member' | 'Guest';

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: MemberRole;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
    phoneNumber?: string;
  };
}

export interface UpdateMemberRoleDto {
  role: MemberRole;
}

export interface MembersResponse {
  members: WorkspaceMember[];
}

export const membersApi = {
  list: async (): Promise<MembersResponse> => {
    const response = await apiClient.instance.get('/members');
    return response.data;
  },

  updateRole: async (userId: string, data: UpdateMemberRoleDto): Promise<{ member: WorkspaceMember }> => {
    const response = await apiClient.instance.patch(`/management/members/role`, {
      userId,
      ...data,
    });
    return response.data;
  },

  remove: async (userId: string): Promise<void> => {
    await apiClient.instance.delete('/management/members/remove', {
      data: { userId },
    });
  },
};
