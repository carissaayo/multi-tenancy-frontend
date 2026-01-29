import { create } from 'zustand';

export interface TypingUser {
  id: string;
  username?: string;
  fullName?: string;
}

interface TypingState {
  // channelId -> array of users currently typing
  typingUsers: Record<string, TypingUser[]>;
  addTypingUser: (channelId: string, user: TypingUser) => void;
  removeTypingUser: (channelId: string, userId: string) => void;
  clearTypingUsers: (channelId: string) => void;
  clearAll: () => void;
}

export const useTypingStore = create<TypingState>((set) => ({
  typingUsers: {},

  addTypingUser: (channelId, user) =>
    set((state) => {
      const existing = state.typingUsers[channelId] ?? [];
      // Don't add if already in the list
      if (existing.some((u) => u.id === user.id)) {
        console.log('⌨️ Store: User already in typing list:', user.id);
        return state;
      }
      
      const newState = {
        typingUsers: {
          ...state.typingUsers,
          [channelId]: [...existing, user],
        },
      };
      
      return newState;
    }),

  removeTypingUser: (channelId, userId) =>
    set((state) => {
      const existing = state.typingUsers[channelId] ?? [];
      
      return {
        typingUsers: {
          ...state.typingUsers,
          [channelId]: existing.filter((u) => u.id !== userId),
        },
      };
    }),

  clearTypingUsers: (channelId) =>
    set((state) => {
      const { [channelId]: _, ...rest } = state.typingUsers;
      return { typingUsers: rest };
    }),

  clearAll: () => set({ typingUsers: {} }),
}));
