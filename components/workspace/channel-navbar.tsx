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
  X
} from 'lucide-react';

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
  hasNotifications = false
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

  const handleMoreOptions = () => {
    console.log('Open more options...');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}

        {/* Channel Info */}
        <div className="flex items-center gap-2">
          {isPrivate ? (
            <Lock className="w-5 h-5 text-gray-600" />
          ) : (
            <Hash className="w-5 h-5 text-gray-600" />
          )}
          <h1 className="text-xl font-bold text-gray-900">{channelName}</h1>
        </div>

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
          />
        </button>

        {/* Divider */}
        {channelDescription && (
          <>
            <div className="h-6 w-px bg-gray-200"></div>

            {/* Channel Description */}
            <p className="text-sm text-gray-500 hidden md:block truncate max-w-md">
              {channelDescription}
            </p>
          </>
        )}
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Call Buttons */}
        <button
          onClick={handleStartCall}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Start audio call"
        >
          <Phone className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={handleStartVideo}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Start video call"
        >
          <Video className="w-5 h-5 text-gray-600" />
        </button>

        <div className="h-6 w-px bg-gray-200 mx-1"></div>

        {/* Utility Buttons */}
        <button
          onClick={handleTogglePin}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </button>
        <button
          onClick={handleSearch}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={handleMoreOptions}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}