import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
}

interface Workspace {
    id: string;
    slug: string;
    name: string;
    description?: string;
    logoUrl?: string;
}

interface AuthState {
    user: User | null;
    currentWorkspace: Workspace | null;
    workspaces: Workspace[];
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setCurrentWorkspace: (workspace: Workspace | null) => void;
    setWorkspaces: (workspaces: Workspace[]) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            currentWorkspace: null,
            workspaces: [],
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: !!user }),
            setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
            setWorkspaces: (workspaces) => set({ workspaces }),
            logout: () => {
                set({
                    user: null,
                    currentWorkspace: null,
                    workspaces: [],
                    isAuthenticated: false,
                });
                localStorage.clear();
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);