'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { channelsApi, ChannelMemberData, UpdateChannelDto } from '@/lib/api/channels';
import { useAuthStore } from '@/store/auth-store';

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

function transformMember(data: ChannelMemberData): ChannelMember {
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

export function useChannelSettings() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const channelId = params.id as string;

  // UI State
  const [isEditing, setIsEditing] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Fetch channel data
  const {
    data: channelData,
    isLoading: isLoadingChannel,
    error: channelError,
  } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: async () => {
      const response = await channelsApi.get(channelId);
      return response.channel;
    },
    enabled: !!channelId,
  });

  // Fetch channel members
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useQuery({
    queryKey: ['channel-members', channelId],
    queryFn: async () => {
      const response = await channelsApi.getMembers(channelId);
      return {
        members: response.channelMembers.map(transformMember),
        total: response.totalChannelMembers,
      };
    },
    enabled: !!channelId,
  });

  // Determine current user's role
  const currentUserMember = membersData?.members.find(m => m.id === user?.id);
  const currentUserRole = currentUserMember?.role || 'member';
  const canEdit = currentUserRole === 'owner' || currentUserRole === 'admin';
  const canDelete = currentUserRole === 'owner';

  // Update channel mutation
  const updateChannelMutation = useMutation({
    mutationFn: (data: UpdateChannelDto) => channelsApi.update(channelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel', channelId] });
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      setIsEditing(false);
    },
  });

  // Delete channel mutation
  const deleteChannelMutation = useMutation({
    mutationFn: () => channelsApi.delete(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      router.push('/workspace');
    },
  });

  // Leave channel mutation
  const leaveChannelMutation = useMutation({
    mutationFn: () => channelsApi.leave(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
      queryClient.invalidateQueries({ queryKey: ['channel-members', channelId] });
      router.push('/workspace');
    },
  });

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    mutationFn: (email: string) => channelsApi.inviteMember(channelId, { email }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel-members', channelId] });
      setInviteEmail('');
    },
  });

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) => channelsApi.removeMember(channelId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channel-members', channelId] });
    },
  });

  // Handlers
  const handleSave = (data: UpdateChannelDto) => {
    updateChannelMutation.mutate(data);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteMemberMutation.mutate(inviteEmail.trim());
  };

  const handleDeleteChannel = () => {
    deleteChannelMutation.mutate();
  };

  const handleLeaveChannel = () => {
    leaveChannelMutation.mutate();
  };

  const handleRemoveMember = (memberId: string) => {
    removeMemberMutation.mutate(memberId);
  };

  return {
    // Data
    channelId,
    channel: channelData,
    members: membersData?.members || [],
    totalMembers: membersData?.total || 0,
    currentUserRole,
    canEdit,
    canDelete,

    // Loading states
    isLoading: isLoadingChannel || isLoadingMembers,
    isLoadingChannel,
    isLoadingMembers,
    isSaving: updateChannelMutation.isPending,
    isDeleting: deleteChannelMutation.isPending,
    isLeaving: leaveChannelMutation.isPending,
    isInviting: inviteMemberMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,

    // Errors
    error: channelError || membersError,
    updateError: updateChannelMutation.error,
    inviteError: inviteMemberMutation.error,

    // UI State
    isEditing,
    setIsEditing,
    inviteEmail,
    setInviteEmail,
    showDeleteModal,
    setShowDeleteModal,
    showLeaveModal,
    setShowLeaveModal,

    // Handlers
    handleSave,
    handleInvite,
    handleDeleteChannel,
    handleLeaveChannel,
    handleRemoveMember,
  };
}
