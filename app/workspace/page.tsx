'use client';

import { ChannelNavbar } from '@/components/workspace/channel-navbar';
import { EmptyChannelState } from '@/components/layout/empty-channel-state';
import { MessageList } from '@/components/messages/MessageList';
import { MessageInput } from '@/components/messages/MessageInput';
import { useChannelStore } from '@/store/channel-store';
import { useChannel } from '@/hooks/channel';
import { useSidebarStore } from '@/store/sidebar-store';

export default function WorkspacePage() {
    const { selectedChannelId } = useChannelStore();
    const { sidebarOpen, toggleSidebar } = useSidebarStore();
    const { data: channelData, isLoading: isLoadingChannel } = useChannel(selectedChannelId);
    const channel = channelData?.channel;

    if (isLoadingChannel && selectedChannelId) {
        return (
            <div className="flex-1 flex flex-col min-w-0 items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                <p className="mt-3 text-sm text-gray-500">Loading channel...</p>
            </div>
        );
    }

    if (!selectedChannelId || !channel) {
        return <EmptyChannelState appName="DevCol" />;
    }


    return (
        <div className="flex-1 flex flex-col min-w-0 h-full">
            <ChannelNavbar
                channelName={channel.name}
                channelDescription={channel.description}
                isPrivate={channel.isPrivate}
                isFavorite={false}
                onToggleFavorite={() => { }}
                onToggleSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
                hasNotifications={!!(channel.unreadCount && channel.unreadCount > 0)}
            />

            <div className="flex-1 min-h-0 overflow-hidden">
                <MessageList channelId={selectedChannelId} />
            </div>

            <MessageInput channelId={selectedChannelId} />
        </div>
    );
}