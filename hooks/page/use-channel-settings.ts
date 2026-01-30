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
  useAddChannelMember,
  useRemoveChannelMember,
  ChannelMember,
} from '@/hooks/channel';
import { useWorkspaceMembers } from '@/hooks/members';
import { UpdateChannelDto } from '@/lib/api/channels';

export type { ChannelMember };

export function useChannelSettings() {
  const params = useParams();
  const { user } = useAuthStore();
  const channelId = params.id as string;

  // UI State
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);

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

  const {
    data: workspaceMembers,
    isLoading: isLoadingWorkspaceMembers,
  } = useWorkspaceMembers();

  // Mutations
  const updateChannelMutation = useUpdateChannel(channelId);
  const deleteChannelMutation = useDeleteChannel(channelId);
  const leaveChannelMutation = useLeaveChannel(channelId);
  const addMemberMutation = useAddChannelMember(channelId);
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

  const handleAddMember = (memberId: string) => {
    addMemberMutation.mutate(
      { memberId },
      {
        onSuccess: () => {
          // Keep modal open to allow adding more members
        },
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
    workspaceMembers: workspaceMembers || [],
    currentUserId: user?.id || '',
    currentUserRole,
    canEdit,
    canDelete,

    // Loading states
    isLoading: isLoadingChannel || isLoadingMembers,
    isLoadingChannel,
    isLoadingMembers,
    isLoadingWorkspaceMembers,
    isSaving: updateChannelMutation.isPending,
    isDeleting: deleteChannelMutation.isPending,
    isLeaving: leaveChannelMutation.isPending,
    isAddingMember: addMemberMutation.isPending,
    isRemovingMember: removeMemberMutation.isPending,

    // Errors
    error: channelError || membersError,
    updateError: updateChannelMutation.error,
    addMemberError: addMemberMutation.error,

    // UI State
    isEditing,
    setIsEditing,
    showDeleteModal,
    setShowDeleteModal,
    showLeaveModal,
    setShowLeaveModal,
    showMemberPicker,
    setShowMemberPicker,

    // Handlers
    handleSave,
    handleAddMember,
    handleDeleteChannel,
    handleLeaveChannel,
    handleRemoveMember,
  };
}
