import { apiClient } from './client';

export type MemberRole = 'Owner' | 'Admin' | 'Member' | 'Guest';

/** Raw item from API - nested { member, user } structure */
export interface RawWorkspaceMemberItem {
  member: {
    id: string;
    userId: string;
    role: string;
    isActive: boolean;
    joinedAt: string;
  };
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string | null;
    isEmailVerified?: boolean;
  };
}

/** Normalized shape used in the app */
export interface WorkspaceMember {
  id: string;
  userId: string;
  role: MemberRole;
  joinedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
  };
}

export interface UpdateMemberRoleDto {
  role: MemberRole;
}

export interface MembersResponse {
  members: RawWorkspaceMemberItem[];
}

function normalizeRole(role: string): MemberRole {
  const r = role?.toLowerCase() || '';
  if (r === 'owner') return 'Owner';
  if (r === 'admin') return 'Admin';
  if (r === 'member') return 'Member';
  if (r === 'guest') return 'Guest';
  return role as MemberRole;
}

/** Transform raw API response to normalized WorkspaceMember */
export function normalizeWorkspaceMember(raw: RawWorkspaceMemberItem): WorkspaceMember {
  const { member, user } = raw;
  return {
    id: member.id,
    userId: member.userId,
    role: normalizeRole(member.role),
    joinedAt: member.joinedAt,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl ?? undefined,
    },
  };
}

export const membersApi = {
  list: async (workspaceId: string): Promise<MembersResponse> => {
    const response = await apiClient.instance.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  },

  updateRole: async (targetUserId: string, data: UpdateMemberRoleDto): Promise<{ member: WorkspaceMember }> => {
    const response = await apiClient.instance.patch(`/management/members/role`, {
      targetUserId,
      newRole: data.role.toLowerCase(),
    });
    return response.data;
  },

  remove: async (userId: string): Promise<void> => {
    await apiClient.instance.delete('/management/members/remove', {
      data: { userId },
    });
  },

  /** Invite a user to the workspace by email. Sends invitation email. */
  invite: async (email: string, role?: MemberRole): Promise<{ message: string }> => {
    const body = role ? { email, role: role.toLowerCase() } : { email };
    const response = await apiClient.instance.post<{ message: string }>(
      '/management/invitations',
      body
    );
    return response.data;
  },
};
