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

export interface CreateWorkspaceResponse {
  workspace: Workspace;
  accessToken: string;
  refreshToken: string;
  message: string;
}

export interface WorkspacesResponse {
  workspaces: Workspace[];
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

  update: async (id: string, data: Partial<CreateWorkspaceDto>): Promise<WorkspaceResponse> => {
    const response = await apiClient.instance.patch(`/workspaces/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.instance.delete(`/workspaces/${id}`);
  },
};
