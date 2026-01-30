'use client';

import { useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { ChannelNavbar } from '@/components/workspace/channel-navbar';
import { useChannelSettings } from '@/hooks/use-channel-settings';
import {
  ChannelHeader,
  ChannelEditForm,
  InviteMemberForm,
  MembersList,
  DangerZone,
  DeleteChannelModal,
  LeaveChannelModal,
} from '@/components/channel';

export default function ChannelSettingsPage() {
  const {
    // Data
    channelId,
    channel,
    members,
    totalMembers,
    canEdit,
    canDelete,

    // Loading states
    isLoading,
    isSaving,
    isDeleting,
    isLeaving,
    isInviting,
    isRemovingMember,

    // Errors
    error,
    inviteError,

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
  } = useChannelSettings();

  // Local form state for editing
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsPrivate, setFormIsPrivate] = useState(false);

  // Initialize form when editing starts
  const startEditing = () => {
    if (channel) {
      setFormName(channel.name);
      setFormDescription(channel.description || '');
      setFormIsPrivate(channel.isPrivate);
    }
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const onSave = () => {
    handleSave({
      name: formName,
      description: formDescription,
      isPrivate: formIsPrivate,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <div className="animate-pulse h-6 w-32 bg-gray-200 rounded" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <span className="text-gray-600">Channel Settings</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-500">Failed to load channel</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen">
      <ChannelNavbar
        channelId={channelId}
        channelName={channel.name}
        channelDescription={channel.description}
        isPrivate={channel.isPrivate}
      />

      <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <ChannelHeader
              channel={channel}
              canEdit={canEdit}
              isEditing={isEditing}
              onToggleEdit={() => (isEditing ? cancelEditing() : startEditing())}
            />

            {isEditing ? (
              <ChannelEditForm
                name={formName}
                description={formDescription}
                isPrivate={formIsPrivate}
                isSaving={isSaving}
                onNameChange={setFormName}
                onDescriptionChange={setFormDescription}
                onIsPrivateChange={setFormIsPrivate}
                onSave={onSave}
                onCancel={cancelEditing}
              />
            ) : (
              <p className="text-gray-700">
                {channel.description || 'No description'}
              </p>
            )}
          </div>

          {/* Invite Members */}
          {canEdit && (
            <InviteMemberForm
              email={inviteEmail}
              isInviting={isInviting}
              error={inviteError as Error | null}
              onEmailChange={setInviteEmail}
              onSubmit={handleInvite}
            />
          )}

          {/* Members List */}
          <MembersList
            members={members}
            totalMembers={totalMembers}
            canEdit={canEdit}
            isRemovingMember={isRemovingMember}
            onRemoveMember={handleRemoveMember}
          />

          {/* Danger Zone */}
          <DangerZone
            canDelete={canDelete}
            onLeaveClick={() => setShowLeaveModal(true)}
            onDeleteClick={() => setShowDeleteModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <DeleteChannelModal
          channelName={channel.name}
          isDeleting={isDeleting}
          onConfirm={handleDeleteChannel}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {showLeaveModal && (
        <LeaveChannelModal
          channelName={channel.name}
          isLeaving={isLeaving}
          onConfirm={handleLeaveChannel}
          onCancel={() => setShowLeaveModal(false)}
        />
      )}
    </div>
  );
}
