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
          onClick={onToggleEdit}
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
  );
}
