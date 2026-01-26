'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { workspacesApi } from '@/lib/api/workspaces';
import { useAuthStore } from '@/store/auth-store';
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { currentWorkspace } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: workspace, isLoading } = useQuery({
    queryKey: ['workspace', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return null;
      const response = await workspacesApi.get(currentWorkspace.id);
      return response.workspace;
    },
    enabled: !!currentWorkspace,
    onSuccess: (data) => {
      if (data) {
        setFormData({
          name: data.name,
          description: data.description || '',
        });
      }
    },
  });

  const handleSave = async () => {
    if (!currentWorkspace) return;
    
    setLoading(true);
    setError('');

    try {
      await workspacesApi.update(currentWorkspace.id, formData);
      queryClient.invalidateQueries({ queryKey: ['workspace', currentWorkspace.id] });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update workspace');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <WorkspaceHeader />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Workspace Settings</h2>
          
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Slug
              </label>
              <Input
                value={workspace?.slug || ''}
                disabled
                className="bg-gray-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                The workspace slug cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: workspace?.name || '',
                        description: workspace?.description || '',
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Workspace
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
