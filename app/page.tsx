'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, currentWorkspace } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && currentWorkspace) {
      // Redirect to workspace if already authenticated
      router.push('/workspace/channels');
    } else if (isAuthenticated) {
      // Redirect to workspace selection
      router.push('/select-workspace');
    } else {
      // Redirect to login
      router.push('/login');
    }
  }, [isAuthenticated, currentWorkspace, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
