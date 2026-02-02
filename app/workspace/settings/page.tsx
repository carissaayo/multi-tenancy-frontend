'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { workspacesApi, type Workspace } from '@/lib/api/workspaces';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api/client';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ImageIcon, Loader2, AlertCircle, LogOut, Trash2, Power, PowerOff, Crown } from 'lucide-react';
import { getErrorMessage } from '@/lib/utils/api-error';
import { useWorkspaceMembers, memberKeys, type WorkspaceMember } from '@/hooks/members';

function redirectToSelectWorkspace() {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    window.location.href = `${protocol}//localhost${port}/select-workspace`;
  }
}

export default function SettingsPage() {
  const { user, currentWorkspace, setCurrentWorkspace } = useAuthStore();
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [selectedTransferTarget, setSelectedTransferTarget] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { data: members } = useWorkspaceMembers();

  const { data: workspace, isLoading, error: queryError } = useQuery({
    queryKey: ['workspace', currentWorkspace?.id],
    queryFn: async (): Promise<Workspace | null> => {
      if (!currentWorkspace) return null;
      const response = await workspacesApi.get(currentWorkspace.id);
      return response.workspace;
    },
    enabled: !!currentWorkspace,
  });

  const isOwner =
    workspace?.createdBy === user?.id || workspace?.userRole === 'Owner';
  const isDeactivated = workspace?.isActive === false;

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
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to update workspace');
      setError(msg);
      toast.error(msg, { duration: 4000 });
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
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      if (logoInputRef.current) logoInputRef.current.value = '';
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to update logo');
      setLogoError(msg);
      toast.error(msg, { duration: 4000 });
    } finally {
      setLogoLoading(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await workspacesApi.deleteFromSettings();
      setCurrentWorkspace(null);
      apiClient.setWorkspaceSlug(null);
      redirectToSelectWorkspace();
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to delete workspace');
      setError(msg);
      toast.error(msg, { duration: 4000 });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLeaveWorkspace = async () => {
    setIsLeaving(true);
    setError('');
    try {
      await workspacesApi.leave();
      setCurrentWorkspace(null);
      apiClient.setWorkspaceSlug(null);
      redirectToSelectWorkspace();
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to leave workspace');
      setError(msg);
      toast.error(msg, { duration: 4000 });
    } finally {
      setIsLeaving(false);
    }
  };

  const handleDeactivateWorkspace = async () => {
    setIsDeactivating(true);
    setError('');
    try {
      await workspacesApi.deactivate();
      setCurrentWorkspace(null);
      apiClient.setWorkspaceSlug(null);
      redirectToSelectWorkspace();
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to deactivate workspace');
      setError(msg);
      toast.error(msg, { duration: 4000 });
    } finally {
      setIsDeactivating(false);
    }
  };

  const handleActivateWorkspace = async () => {
    setIsActivating(true);
    setError('');
    try {
      await workspacesApi.activate();
      queryClient.invalidateQueries({ queryKey: ['workspace', currentWorkspace?.id] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setShowActivateModal(false);
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to activate workspace');
      setError(msg);
      toast.error(msg, { duration: 4000 });
    } finally {
      setIsActivating(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!selectedTransferTarget) return;
    setIsTransferring(true);
    setError('');
    try {
      await workspacesApi.transferOwnership(selectedTransferTarget);
      queryClient.invalidateQueries({ queryKey: ['workspace', currentWorkspace?.id] });
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      setShowTransferModal(false);
      setSelectedTransferTarget(null);
      toast.success('Ownership transferred successfully', { duration: 3000 });
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to transfer ownership');
      setError(msg);
      toast.error(msg, { duration: 4000 });
    } finally {
      setIsTransferring(false);
    }
  };

  const adminMembers = members?.filter((m) => m.role === 'Admin') ?? [];

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

  if (queryError) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader title="Workspace Settings" />
        <div className="flex-1 flex items-center justify-center p-6">
          <ErrorDisplay
            error={queryError}
            fallback="Failed to load workspace"
            title="Could not load workspace"
            onRetry={() => window.location.reload()}
            variant="full"
          />
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
                      src={`${workspace.logoUrl}${workspace.updatedAt ? `?v=${workspace.updatedAt}` : ''}`}
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
                    disabled={isDeactivated || !isEditing || logoLoading}
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
                disabled={isDeactivated || !isEditing}
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
              {isDeactivated ? (
                <p className="text-sm text-amber-600">
                  Activate the workspace to edit settings.
                </p>
              ) : isEditing ? (
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

          {/* Danger Zone */}
          <div className="mt-8 bg-white rounded-lg shadow p-6 border border-red-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
            </div>
            <div className="space-y-4">
              {/* Leave Workspace - for non-owners (disabled when workspace is deactivated) */}
              {!isOwner && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Leave Workspace</h3>
                    <p className="text-sm text-gray-500">
                      {isDeactivated
                        ? 'Activate the workspace first to leave'
                        : 'You will no longer have access to this workspace'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowLeaveModal(true)}
                    disabled={isDeactivated}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave
                  </Button>
                </div>
              )}

              {/* Transfer Ownership - owner only */}
              {isOwner && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">Transfer Ownership</h3>
                    <p className="text-sm text-gray-500">
                      Transfer workspace ownership to an admin. You will become an admin.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowTransferModal(true)}
                    disabled={isDeactivated}
                    className="border-purple-300 text-purple-700 hover:bg-purple-50"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Transfer Ownership
                  </Button>
                </div>
              )}

              {/* Deactivate / Activate - owner only */}
              {isOwner && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {isDeactivated ? 'Activate Workspace' : 'Deactivate Workspace'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {isDeactivated
                        ? 'Reactivate this workspace to make it accessible again'
                        : 'Temporarily disable this workspace. You can reactivate it later'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      isDeactivated ? setShowActivateModal(true) : setShowDeactivateModal(true)
                    }
                    className={
                      isDeactivated
                        ? 'border-green-300 text-green-700 hover:bg-green-50'
                        : 'border-amber-300 text-amber-700 hover:bg-amber-50'
                    }
                  >
                    {isDeactivated ? (
                      <>
                        <Power className="w-4 h-4 mr-2" />
                        Activate
                      </>
                    ) : (
                      <>
                        <PowerOff className="w-4 h-4 mr-2" />
                        Deactivate
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Delete Workspace - owner only */}
              {isOwner && (
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h3 className="font-semibold text-red-600">Delete Workspace</h3>
                    <p className="text-sm text-red-500">
                      Permanently delete this workspace and all its data. This cannot be undone.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Workspace?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{workspace?.name}</strong>? This action cannot
              be undone and all data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                onClick={handleDeleteWorkspace}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <LogOut className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Leave Workspace?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to leave <strong>{workspace?.name}</strong>? You will need to
              be re-invited to access this workspace again.
            </p>
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={handleLeaveWorkspace}
                disabled={isLeaving}
                className="flex-1 bg-gray-600 hover:bg-gray-700"
              >
                {isLeaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Leave'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowLeaveModal(false)}
                disabled={isLeaving}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <PowerOff className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Deactivate Workspace?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to deactivate <strong>{workspace?.name}</strong>? The workspace
              will be temporarily disabled. You can reactivate it later from workspace settings.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDeactivateWorkspace}
                disabled={isDeactivating}
                className="flex-1 border-amber-500 text-amber-700 hover:bg-amber-50"
              >
                {isDeactivating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deactivate'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowDeactivateModal(false)}
                disabled={isDeactivating}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Ownership Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Transfer Ownership</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Select an admin to transfer workspace ownership to. You will become an admin.
            </p>
            {adminMembers.length === 0 ? (
              <p className="text-sm text-amber-600 mb-4">
                No admins available. Promote a member to admin first from the Members page.
              </p>
            ) : (
              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
                {adminMembers.map((member: WorkspaceMember) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setSelectedTransferTarget(member.userId)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                      selectedTransferTarget === member.userId
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-semibold shrink-0">
                      {(member.user?.fullName || member.user?.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {member.user?.fullName || member.user?.email || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{member.user?.email}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                onClick={handleTransferOwnership}
                disabled={!selectedTransferTarget || adminMembers.length === 0 || isTransferring}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isTransferring ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Transfer'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowTransferModal(false);
                  setSelectedTransferTarget(null);
                }}
                disabled={isTransferring}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activate Modal */}
      {showActivateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Power className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Activate Workspace?</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Reactivate <strong>{workspace?.name}</strong>? The workspace will be accessible again.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={handleActivateWorkspace}
                disabled={isActivating}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isActivating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowActivateModal(false)}
                disabled={isActivating}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
