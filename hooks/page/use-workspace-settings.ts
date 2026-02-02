'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { workspacesApi, type Workspace } from '@/lib/api/workspaces';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/utils/api-error';
import { useWorkspaceMembers, memberKeys, type WorkspaceMember } from '@/hooks/members';

function redirectToSelectWorkspace() {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    window.location.href = `${protocol}//localhost${port}/select-workspace`;
  }
}

export function useWorkspaceSettings() {
  const { user, currentWorkspace, setCurrentWorkspace } = useAuthStore();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { data: members } = useWorkspaceMembers();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
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

  const { data: workspace, isLoading, error: queryError } = useQuery({
    queryKey: ['workspace', currentWorkspace?.id],
    queryFn: async (): Promise<Workspace | null> => {
      if (!currentWorkspace) return null;
      const response = await workspacesApi.get(currentWorkspace.id);
      return response.workspace;
    },
    enabled: !!currentWorkspace,
  });

  const isOwner = workspace?.createdBy === user?.id || workspace?.userRole === 'Owner';
  const isDeactivated = workspace?.isActive === false;
  const adminMembers = members?.filter((m) => m.role === 'Admin') ?? [];

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

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: workspace?.name || '',
      description: workspace?.description || '',
    });
  };

  return {
    // Data
    workspace,
    isLoading,
    queryError,
    isOwner,
    isDeactivated,
    adminMembers,
    // Form state
    isEditing,
    formData,
    setFormData,
    setIsEditing,
    loading,
    logoLoading,
    logoError,
    error,
    logoInputRef,
    // Modal state
    showDeleteModal,
    setShowDeleteModal,
    showLeaveModal,
    setShowLeaveModal,
    showDeactivateModal,
    setShowDeactivateModal,
    showActivateModal,
    setShowActivateModal,
    showTransferModal,
    setShowTransferModal,
    selectedTransferTarget,
    setSelectedTransferTarget,
    isDeleting,
    isLeaving,
    isDeactivating,
    isActivating,
    isTransferring,
    // Handlers
    handleSave,
    handleLogoChange,
    handleDeleteWorkspace,
    handleLeaveWorkspace,
    handleDeactivateWorkspace,
    handleActivateWorkspace,
    handleTransferOwnership,
    cancelEdit,
  };
}

