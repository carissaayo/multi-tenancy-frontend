'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { channelsApi } from '@/lib/api/channels';

import { MessageList } from '@/components/messages/MessageList';
import { MessageInput } from '@/components/messages/MessageInput';
import { wsClient } from '@/lib/websocket/client';
import { useAuthStore } from '@/store/auth-store';
import { useMessageStore } from '@/store/message-store';
import { ChannelNavbar } from '@/components/workspace/channel-navbar';
import { useSidebarStore } from '@/store/sidebar-store';

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.id as string;
  const { currentWorkspace, user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useSidebarStore();
  const { addMessage, updateMessage, removeMessage } = useMessageStore();

  const { data: channel, isLoading } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: async () => {
      const response = await channelsApi.get(channelId);
      return response.channel;
    },
    enabled: !!channelId,
  });

  // Set up WebSocket connection and event handlers
  useEffect(() => {
    if (!currentWorkspace || !user) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // Connect WebSocket
    // wsClient.connect(currentWorkspace.slug, token);
    // wsClient.joinChannel(channelId);

    // // Set up message event handlers
    // const unsubscribeMessage = wsClient.onMessage((message) => {
    //   if (message.channelId === channelId) {
    //     if (message.id && message.content) {
    //       // Check if message exists to determine if it's new or updated
    //       const existingMessages = useMessageStore.getState().messages[channelId] || [];
    //       const exists = existingMessages.some((m) => m.id === message.id);
          
    //       if (exists) {
    //         updateMessage(channelId, message.id, message);
    //       } else {
    //         addMessage(channelId, message);
    //       }
    //     }
    //   }
    // });

    // return () => {
    //   wsClient.leaveChannel(channelId);
    //   unsubscribeMessage();
    // };
  }, [channelId, currentWorkspace, user, addMessage, updateMessage]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
     
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="flex flex-col h-screen">
   
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">Channel not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
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
      <MessageList channelId={channelId} />
      <MessageInput channelId={channelId} />
    </div>
  );
}
