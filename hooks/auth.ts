'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authApi, type RegisterDto, type LoginDto } from '@/lib/api/auth';
import { queryKeys } from './query-keys';

export function useRegister() {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: RegisterDto) => authApi.register(data),
        onSuccess: () => {
            // optional: toast, then redirect
            router.push('/login');
        },
    });
}

export function useLogin() {
    const router = useRouter();
    return useMutation({
        mutationFn: (data: LoginDto) => authApi.login(data),
        onSuccess: (_, __, context) => {
            router.push('/select-workspace');
        },
    });
}

export function useSelectWorkspace() {
    const router = useRouter();
    return useMutation({
        mutationFn: (workspaceId: string) => authApi.selectWorkspace(workspaceId),
        onSuccess: (data) => {
            // workspace slug now set in apiClient
            router.push(`/workspace/${data.workspace.slug}`);
        },
    });
}

export function useVerifyEmail() {
    return useMutation({
        mutationFn: (emailCode: string) => authApi.verifyEmail(emailCode),
    });
}

export function useLogout() {
    // logout is sync; no useMutation needed
    return () => authApi.logout();
}