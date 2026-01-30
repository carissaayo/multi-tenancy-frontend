import { apiClient } from './client';

export interface Channel {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  unreadCount?: number;
}

export interface CreateChannelDto {
  name: string;
  description?: string;
  isPrivate?: boolean;
}

export interface UpdateChannelDto {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

export interface ChannelResponse {
  channel: Channel;
}

export interface ChannelsResponse {
  channels: Channel[];
}

export interface ChannelMemberData {
  channelMember: {
    id: string;
    channelId: string;
    memberId: string;
    joinedAt: string;
  };
  member: {
    id: string;
    userId: string;
    role: 'owner' | 'admin' | 'member';
    isActive: boolean;
    joinedAt: string;
  };
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl: string | null;
    isEmailVerified: boolean;
  };
}

export interface ChannelMembersResponse {
  message: string;
  channelMembers: ChannelMemberData[];
  totalChannelMembers: number;
}

export interface RemoveMemberResponse {
  message: string;
}

export interface InviteMemberDto {
  email: string;
}

export const channelsApi = {
  list: async (): Promise<ChannelsResponse> => {
    const response = await apiClient.instance.get('/channels');
    return response.data;
  },

  get: async (id: string): Promise<ChannelResponse> => {
    const response = await apiClient.instance.get(`/channels/${id}`);
    return response.data;
  },

  create: async (data: CreateChannelDto): Promise<ChannelResponse> => {
    const response = await apiClient.instance.post('/channels', data);
    return response.data;
  },

  update: async (id: string, data: UpdateChannelDto): Promise<ChannelResponse> => {
    const response = await apiClient.instance.patch(`/channels/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.instance.delete(`/channels/${id}`);
  },

  join: async (id: string): Promise<ChannelResponse> => {
    const response = await apiClient.instance.patch(`/channels/${id}/join`);
    return response.data;
  },

  leave: async (id: string): Promise<void> => {
    await apiClient.instance.patch(`/channels/${id}/leave`);
  },

  getMembers: async (id: string): Promise<ChannelMembersResponse> => {
    const response = await apiClient.instance.get(`/channels/${id}/members`);
    return response.data;
  },

  inviteMember: async (channelId: string, data: InviteMemberDto): Promise<{ message: string }> => {
    const response = await apiClient.instance.post(`/channels/${channelId}/invite`, data);
    return response.data;
  },

  removeMember: async (channelId: string, memberId: string): Promise<RemoveMemberResponse> => {
    const response = await apiClient.instance.delete(`/channels/${channelId}/members/${memberId}`);
    return response.data;
  },
};
