'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { useSelectWorkspace } from '@/hooks/auth';
import { useWorkspacesForSelect } from '../workspace';

export function useSelectWorkspacePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { data, isLoading, error } = useWorkspacesForSelect();
    const selectWorkspace = useSelectWorkspace();

    const workspaces = data?.workspaces ?? [];

    const filteredWorkspaces = useMemo(
        () =>
            workspaces.filter(
                (ws) =>
                    ws.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    ws.slug.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        [workspaces, searchQuery]
    );

    const handleSelectWorkspace = (workspace: { id: string }) => {
        setSelectedId(workspace.id);
        selectWorkspace.mutate(workspace.id);
    };

    const handleCreateWorkspace = () => {
        router.push('/create-workspace');
    };

    return {
        workspaces: filteredWorkspaces,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        selectedId,
        selectWorkspace,
        handleSelectWorkspace,
        handleCreateWorkspace,
    };
}