import type { User } from '@/store/auth-store';
import { apiClient } from './client';


export interface UserProfile {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string;
    avatarUrl?: string;
    bio?: string;
    city?: string;
    state?: string;
    country?: string;
    isEmailVerified?: boolean;
    isActive?: boolean;
    lastLoginAt?: string;
    createdAt?: string;
    updatedAt?: string;
    userName: string

}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    profile: UserProfile;
    message: string;
}
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
    profile:User;
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
        const { accessToken, refreshToken } = response.data;

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

    /** Call backend to invalidate token(s), then clear local state and redirect to login. */
    logout: async (logoutFromAllDevices: boolean = false) => {
        try {
            const url = logoutFromAllDevices
                ? '/auth/logout?logoutFromAllDevices=true'
                : '/auth/logout';
            await apiClient.instance.post(url);
        } catch {
            // Still clear local state and redirect even if the request fails (e.g. network or already invalid)
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('workspaceSlug');
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    },

    verifyEmail: async (emailCode: string) => {
        const response = await apiClient.instance.post('/auth/verify-email', {
            emailCode,
        });
        return response.data as { message: string };
    },

    resendVerificationEmail: async () => {
        const response = await apiClient.instance.post('/auth/resend-verification-email');
        return response.data as { message: string };
    },

    requestPasswordReset: async (email: string) => {
        const response = await apiClient.instance.post('/auth/request-password-reset', { email });
        return response.data as { message: string };
    },

    resetPassword: async (data: {
        email: string;
        passwordResetCode: string;
        newPassword: string;
        confirmNewPassword: string;
    }) => {
        const response = await apiClient.instance.post('/auth/password-reset', data);
        return response.data as { message: string };
    },
};