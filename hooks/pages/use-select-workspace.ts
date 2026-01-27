'use client';

import { useState, useMemo } from 'react';

import { useSelectWorkspace } from '@/hooks/auth';
import {  useWorkspacesForSelect } from '../workspace';

export function useSelectWorkspacePage() {
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
        // TODO: open create modal or navigate to create page
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