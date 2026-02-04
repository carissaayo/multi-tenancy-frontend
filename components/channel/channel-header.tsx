'use client';

import { Hash, Lock, Edit2, X } from 'lucide-react';
import { Channel } from '@/lib/api/channels';

interface ChannelHeaderProps {
  channel: Channel;
  canEdit: boolean;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export function ChannelHeader({
  channel,
  canEdit,
  isEditing,
  onToggleEdit,
}: ChannelHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2 mb-4">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {channel.isPrivate ? (
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 shrink-0" />
        ) : (
          <Hash className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 shrink-0" />
        )}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
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
          onClick={onToggleEdit}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          {isEditing ? (
            <X className="w-5 h-5 text-gray-600" />
          ) : (
            <Edit2 className="w-5 h-5 text-gray-600" />
          )}
        </button>
      )}
    </div>
  );
}
