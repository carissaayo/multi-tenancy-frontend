'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  ChevronDown,
  Settings,
  LogOut,
  Users,
  MessageSquare,
  Star,
  Plus,
  Mail,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ChannelList } from '@/components/channels/channel-list';
import { LogoutModal } from '@/components/workspace/logout-modal';
import { getErrorMessage } from '@/lib/utils/api-error';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth';
import { useWorkspaces, useWorkspace } from '@/hooks/workspace';

import { useSidebarStore } from '@/store/sidebar-store';

export function WorkspaceSidebar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { data: workspacesData, isLoading: isLoadingWorkspaces, error: workspacesError } = useWorkspaces();

  const workspaceSlug = typeof window !== 'undefined'
    ? localStorage.getItem('workspaceSlug')
    : null;

  const currentWorkspace = useMemo(() => {
    if (!workspacesData?.workspaces || !workspaceSlug) {
      return null;
    }
    return workspacesData.workspaces.find(ws => ws.slug === workspaceSlug) || null;
  }, [workspacesData, workspaceSlug]);

  const { data: workspaceDetail } = useWorkspace(currentWorkspace?.id ?? null);
  const userRole = workspaceDetail?.workspace?.userRole ?? currentWorkspace?.userRole ?? '';
  const isWorkspaceDeactivated = currentWorkspace?.isActive === false;
  const canManageInvitations = ['owner', 'admin'].includes(userRole.toLowerCase());

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async (logoutFromAllDevices: boolean) => {
    setIsLoggingOut(true);
    logout();
    await authApi.logout(logoutFromAllDevices);
    setShowLogoutModal(false);
    setIsLoggingOut(false);
  };

  const handleSwitchWorkspace = () => {
    // Navigate to workspace selection page
    if (typeof window !== 'undefined') {
      const protocol = window.location.protocol;
      const port = window.location.port ? `:${window.location.port}` : '';
      window.location.href = `${protocol}//localhost${port}/select-workspace`;
    }
    setSidebarOpen(false);
  };

  const handleCreateChannel = () => {
    router.push('/workspace/channels/create');
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const workspaceInitial = currentWorkspace?.name?.charAt(0).toUpperCase() || 'W';

  const userInitials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() || 'U';

  if (isLoadingWorkspaces) {
    return (
      <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sidebar-foreground"></div>
        <p className="mt-4 text-sm text-sidebar-foreground/80">Loading workspace...</p>
      </div>
    );
  }

  if (workspacesError) {
    const msg = getErrorMessage(workspacesError, 'Failed to load workspace');
    return (
      <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen items-center justify-center p-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-destructive">{msg}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-sidebar-foreground/80 hover:text-sidebar-foreground underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen">
      {/* Workspace Header */}
      <div className="p-4 border-b border-sidebar-border">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-full flex items-center justify-between hover:bg-sidebar-accent rounded-lg p-3 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center shrink-0 overflow-hidden text-sidebar-primary-foreground">
              {currentWorkspace?.logoUrl ? (
                <Image
                  src={`${currentWorkspace.logoUrl}${currentWorkspace.updatedAt ? `?v=${currentWorkspace.updatedAt}` : ''}`}
                  alt={currentWorkspace.name || 'Workspace'}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="font-bold text-lg">{workspaceInitial}</span>
              )}
            </div>
            <div className="text-left min-w-0">
              <h2 className="font-bold text-base truncate">
                {currentWorkspace?.name || 'Workspace'}
              </h2>
              <p className="text-xs text-sidebar-foreground/80 truncate">
                {currentWorkspace?.description || user?.email || ''}
              </p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-sidebar-foreground/80 group-hover:text-sidebar-foreground shrink-0" />
        </button>

        {/* Workspace Dropdown Menu */}
        {sidebarOpen && (
          <div className="mt-2 bg-sidebar-accent/50 backdrop-blur-sm rounded-lg border border-sidebar-border overflow-hidden">
            <button
              onClick={handleSwitchWorkspace}
              className="w-full px-4 py-2 text-sm text-left hover:bg-sidebar-accent transition-colors cursor-pointer text-sidebar-foreground"
            >
              Switch Workspace
            </button>
            <button
              onClick={() => {
                router.push('/workspace/settings');
                setSidebarOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-sidebar-accent transition-colors cursor-pointer text-sidebar-foreground"
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
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sm cursor-pointer text-sidebar-foreground">
            <MessageSquare className="w-5 h-5" />
            <span>Threads</span>
          </button>
          <button
            onClick={() => router.push('/workspace/members')}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sm cursor-pointer text-sidebar-foreground"
          >
            <Users className="w-5 h-5" />
            <span>Members</span>
            {currentWorkspace?.membersCount !== undefined && (
              <span className="ml-auto text-xs text-sidebar-foreground/80">
                {currentWorkspace.membersCount}
              </span>
            )}
          </button>
          {canManageInvitations && (
            <button
              onClick={() => {
                router.push('/workspace/invitations');
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sm cursor-pointer text-sidebar-foreground"
            >
              <Mail className="w-5 h-5" />
              <span>Invitations</span>
            </button>
          )}
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sm cursor-pointer text-sidebar-foreground">
            <Star className="w-5 h-5" />
            <span>Saved Items</span>
          </button>
        </div>

        {/* Channels Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-sidebar-foreground/80 uppercase tracking-wider">
              Channels
            </span>
            <button
              onClick={handleCreateChannel}
              disabled={isWorkspaceDeactivated}
              className={`p-1 rounded transition-colors group ${
                isWorkspaceDeactivated
                  ? 'opacity-50 cursor-not-allowed pointer-events-none'
                  : 'hover:bg-sidebar-accent cursor-pointer'
              }`}
              title={isWorkspaceDeactivated ? 'Workspace is deactivated' : 'Create channel'}
            >
              <Plus className="w-4 h-4 text-sidebar-foreground/80 group-hover:text-sidebar-foreground" />
            </button>
          </div>
          <ChannelList disabled={isWorkspaceDeactivated} />
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => {
            router.push('/profile');
            setSidebarOpen(false);
          }}
          className="w-full flex items-center gap-3 mb-3 hover:bg-sidebar-accent rounded-lg p-2 -m-2 transition-colors cursor-pointer text-sidebar-foreground"
        >
          <div className="relative shrink-0">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground">
              <span className="font-bold text-sm">{userInitials}</span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-sidebar"></div>
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="font-semibold text-sm truncate">{user?.fullName || user?.email}</p>
            <p className="text-xs text-sidebar-foreground/80 truncate">Active</p>
          </div>
        </button>

        <div className="space-y-1">
          <button
            onClick={() => router.push('/workspace/settings')}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sm cursor-pointer text-sidebar-foreground"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent rounded-lg transition-colors text-sm text-destructive hover:text-destructive/90 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        isLoggingOut={isLoggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}