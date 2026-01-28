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

interface ChannelNavbarProps {
  channelName: string;
  channelDescription?: string;
  isPrivate?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
  hasNotifications?: boolean;
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
}: ChannelNavbarProps) {
  const navBtn =
    'cursor-pointer hover:bg-gray-100 rounded-lg transition-colors';

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
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

        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isPrivate ? (
            <Lock className="w-5 h-5 text-gray-600 shrink-0" />
          ) : (
            <Hash className="w-5 h-5 text-gray-600 shrink-0" />
          )}
          <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">
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

        {channelDescription && (
          <>
            <div className="hidden md:block h-6 w-px bg-gray-200" />
            <p className="hidden lg:block text-sm text-gray-500 truncate max-w-md">
              {channelDescription}
            </p>
          </>
        )}
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
