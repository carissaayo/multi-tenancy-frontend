'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { workspacesApi, type Workspace } from '@/lib/api/workspaces';
import { useAuthStore } from '@/store/auth-store';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageIcon, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { currentWorkspace } = useAuthStore();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoError, setLogoError] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const { data: workspace, isLoading } = useQuery({
    queryKey: ['workspace', currentWorkspace?.id],
    queryFn: async (): Promise<Workspace | null> => {
      if (!currentWorkspace) return null;
      const response = await workspacesApi.get(currentWorkspace.id);
      return response.workspace;
    },
    enabled: !!currentWorkspace,
  });

  useEffect(() => {
    if (workspace) {
      setFormData({
        name: workspace.name,
        description: workspace.description || '',
      });
    }
  }, [workspace]);

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

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentWorkspace) return;
    if (!file.type.startsWith('image/')) {
      setLogoError('Please select an image file (PNG, JPG, GIF)');
      return;
    }

    setLogoLoading(true);
    setLogoError('');

    try {
      await workspacesApi.updateLogo(file);
      queryClient.invalidateQueries({ queryKey: ['workspace', currentWorkspace.id] });
      if (logoInputRef.current) logoInputRef.current.value = '';
    } catch (err: any) {
      setLogoError(err.response?.data?.message || 'Failed to update logo');
    } finally {
      setLogoLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader title="Workspace Settings" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <WorkspaceHeader title="Workspace Settings" />
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
                Logo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                  {workspace?.logoUrl ? (
                    <Image
                      src={workspace.logoUrl}
                      alt="Workspace logo"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={!isEditing || logoLoading}
                  >
                    {logoLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      'Change Logo'
                    )}
                  </Button>
                  {logoError && (
                    <p className="mt-2 text-sm text-red-600">{logoError}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    PNG, JPG or GIF.
                  </p>
                </div>
              </div>
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
