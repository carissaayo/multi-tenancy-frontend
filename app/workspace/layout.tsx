'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api/client';
import { extractWorkspaceSlug } from '@/lib/utils/subdomain';
import { WorkspaceSidebar } from '@/components/workspace/workspace-sidebar';
import { wsClient } from '@/lib/websocket/client';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, currentWorkspace, user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Handle responsive sidebar state
  useEffect(() => {
    const handleResize = () => {
      // Automatically open sidebar on desktop (lg breakpoint = 1024px)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Verify authentication
    const token = localStorage.getItem('accessToken');
    if (!token || !isAuthenticated) {
      router.push('/login');
      return;
    }

    // Verify workspace context from subdomain
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const workspaceSlug = extractWorkspaceSlug(hostname);

      if (workspaceSlug) {
        apiClient.setWorkspaceSlug(workspaceSlug);

        // Connect WebSocket if not already connected
        if (currentWorkspace && user && !wsClient.isConnected()) {
          wsClient.connect(workspaceSlug, token);
        }
      } else if (currentWorkspace) {
        // If we have a workspace but no subdomain, redirect to subdomain
        const protocol = window.location.protocol;
        const port = window.location.port ? `:${window.location.port}` : '';
        window.location.href = `${protocol}//${currentWorkspace.slug}.localhost${port}${window.location.pathname}`;
      }
    }
  }, [isAuthenticated, currentWorkspace, user, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Fixed on mobile, static on desktop */}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <WorkspaceSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}