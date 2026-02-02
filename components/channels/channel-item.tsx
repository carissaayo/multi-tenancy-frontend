'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Hash, Lock } from 'lucide-react';

import { Channel } from '@/lib/api/channels';
import { useSidebarStore } from '@/store/sidebar-store';


interface ChannelItemProps {
  channel: Channel;
  /** When true, disables navigation (e.g. workspace deactivated) */
  disabled?: boolean;
}

export function ChannelItem({ channel, disabled = false }: ChannelItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setSidebarOpen } = useSidebarStore();
  const isActive = pathname === `/workspace/channels/${channel.id}`;

  const handleClick = () => {
    if (disabled) return;
    setSidebarOpen(false);
    router.push(`/workspace/channels/${channel.id}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
      w-full flex items-center justify-between px-3 py-2 rounded-lg 
      transition-colors text-sm group
      ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none text-purple-100' : 'cursor-pointer'}
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
    </button>
  );
}