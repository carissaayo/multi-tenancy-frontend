'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api/client';
import { extractWorkspaceSlug } from '@/lib/utils/subdomain';
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar';
import { wsClient } from '@/lib/websocket/client';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, currentWorkspace, user } = useAuthStore();

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <WorkspaceSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}