'use client';

import { useState, useMemo } from 'react';
import { X, Search, Loader2, UserPlus, Check } from 'lucide-react';
import Image from 'next/image';
import { WorkspaceMember } from '@/lib/api/members';
import { ChannelMember } from '@/hooks/channel';

interface MemberPickerModalProps {
  workspaceMembers: WorkspaceMember[];
  channelMembers: ChannelMember[];
  currentUserId: string;
  isLoading: boolean;
  isAdding: boolean;
  onAddMember: (memberId: string) => void;
  onClose: () => void;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(userId: string) {
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
}

export function MemberPickerModal({
  workspaceMembers,
  channelMembers,
  currentUserId,
  isLoading,
  isAdding,
  onAddMember,
  onClose,
}: MemberPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);

  // Get IDs of members already in the channel
  const channelMemberIds = useMemo(
    () => new Set(channelMembers.map((m) => m.id)),
    [channelMembers]
  );

  // Filter available members:
  // - Not already in the channel
  // - Not the current user
  // - Matches search query
  const availableMembers = useMemo(() => {
    return workspaceMembers.filter((member) => {
      // Exclude current user
      if (member.user.id === currentUserId) return false;
      // Exclude members already in the channel
      if (channelMemberIds.has(member.user.id)) return false;
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          member.user.fullName.toLowerCase().includes(query) ||
          member.user.email.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [workspaceMembers, channelMemberIds, currentUserId, searchQuery]);

  const handleAddMember = (member: WorkspaceMember) => {
    // Workspace member ID: flat structure uses member.id, nested uses member.member?.id
    const memberId = member.id ?? (member as { member?: { id: string } }).member?.id;
    if (!memberId || typeof memberId !== 'string') return;
    setAddingMemberId(memberId);
    onAddMember(memberId);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">Add Members</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspace members..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : availableMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchQuery
                ? 'No members found matching your search'
                : 'All workspace members are already in this channel'}
            </div>
          ) : (
            <div className="space-y-2">
              {availableMembers.map((member) => {
                const memberId = member.id ?? (member as { member?: { id: string } }).member?.id;
                const isAddingThis = isAdding && addingMemberId === memberId;
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {member.user.avatarUrl ? (
                        <Image
                          src={member.user.avatarUrl}
                          alt={member.user.fullName}
                          width={40}
                          height={40}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div
                          className={`w-10 h-10 bg-gradient-to-br ${getAvatarColor(member.user.id)} rounded-lg flex items-center justify-center text-white font-semibold text-sm`}
                        >
                          {getInitials(member.user.fullName)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {member.user.fullName}
                        </p>
                        <p className="text-sm text-gray-500">{member.user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddMember(member)}
                      disabled={isAdding}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm"
                    >
                      {isAddingThis ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Add
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-sm text-gray-500 text-center">
            {availableMembers.length} member{availableMembers.length !== 1 ? 's' : ''} available to add
          </p>
        </div>
      </div>
    </div>
  );
}
