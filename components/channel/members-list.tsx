'use client';

import { Users, X, Crown, Shield, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { ChannelMember } from '@/hooks/use-channel-settings';

interface MembersListProps {
  members: ChannelMember[];
  totalMembers: number;
  canEdit: boolean;
  isRemovingMember: boolean;
  onRemoveMember: (memberId: string) => void;
}

function getRoleIcon(role: string) {
  switch (role) {
    case 'owner':
      return <Crown className="w-4 h-4 text-yellow-500" />;
    case 'admin':
      return <Shield className="w-4 h-4 text-blue-500" />;
    default:
      return null;
  }
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

export function MembersList({
  members,
  totalMembers,
  canEdit,
  isRemovingMember,
  onRemoveMember,
}: MembersListProps) {
  return (
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
        {members.map((member) => (
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
                onClick={() => onRemoveMember(member.memberId)}
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
  );
}
