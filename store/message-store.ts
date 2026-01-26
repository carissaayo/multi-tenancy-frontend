import { create } from 'zustand';
import { Message } from '@/lib/api/messages';

interface MessageState {
  messages: Record<string, Message[]>; // channelId -> messages
  setMessages: (channelId: string, messages: Message[]) => void;
  addMessage: (channelId: string, message: Message) => void;
  updateMessage: (channelId: string, messageId: string, updates: Partial<Message>) => void;
  removeMessage: (channelId: string, messageId: string) => void;
  clearChannel: (channelId: string) => void;
  clearAll: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: {},
  
  setMessages: (channelId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: messages,
      },
    })),
  
  addMessage: (channelId, message) =>
    set((state) => {
      const existing = state.messages[channelId] || [];
      // Check if message already exists
      if (existing.some((m) => m.id === message.id)) {
        return state;
      }
      return {
        messages: {
          ...state.messages,
          [channelId]: [...existing, message],
        },
      };
    }),
  
  updateMessage: (channelId, messageId, updates) =>
    set((state) => {
      const channelMessages = state.messages[channelId] || [];
      return {
        messages: {
          ...state.messages,
          [channelId]: channelMessages.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          ),
        },
      };
    }),
  
  removeMessage: (channelId, messageId) =>
    set((state) => {
      const channelMessages = state.messages[channelId] || [];
      return {
        messages: {
          ...state.messages,
          [channelId]: channelMessages.filter((msg) => msg.id !== messageId),
        },
      };
    }),
  
  clearChannel: (channelId) =>
    set((state) => {
      const { [channelId]: _, ...rest } = state.messages;
      return { messages: rest };
    }),
  
  clearAll: () => set({ messages: {} }),
}));
