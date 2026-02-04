import { apiClient } from './client';

export type WorkspaceUserRole = 'Owner' | 'Admin' | 'Member' | 'Guest';

export enum WorkspacePlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export interface Workspace {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  /** Whether workspace is active (not deactivated) */
  isActive?: boolean;
  /** Workspace owner user ID */
  createdBy?: string;
  /** From stats; only present when workspace list includes stats */
  membersCount?: number;
  channelCount?: number;
  /** Logged-in user's role in this workspace */
  userRole?: WorkspaceUserRole;
}

export interface CreateWorkspaceDto {
  name: string;
  slug: string;
  description?: string;
  plan?: WorkspacePlan;
  logo?: File;
}

export interface WorkspaceResponse {
  workspace: Workspace;
}

export interface UpdateWorkspaceResponse {
  workspace: Workspace;
  message: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface CreateWorkspaceResponse {
  workspace: Workspace;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface WorkspacesResponse {
  workspaces: Workspace[];
}

/** Response from delete, deactivate, activate, leave - includes new tokens */
export interface WorkspaceSettingsResponse {
  accessToken?: string;
  refreshToken?: string;
  message: string;
}

export const workspacesApi = {
  list: async (): Promise<WorkspacesResponse> => {
    const response = await apiClient.instance.get('/workspaces');
    return response.data;
  },

  get: async (id: string): Promise<WorkspaceResponse> => {
    const response = await apiClient.instance.get(`/workspaces/${id}`);
    return response.data;
  },

  create: async (data: CreateWorkspaceDto): Promise<CreateWorkspaceResponse> => {
    if (data.logo) {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      if (data.description) formData.append('description', data.description);
      if (data.plan) formData.append('plan', data.plan);
      formData.append('logo', data.logo);
      const response = await apiClient.instance.post('/workspaces', formData);
      return response.data;
    }
    const response = await apiClient.instance.post('/workspaces', {
      name: data.name,
      slug: data.slug,
      description: data.description,
      plan: data.plan,
    });
    return response.data;
  },

  update: async (id: string, data: { name?: string; description?: string; plan?: WorkspacePlan }): Promise<UpdateWorkspaceResponse> => {
    const response = await apiClient.instance.patch(`/settings`, data);
    return response.data;
  },

  updateLogo: async (file: File): Promise<UpdateWorkspaceResponse> => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await apiClient.instance.patch('/settings/logo', formData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.instance.delete(`/workspaces/${id}`);
  },

  /** Delete workspace (soft delete) - owner only. Uses workspace-scoped /settings. */
  deleteFromSettings: async (): Promise<WorkspaceSettingsResponse> => {
    const response = await apiClient.instance.delete<WorkspaceSettingsResponse>('/settings');
    return response.data;
  },

  /** Leave workspace - redirects to workspace selection after. */
  leave: async (): Promise<WorkspaceSettingsResponse> => {
    const response = await apiClient.instance.patch<WorkspaceSettingsResponse>('/settings/leave');
    return response.data;
  },

  /** Deactivate workspace - owner only. */
  deactivate: async (): Promise<WorkspaceSettingsResponse> => {
    const response = await apiClient.instance.patch<WorkspaceSettingsResponse>('/settings/deactivate');
    return response.data;
  },

  /** Activate workspace - owner only. */
  activate: async (): Promise<WorkspaceSettingsResponse> => {
    const response = await apiClient.instance.patch<WorkspaceSettingsResponse>('/settings/activate');
    return response.data;
  },

  /** Transfer ownership to another member - owner only. Target must be an admin. */
  transferOwnership: async (targetUserId: string): Promise<WorkspaceSettingsResponse> => {
    const response = await apiClient.instance.patch<WorkspaceSettingsResponse>(
      '/management/transfer-ownership',
      { targetUserId }
    );
    return response.data;
  },
};
