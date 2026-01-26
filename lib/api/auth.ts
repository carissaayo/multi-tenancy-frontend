import { apiClient } from './client';

export interface RegisterDto {
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    phoneNumber: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    profile: {
        id: string;
        email: string;
        fullName: string;
    };
    message: string;
}

export interface WorkspaceSelectResponse {
    accessToken: string;
    workspace: {
        id: string;
        slug: string;
        name: string;
    };
    message: string;
}

export const authApi = {
    register: async (data: RegisterDto) => {
        const response = await apiClient.instance.post('/auth/register', data);
        return response.data;
    },

    login: async (data: LoginDto): Promise<AuthResponse> => {
        const response = await apiClient.instance.post('/auth/login', data);
        const { accessToken, refreshToken, profile } = response.data;

        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return response.data;
    },

    selectWorkspace: async (workspaceId: string): Promise<WorkspaceSelectResponse> => {
        const response = await apiClient.instance.post('/auth/select-workspace', {
            workspaceId,
        });

        const { accessToken, workspace } = response.data;
        localStorage.setItem('accessToken', accessToken);
        apiClient.setWorkspaceSlug(workspace.slug);

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('workspaceSlug');
        window.location.href = '/login';
    },

    verifyEmail: async (emailCode: string) => {
        const response = await apiClient.instance.post('/auth/verify-email', {
            emailCode,
        });
        return response.data;
    },
};