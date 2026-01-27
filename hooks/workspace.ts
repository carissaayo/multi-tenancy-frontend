'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesApi, type CreateWorkspaceDto } from '@/lib/api/workspaces';
import { queryKeys } from './query-keys';

export function useWorkspaces() {
    return useQuery({
        queryKey: queryKeys.workspaces.all,
        queryFn: () => workspacesApi.list(),
    });
}

export function useWorkspace(id: string | null) {
    return useQuery({
        queryKey: queryKeys.workspaces.detail(id!),
        queryFn: () => workspacesApi.get(id!),
        enabled: !!id,
    });
}

export function useCreateWorkspace() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateWorkspaceDto) => workspacesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });
        },
    });
}

export function useWorkspacesForSelect() {
    return useQuery({
        queryKey: queryKeys.workspaces.forSelect,
        queryFn: () => workspacesApi.list(),
        staleTime: 0,
        gcTime: 0,
    });
}