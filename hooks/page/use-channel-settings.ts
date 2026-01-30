'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import {
  useChannel,
  useChannelMembers,
  useUpdateChannel,
  useDeleteChannel,
  useLeaveChannel,
  useInviteChannelMember,
  useRemoveChannelMember,
  ChannelMember,
} from '@/hooks/channel';
import { UpdateChannelDto } from '@/lib/api/channels';

export type { ChannelMember };

export function useChannelSettings() {
  const params = useParams();
  const { user } = useAuthStore();
  const channelId = params.id as string;

  // UI State
  const [isEditing, setIsEditing] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Queries
  const {
    data: channel,
    isLoading: isLoadingChannel,
    error: channelError,
  } = useChannel(channelId);

  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useChannelMembers(channelId);

  // Mutations
  const updateChannelMutation = useUpdateChannel(channelId);
  const deleteChannelMutation = useDeleteChannel(channelId);
  const leaveChannelMutation = useLeaveChannel(channelId);
  const inviteMemberMutation = useInviteChannelMember(channelId);
  const removeMemberMutation = useRemoveChannelMember(channelId);

  // Determine current user's role
  const currentUserMember = membersData?.members.find((m) => m.id === user?.id);
  const currentUserRole = currentUserMember?.role || 'member';
  const canEdit = currentUserRole === 'owner' || currentUserRole === 'admin';
  const canDelete = currentUserRole === 'owner';

  // Handlers
  const handleSave = (data: UpdateChannelDto) => {
    updateChannelMutation.mutate(data, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteMemberMutation.mutate(
      { email: inviteEmail.trim() },
      {
        onSuccess: () => setInviteEmail(''),
      }
    );
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
    channel,
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
