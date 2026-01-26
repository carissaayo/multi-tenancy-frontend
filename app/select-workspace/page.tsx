'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { workspacesApi } from '@/lib/api/workspaces';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/auth-store';
import { getWorkspaceUrl } from '@/lib/utils/subdomain';
import { Button } from '@/components/ui/button';

export default function SelectWorkspacePage() {
  const router = useRouter();
  const { setCurrentWorkspace, setWorkspaces } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const response = await workspacesApi.list();
      setWorkspaces(response.workspaces);
      return response.workspaces;
    },
  });

  const handleSelectWorkspace = async (workspace: any) => {
    try {
      const response = await authApi.selectWorkspace(workspace.id);
      setCurrentWorkspace(response.workspace);
      
      // Redirect to workspace subdomain
      const workspaceUrl = getWorkspaceUrl(workspace.slug, '/workspace/channels');
      window.location.href = workspaceUrl;
    } catch (error: any) {
      console.error('Failed to select workspace:', error);
      alert(error.response?.data?.message || 'Failed to select workspace');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
          <div className="text-red-500 text-center">
            Failed to load workspaces. Please try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-2xl font-bold text-center">Select Workspace</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose a workspace to continue
          </p>
        </div>
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => handleSelectWorkspace(workspace)}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2">{workspace.name}</h3>
                <p className="text-sm text-gray-500 mb-1">@{workspace.slug}</p>
                {workspace.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {workspace.description}
                  </p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No workspaces found.</p>
            <Button onClick={() => router.push('/workspace/settings')}>
              Create Workspace
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}