'use client';

import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  channelsApi,
  ChannelMemberData,
  CreateChannelDto,
  UpdateChannelDto,
  AddChannelMemberDto,
} from '@/lib/api/channels';
import { getErrorMessage } from '@/lib/utils/api-error';

// ============================================================================
// Types
// ============================================================================

export interface ChannelMember {
  id: string;
  memberId: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
  isActive: boolean;
}

// ============================================================================
// Transformers
// ============================================================================

export function transformMember(data: ChannelMemberData): ChannelMember {
  return {
    id: data.user.id,
    memberId: data.member.id,
    fullName: data.user.fullName,
    email: data.user.email,
    avatarUrl: data.user.avatarUrl,
    role: data.member.role,
    joinedAt: data.channelMember.joinedAt,
    isActive: data.member.isActive,
  };
}

// ============================================================================
// Query Keys
// ============================================================================

export const channelKeys = {
  all: ['channels'] as const,
  lists: () => [...channelKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...channelKeys.lists(), filters] as const,
  details: () => [...channelKeys.all, 'detail'] as const,
  detail: (id: string) => [...channelKeys.details(), id] as const,
  members: (channelId: string) => ['channel-members', channelId] as const,
};

// ============================================================================
// Queries
// ============================================================================

/**
 * Fetch all channels
 */
export function useChannels() {
  return useQuery({
    queryKey: channelKeys.lists(),
    queryFn: async () => {
      const response = await channelsApi.list();
      return response.channels;
    },
  });
}

/**
 * Fetch a single channel by ID
 */
export function useChannel(channelId: string | null) {
  return useQuery({
    queryKey: channelKeys.detail(channelId!),
    queryFn: async () => {
      const response = await channelsApi.get(channelId!);
      return response.channel;
    },
    enabled: !!channelId,
  });
}

/**
 * Fetch channel members
 */
export function useChannelMembers(channelId: string | null) {
  return useQuery({
    queryKey: channelKeys.members(channelId!),
    queryFn: async () => {
      const response = await channelsApi.getMembers(channelId!);
      return {
        members: response.channelMembers.map(transformMember),
        total: response.totalChannelMembers,
      };
    },
    enabled: !!channelId,
  });
}

// ============================================================================
// Mutations
// ============================================================================

/**
 * Create a new channel
 */
export function useCreateChannel() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateChannelDto) => channelsApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.all });
      router.push(`/workspace/channels/${response.channel.id}`);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to create channel'), { duration: 4000 });
    },
  });
}

/**
 * Update a channel
 */
export function useUpdateChannel(channelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateChannelDto) => channelsApi.update(channelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) });
      queryClient.invalidateQueries({ queryKey: channelKeys.all });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to update channel'), { duration: 4000 });
    },
  });
}

/**
 * Delete a channel
 */
export function useDeleteChannel(channelId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => channelsApi.delete(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.all });
      router.push('/workspace');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to delete channel'), { duration: 4000 });
    },
  });
}

/**
 * Join a channel
 */
export function useJoinChannel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) => channelsApi.join(channelId),
    onSuccess: (_, channelId) => {
      queryClient.invalidateQueries({ queryKey: channelKeys.detail(channelId) });
      queryClient.invalidateQueries({ queryKey: channelKeys.members(channelId) });
      queryClient.invalidateQueries({ queryKey: channelKeys.all });
    },
  });
}

/**
 * Leave a channel
 */
export function useLeaveChannel(channelId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => channelsApi.leave(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.all });
      queryClient.invalidateQueries({ queryKey: channelKeys.members(channelId) });
      router.push('/workspace');
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to leave channel'), { duration: 4000 });
    },
  });
}

/**
 * Add a workspace member to a channel
 */
export function useAddChannelMember(channelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddChannelMemberDto) => channelsApi.addMember(channelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.members(channelId) });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to add member'), { duration: 4000 });
    },
  });
}

/**
 * Remove a member from a channel
 */
export function useRemoveChannelMember(channelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => channelsApi.removeMember(channelId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: channelKeys.members(channelId) });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, 'Failed to remove member'), { duration: 4000 });
    },
  });
}
