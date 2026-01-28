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
  const handleStartCall = () => {
    console.log('Starting audio call...');
  };

  const handleStartVideo = () => {
    console.log('Starting video call...');
  };

  const handleTogglePin = () => {
    console.log('Toggle pinned messages...');
  };

  const handleNotifications = () => {
    console.log('Open notifications...');
  };

  const handleSearch = () => {
    console.log('Open search...');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        )}

        <div className="flex items-center gap-2 min-w-0 flex-1">
          {isPrivate ? (
            <Lock className="w-5 h-5 text-gray-600 flex-shrink-0" />
          ) : (
            <Hash className="w-5 h-5 text-gray-600 flex-shrink-0" />
          )}
          <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">
            {channelName}
          </h1>
        </div>

        <button
          onClick={onToggleFavorite}
          className="hidden sm:block p-1.5 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
          />
        </button>

        {channelDescription && (
          <>
            <div className="hidden md:block h-6 w-px bg-gray-200 flex-shrink-0" />
            <p className="hidden lg:block text-sm text-gray-500 truncate max-w-md">
              {channelDescription}
            </p>
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        <button
          onClick={handleStartCall}
          className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Start audio call"
        >
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={handleStartVideo}
          className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Start video call"
        >
          <Video className="w-5 h-5 text-gray-600" />
        </button>

        <div className="hidden md:block h-6 w-px bg-gray-200 mx-1" />

        <button
          onClick={handleTogglePin}
          className="hidden sm:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="View pinned messages"
        >
          <Pin className="w-5 h-5 text-gray-600" />
        </button>

        <button
          onClick={handleNotifications}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>

        <button
          onClick={handleSearch}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>

        {/* More options (3-dots) – mobile only, shadcn dropdown with remaining nav items */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="h-9 w-9 rounded-lg hover:bg-gray-100"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={4}
              className="min-w-[180px]"
            >
              <DropdownMenuItem onSelect={handleStartCall}>
                <Phone className="mr-2 h-4 w-4" />
                Start audio call
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={handleStartVideo}>
                <Video className="mr-2 h-4 w-4" />
                Start video call
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleTogglePin}>
                <Pin className="mr-2 h-4 w-4" />
                Pinned messages
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onToggleFavorite}>
                <Star
                  className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
                />
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}