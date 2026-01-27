import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChannelState {
    selectedChannelId: string | null;
    setSelectedChannelId: (channelId: string | null) => void;
    clearSelectedChannel: () => void;
}

export const useChannelStore = create<ChannelState>()(
    persist(
        (set) => ({
            selectedChannelId: null,
            setSelectedChannelId: (channelId) => set({ selectedChannelId: channelId }),
            clearSelectedChannel: () => set({ selectedChannelId: null }),
        }),
        {
            name: 'channel-storage',
        }
    )
);