'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Channel } from '@/lib/api/channels';
import { Hash, Lock } from 'lucide-react';

interface ChannelItemProps {
  channel: Channel;
}

export function ChannelItem({ channel }: ChannelItemProps) {
  const pathname = usePathname();
  const isActive = pathname === `/workspace/channels/${channel.id}`;

  return (
    <Link
      href={`/workspace/channels/${channel.id}`}
      className={`
        w-full flex items-center justify-between px-3 py-2 rounded-lg 
        transition-colors text-sm group
        ${isActive
          ? 'bg-purple-700/50 text-white'
          : 'hover:bg-purple-700/30 text-purple-100'
        }
      `}
    >
      <div className="flex items-center gap-2 min-w-0">
        {channel.isPrivate ? (
          <Lock className="w-4 h-4 shrink-0" />
        ) : (
          <Hash className="w-4 h-4 shrink-0" />
        )}
        <span className="truncate">{channel.name}</span>
      </div>

      {channel.unreadCount && channel.unreadCount > 0 && (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
          {channel.unreadCount}
        </span>
      )}
    </Link>
  );
}