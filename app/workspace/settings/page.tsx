'use client';

import Image from 'next/image';
import { WorkspaceHeader } from '@/components/workspace/workspace-header';
import { ErrorDisplay } from '@/components/ui/error-display';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageIcon, Loader2, AlertCircle, LogOut, Trash2, Power, PowerOff, Crown } from 'lucide-react';
import { useWorkspaceSettings } from '@/hooks/page/use-workspace-settings';
import { DeleteWorkspaceModal } from '@/components/workspace/delete-workspace-modal';
import { LeaveWorkspaceModal } from '@/components/workspace/leave-workspace-modal';
import { DeactivateWorkspaceModal } from '@/components/workspace/deactivate-workspace-modal';
import { ActivateWorkspaceModal } from '@/components/workspace/activate-workspace-modal';
import { TransferOwnershipModal } from '@/components/workspace/transfer-ownership-modal';

export default function SettingsPage() {
  const {
    workspace,
    isLoading,
    queryError,
    isOwner,
    isDeactivated,
    adminMembers,
    isEditing,
    formData,
    setFormData,
    setIsEditing,
    loading,
    logoLoading,
    logoError,
    error,
    logoInputRef,
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
    handleSave,
    handleLogoChange,
    handleDeleteWorkspace,
    handleLeaveWorkspace,
    handleDeactivateWorkspace,
    handleActivateWorkspace,
    handleTransferOwnership,
    cancelEdit,
  } = useWorkspaceSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <WorkspaceHeader title="Workspace Settings" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
      <WorkspaceHeader title="Workspace Settings" backHref="/workspace" />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">Workspace Settings</h2>

          <div className="bg-card rounded-lg shadow p-6 space-y-6 border border-border">
            {error && (
              <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Workspace Slug</label>
              <Input value={workspace?.slug || ''} disabled className="bg-muted" />
              <p className="mt-1 text-sm text-muted-foreground">The workspace slug cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl border-2 border-border flex items-center justify-center overflow-hidden bg-muted shrink-0">
                  {workspace?.logoUrl ? (
                    <Image
                      src={`${workspace.logoUrl}${workspace.updatedAt ? `?v=${workspace.updatedAt}` : ''}`}
                      alt="Workspace logo"
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
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
                  {logoError && <p className="mt-2 text-sm text-destructive">{logoError}</p>}
                  <p className="mt-1 text-sm text-muted-foreground">PNG, JPG or GIF.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Workspace Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isDeactivated || !isEditing}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
                <p className="text-sm text-amber-600">Activate the workspace to edit settings.</p>
              ) : isEditing ? (
                <>
                  <Button variant="secondary" onClick={cancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Workspace</Button>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 bg-card rounded-lg shadow p-6 border border-destructive/50">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h2 className="text-lg font-bold text-destructive">Danger Zone</h2>
            </div>
            <div className="space-y-4">
              {!isOwner && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">Leave Workspace</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {isDeactivated
                        ? 'Activate the workspace first to leave'
                        : 'You will no longer have access to this workspace'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowLeaveModal(true)}
                    disabled={isDeactivated}
                    className="shrink-0 w-full sm:w-auto"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave
                  </Button>
                </div>
              )}

              {isOwner && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">Transfer Ownership</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Transfer workspace ownership to an admin. You will become an admin.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowTransferModal(true)}
                    disabled={isDeactivated}
                    className="border-primary text-primary hover:bg-accent shrink-0 w-full sm:w-auto"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Transfer Ownership
                  </Button>
                </div>
              )}

              {isOwner && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-border rounded-lg">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">
                      {isDeactivated ? 'Activate Workspace' : 'Deactivate Workspace'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
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
                      'shrink-0 w-full sm:w-auto ' +
                      (isDeactivated
                        ? 'border-green-500 text-green-700 hover:bg-green-50 dark:border-green-400 dark:text-green-300 dark:hover:bg-green-900/30'
                        : 'border-amber-500 text-amber-700 hover:bg-amber-50 dark:border-amber-400 dark:text-amber-300 dark:hover:bg-amber-900/30')
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

              {isOwner && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-destructive">Delete Workspace</h3>
                    <p className="text-sm text-destructive/90 mt-0.5">
                      Permanently delete this workspace and all its data. This cannot be undone.
                    </p>
                  </div>
                  <Button variant="destructive" onClick={() => setShowDeleteModal(true)} className="shrink-0 w-full sm:w-auto">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteWorkspaceModal
        isOpen={showDeleteModal}
        workspaceName={workspace?.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteWorkspace}
        onCancel={() => setShowDeleteModal(false)}
      />

      <LeaveWorkspaceModal
        isOpen={showLeaveModal}
        workspaceName={workspace?.name}
        isLeaving={isLeaving}
        onConfirm={handleLeaveWorkspace}
        onCancel={() => setShowLeaveModal(false)}
      />

      <DeactivateWorkspaceModal
        isOpen={showDeactivateModal}
        workspaceName={workspace?.name}
        isDeactivating={isDeactivating}
        onConfirm={handleDeactivateWorkspace}
        onCancel={() => setShowDeactivateModal(false)}
      />

      <ActivateWorkspaceModal
        isOpen={showActivateModal}
        workspaceName={workspace?.name}
        isActivating={isActivating}
        onConfirm={handleActivateWorkspace}
        onCancel={() => setShowActivateModal(false)}
      />

      <TransferOwnershipModal
        isOpen={showTransferModal}
        adminMembers={adminMembers}
        selectedTransferTarget={selectedTransferTarget}
        isTransferring={isTransferring}
        onSelectTarget={setSelectedTransferTarget}
        onConfirm={handleTransferOwnership}
        onCancel={() => {
          setShowTransferModal(false);
          setSelectedTransferTarget(null);
        }}
      />
    </div>
  );
}
