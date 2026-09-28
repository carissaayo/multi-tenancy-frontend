'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, type RegisterDto, type LoginDto, type UserProfile } from '@/lib/api/auth';
import { usersApi } from '@/lib/api/users';
import { queryKeys } from './query-keys';
import { useAuthStore } from '@/store/auth-store';

export function useRegister() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RegisterDto) => authApi.register(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth });
            router.push('/login');
        },
    });
}

export function useLogin(redirectTo?: string) {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginDto) => authApi.login(data),
        onSuccess: (data) => {
            const { profile } = data;
            const user: UserProfile = {
                id: profile.id,
                email: profile.email,
                fullName: profile.fullName,
                userName: (profile as { userName?: string }).userName ?? profile.email ?? '',
                phoneNumber: profile.phoneNumber,
                avatarUrl: profile.avatarUrl,
                bio: profile.bio,
                city: profile.city,
                state: profile.state,
                country: profile.country,
                isEmailVerified: profile.isEmailVerified,
                isActive: profile.isActive,
                lastLoginAt: profile.lastLoginAt,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
            };
            useAuthStore.getState().setUser(user);
            queryClient.invalidateQueries({ queryKey: queryKeys.auth });
            if (profile.isEmailVerified === false) {
                router.push('/verify-email');
                return;
            }
            router.push(redirectTo || '/select-workspace');
        },
    });
}

export function useSelectWorkspace() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workspaceId: string) => authApi.selectWorkspace(workspaceId),
        onSuccess: (data) => {
            const w = data.workspace;
            useAuthStore.getState().setCurrentWorkspace({
                id: w.id,
                slug: w.slug,
                name: w.name,
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.forSelect });
            router.push(`/workspace/`);
        },
    });
}

export function useVerifyEmail() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (emailCode: string) => authApi.verifyEmail(emailCode),
        onSuccess: () => {
            const current = useAuthStore.getState().user;
            if (current) {
                useAuthStore.getState().setUser({ ...current, isEmailVerified: true });
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.auth });
            router.push('/select-workspace');
        },
    });
}

export function useResendVerificationEmail() {
    return useMutation({
        mutationFn: () => authApi.resendVerificationEmail(),
    });
}

export function useRequestPasswordReset() {
    return useMutation({
        mutationFn: (email: string) => authApi.requestPasswordReset(email),
    });
}

export function useResetPassword() {
    const router = useRouter();

    return useMutation({
        mutationFn: authApi.resetPassword,
        onSuccess: () => {
            router.push('/login');
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: {
            password: string;
            newPassword: string;
            confirmNewPassword: string;
        }) => usersApi.changePassword(data),
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.auth });
        authApi.logout();
    };
}