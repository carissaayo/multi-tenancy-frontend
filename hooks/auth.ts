'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, type RegisterDto, type LoginDto } from '@/lib/api/auth';
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

export function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: LoginDto) => authApi.login(data),
        onSuccess: (data) => {
            const { profile } = data;
            useAuthStore.getState().setUser({
                id: profile.id,
                email: profile.email,
                fullName: profile.fullName,
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
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.auth });
            router.push('/select-workspace');
        },
    });
}

export function useSelectWorkspace() {
    const router = useRouter();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (workspaceId: string) => authApi.selectWorkspace(workspaceId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.forSelect });
            router.push(`/workspace/${data.workspace.slug}`);
        },
        
    });
}

export function useVerifyEmail() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (emailCode: string) => authApi.verifyEmail(emailCode),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.auth });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.auth });
        authApi.logout();
    };
}