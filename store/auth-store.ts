import { UserProfile } from '@/lib/api/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
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
    userName:string
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
    setUser: (user: UserProfile | null) => void;
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