'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Channel } from '@/lib/api/channels';

interface ChannelItemProps {
  channel: Channel;
}

export function ChannelItem({ channel }: ChannelItemProps) {
  const pathname = usePathname();
  const isActive = pathname === `/workspace/channels/${channel.id}`;

  return (
    <Link
      href={`/workspace/channels/${channel.id}`}
      className={`block px-3 py-2 rounded-md mb-1 transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-900 font-medium'
          : 'hover:bg-gray-100 text-gray-700'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">#</span>
          <span className="truncate">{channel.name}</span>
          {channel.isPrivate && (
            <span className="text-xs text-gray-500" title="Private channel">
              🔒
            </span>
          )}
        </div>
        {channel.unreadCount && channel.unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
            {channel.unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
}
