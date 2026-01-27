'use client';

import { useState, useMemo } from 'react';
import { ChannelList } from '@/components/channels/channel-list';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { useWorkspaces } from '@/hooks/workspace';

import {
  ChevronDown,
  Settings,
  LogOut,
  Users,
  MessageSquare,
  Star
} from 'lucide-react';

interface WorkspaceSidebarProps {
  onClose?: () => void;
}

export function WorkspaceSidebar({ onClose }: WorkspaceSidebarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  // Fetch all workspaces
  const { data: workspacesData, isLoading: isLoadingWorkspaces } = useWorkspaces();

  // Get current workspace slug from localStorage
  const workspaceSlug = typeof window !== 'undefined'
    ? localStorage.getItem('workspaceSlug')
    : null;

  // Find current workspace by slug
  const currentWorkspace = useMemo(() => {
    if (!workspacesData?.workspaces || !workspaceSlug) {
      return null;
    }
    return workspacesData.workspaces.find(ws => ws.slug === workspaceSlug) || null;
  }, [workspacesData, workspaceSlug]);

  const handleLogout = () => {
    logout();
    authApi.logout();
  };

  console.log(currentWorkspace,"currentWorkspace");
  

  const handleSwitchWorkspace = () => {
    // Navigate to workspace selection page
    // Remove subdomain and go to main domain
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const port = window.location.port ? `:${window.location.port}` : '';
      window.location.href = `${protocol}//localhost${port}/select-workspace`;
    }
    setShowWorkspaceMenu(false);
  };

  // Get workspace initial for avatar
  const workspaceInitial = currentWorkspace?.name?.charAt(0).toUpperCase() || 'W';

  // Get user initials for avatar
  const userInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || 'U';

  // Show loading state while fetching workspace
  if (isLoadingWorkspaces) {
    return (
      <div className="w-64 bg-linear-to-b from-purple-900 to-purple-800 text-white flex flex-col h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="mt-4 text-sm text-purple-300">Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="w-64 bg-linear-to-b from-purple-900 to-purple-800 text-white flex flex-col h-screen">
      {/* Workspace Header */}
      <div className="p-4 border-b border-purple-700/50">
        <button
          onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
          className="w-full flex items-center justify-between hover:bg-purple-700/30 rounded-lg p-3 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
              <span className="text-purple-900 font-bold text-lg">{workspaceInitial}</span>
            </div>
            <div className="text-left min-w-0">
              <h2 className="font-bold text-base truncate">
                {currentWorkspace?.name || 'Workspace'}
              </h2>
              <p className="text-xs text-purple-300 truncate">
                {currentWorkspace?.description || user?.email || ''}
              </p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-purple-300 group-hover:text-white shrink-0" />
        </button>

        {/* Workspace Dropdown Menu */}
        {showWorkspaceMenu && (
          <div className="mt-2 bg-purple-800/50 backdrop-blur-sm rounded-lg border border-purple-700/50 overflow-hidden">
            <button
              onClick={handleSwitchWorkspace}
              className="w-full px-4 py-2 text-sm text-left hover:bg-purple-700/30 transition-colors"
            >
              Switch Workspace
            </button>
            <button
              onClick={() => {
                router.push('/workspace/settings');
                setShowWorkspaceMenu(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-purple-700/30 transition-colors"
            >
              Workspace Settings
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Actions */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-700/30 rounded-lg transition-colors text-sm">
            <MessageSquare className="w-5 h-5" />
            <span>Threads</span>
          </button>
          <button
            onClick={() => router.push('/workspace/members')}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-700/30 rounded-lg transition-colors text-sm"
          >
            <Users className="w-5 h-5" />
            <span>Members</span>
            {currentWorkspace?.membersCount !== undefined && (
              <span className="ml-auto text-xs text-purple-300">
                {currentWorkspace.membersCount}
              </span>
            )}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-700/30 rounded-lg transition-colors text-sm">
            <Star className="w-5 h-5" />
            <span>Saved Items</span>
          </button>
        </div>

        {/* Channels Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Channels
            </span>
            {currentWorkspace?.channelCount !== undefined && (
              <span className="text-xs text-purple-300">
                {currentWorkspace.channelCount}
              </span>
            )}
          </div>
          <ChannelList />
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-purple-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{userInitials}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-purple-900"></div>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="font-semibold text-sm truncate">{user?.fullName || user?.email}</p>
            <p className="text-xs text-purple-300 truncate">Active</p>
          </div>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => router.push('/workspace/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-700/30 rounded-lg transition-colors text-sm"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-700/30 rounded-lg transition-colors text-sm text-red-300 hover:text-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}