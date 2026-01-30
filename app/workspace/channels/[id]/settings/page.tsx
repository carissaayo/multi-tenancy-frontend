'use client';

import { useState } from 'react';
import {
  Hash,
  Lock,
  Users,
  Mail,
  LogOut,
  Trash2,
  Edit2,
  X,
  Check,
  Plus,
  Crown,
  Shield,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';
import { ChannelNavbar } from '@/components/workspace/channel-navbar';
import { useChannelSettings, ChannelMember } from '@/hooks/use-channel-settings';

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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (userId: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-teal-500 to-teal-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
    ];
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
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
          {/* Header */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {channel.isPrivate ? (
                  <Lock className="w-8 h-8 text-gray-600" />
                ) : (
                  <Hash className="w-8 h-8 text-gray-600" />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {channel.isPrivate ? '' : '#'}
                    {channel.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {channel.isPrivate ? 'Private Channel' : 'Public Channel'}
                  </p>
                </div>
              </div>
              {canEdit && (
                <button
                  onClick={() => (isEditing ? cancelEditing() : startEditing())}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isEditing ? (
                    <X className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Edit2 className="w-5 h-5 text-gray-600" />
                  )}
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Channel Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={formIsPrivate}
                    onChange={(e) => setFormIsPrivate(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="private" className="text-sm text-gray-700">
                    Make this channel private
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">
                {channel.description || 'No description'}
              </p>
            )}
          </div>

          {/* Invite Members */}
          {canEdit && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Invite Members</h2>
              </div>
              <form onSubmit={handleInvite} className="flex gap-3">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={isInviting || !inviteEmail.trim()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isInviting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Invite
                </button>
              </form>
              {inviteError && (
                <p className="mt-2 text-sm text-red-500">
                  {(inviteError as Error).message || 'Failed to send invite'}
                </p>
              )}
            </div>
          )}

          {/* Members List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Members ({totalMembers})
                </h2>
              </div>
            </div>
            <div className="space-y-3">
              {members.map((member: ChannelMember) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {member.avatarUrl ? (
                      <Image
                        src={member.avatarUrl}
                        alt={member.fullName}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(member.id)} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}
                      >
                        {getInitials(member.fullName)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {member.fullName}
                        </p>
                        {getRoleIcon(member.role)}
                        <span className="text-xs text-gray-500 capitalize">
                          {member.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  {canEdit && member.role !== 'owner' && (
                    <button
                      onClick={() => handleRemoveMember(member.memberId)}
                      disabled={isRemovingMember}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isRemovingMember ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Leave Channel</h3>
                  <p className="text-sm text-gray-500">
                    You will no longer have access to this channel
                  </p>
                </div>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Leave
                </button>
              </div>

              {canDelete && (
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h3 className="font-semibold text-red-600">Delete Channel</h3>
                    <p className="text-sm text-red-500">
                      Permanently delete this channel and all its messages
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Channel?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>#{channel.name}</strong>?
              This action cannot be undone and all messages will be permanently
              deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteChannel}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete Channel
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Confirmation Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Leave Channel?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to leave <strong>#{channel.name}</strong>?
              You&apos;ll need to be re-invited to access this channel again.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLeaveChannel}
                disabled={isLeaving}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLeaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Leave Channel
              </button>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
