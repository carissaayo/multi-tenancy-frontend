'use client';

import {
  Hash,
  Lock,
  Star,
  Phone,
  Video,
  Pin,
  Bell,
  Search,
  MoreVertical,
  Menu,
  X,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useSidebarStore } from '@/store/sidebar-store';
import { useRouter } from 'next/navigation';

export interface TypingUser {
  id: string;
  username?: string;
  fullName?: string;
}

interface ChannelNavbarProps {
  channelName: string;
  channelDescription?: string;
  isPrivate?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  hasNotifications?: boolean;
  typingUsers?: TypingUser[]; 
  channelId: string;
}

export function ChannelNavbar({
  channelName,
  channelDescription,
  isPrivate = false,
  isFavorite = false,
  onToggleFavorite,
  onToggleSidebar,
  sidebarOpen = true,
  hasNotifications = false,
  typingUsers = [],
  channelId,
}: ChannelNavbarProps) {
  const { setSidebarOpen } = useSidebarStore();
  const router = useRouter();
  const navBtn =
    'cursor-pointer hover:bg-gray-100 rounded-lg transition-colors';


  const getDisplayName = (user: TypingUser) => {
    if (user.username) return user.username;
    if (user.fullName) return user.fullName.replace(/\s+/g, '');
    return 'Someone';
  };
  const redirectToSettings = () => {
    setSidebarOpen(false)
    router.push(`/workspace/channels/${channelId}/settings`);
  }


  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0 gap-2">
      {/* Left - Channel info */}
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className={`lg:hidden ${navBtn}`}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        )}

        <div className="flex items-center gap-2 min-w-0">
          {isPrivate ? (
            <Lock className="w-5 h-5 text-gray-600 shrink-0" />
          ) : (
            <Hash className="w-5 h-5 text-gray-600 shrink-0" />
          )}
          <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate max-w-[120px] sm:max-w-[200px] md:max-w-none hover:cursor-pointer" onClick={redirectToSettings}>
            {channelName}
          </h1>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFavorite}
          className={`hidden sm:flex ${navBtn}`}
          aria-label={
            isFavorite ? 'Remove from favorites' : 'Add to favorites'
          }
        >
          <Star
            className={`w-4 h-4 ${isFavorite
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-400'
              }`}
          />
        </Button>
      </div>

      {/* Center - Description or Typing indicator */}
      <div className="flex-1 min-w-0 flex justify-center">
        {typingUsers.length > 0 ? (
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span className="flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
            <span className="truncate max-w-[100px] sm:max-w-[200px]">
              {typingUsers.length === 1
                ? `${getDisplayName(typingUsers[0])} is typing...`
                : typingUsers.length === 2
                  ? `${getDisplayName(typingUsers[0])} and ${getDisplayName(typingUsers[1])} are typing...`
                  : `${getDisplayName(typingUsers[0])} and ${typingUsers.length - 1} others are typing...`}
            </span>
          </div>
        ) : channelDescription ? (
          <p className="hidden lg:block text-sm text-gray-500 truncate max-w-md">
            {channelDescription}
          </p>
        ) : null}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className={`hidden md:flex ${navBtn}`}
          aria-label="Start audio call"
        >
          <Phone className="w-5 h-5 text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`hidden md:flex ${navBtn}`}
          aria-label="Start video call"
        >
          <Video className="w-5 h-5 text-gray-600" />
        </Button>

        <div className="hidden md:block h-6 w-px bg-gray-200 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className={`hidden sm:flex ${navBtn}`}
          aria-label="Pinned messages"
        >
          <Pin className="w-5 h-5 text-gray-600" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={`relative ${navBtn}`}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={navBtn}
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </Button>

        {/* Mobile overflow */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={navBtn}
                aria-label="More options"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={4}>
              <DropdownMenuItem className='hover:cursor-pointer'>
                <Phone className="mr-2 h-4 w-4" />
                Start audio call
              </DropdownMenuItem>
              <DropdownMenuItem className='hover:cursor-pointer'>
                <Video className="mr-2 h-4 w-4" />
                Start video call
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='hover:cursor-pointer'>
                <Pin className="mr-2 h-4 w-4" />
                Pinned messages
              </DropdownMenuItem>
              <DropdownMenuItem className='hover:cursor-pointer'>
                <Star
                  className={`mr-2 h-4 w-4 ${isFavorite
                      ? 'fill-yellow-400 text-yellow-400'
                      : ''
                    }`}
                />
                {isFavorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
