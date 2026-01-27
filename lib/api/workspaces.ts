import { apiClient } from './client';

export type WorkspaceUserRole = 'Owner' | 'Admin' | 'Member' | 'Guest';

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
}

export interface WorkspaceResponse {
  workspace: Workspace;
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

  create: async (data: CreateWorkspaceDto): Promise<WorkspaceResponse> => {
    const response = await apiClient.instance.post('/workspaces', data);
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
