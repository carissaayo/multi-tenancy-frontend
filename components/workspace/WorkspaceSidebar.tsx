'use client';

import { ChannelList } from '@/components/channels/ChannelList';
import { useAuthStore } from '@/store/auth-store';
import { authApi } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function WorkspaceSidebar() {
  const { currentWorkspace, user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    authApi.logout();
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold truncate">
          {currentWorkspace?.name || 'Workspace'}
        </h1>
        <p className="text-sm text-gray-400 truncate">
          {user?.email}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ChannelList />
      </div>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-gray-800"
          onClick={() => router.push('/workspace/members')}
        >
          👥 Members
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-gray-800"
          onClick={() => router.push('/workspace/settings')}
        >
          ⚙️ Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white hover:bg-gray-800"
          onClick={handleLogout}
        >
          🚪 Logout
        </Button>
      </div>
    </div>
  );
}
