'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useSidebarStore } from '@/store/sidebar-store';
import { WorkspaceSidebar } from '@/components/workspace/workspace-sidebar';
import { LogoutModal } from '@/components/workspace/logout-modal';
import { authApi } from '@/lib/api/auth';

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isAuthenticated, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async (logoutFromAllDevices: boolean) => {
    setIsLoggingOut(true);
    logout();
    await authApi.logout(logoutFromAllDevices);
    setShowLogoutModal(false);
    setIsLoggingOut(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 840) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <WorkspaceSidebar onLogoutClick={() => setShowLogoutModal(true)} />
      </div>

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </main>

      <div className="fixed inset-0 z-9999 pointer-events-none *:pointer-events-auto">
        <LogoutModal
          isOpen={showLogoutModal}
          isLoggingOut={isLoggingOut}
          onConfirm={handleLogoutConfirm}
          onCancel={() => setShowLogoutModal(false)}
        />
      </div>
    </div>
  );
}
