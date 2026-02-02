'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import { channelsApi } from '@/lib/api/channels';

import { MessageList } from '@/components/messages/MessageList';
import { MessageInput } from '@/components/messages/MessageInput';

import { ChannelNavbar } from '@/components/workspace/channel-navbar';
import { ErrorDisplay } from '@/components/ui/error-display';
import { useSidebarStore } from '@/store/sidebar-store';
import { useTypingStore, TypingUser } from '@/store/typing-store';
import { useChannelWebSocket } from '@/hooks/use-channel-websocket';
import { useWorkspace } from '@/hooks/workspace';
import { useAuthStore } from '@/store/auth-store';

const EMPTY_TYPING_USERS: TypingUser[] = [];

export default function ChannelPage() {
  const params = useParams();
  const channelId = params.id as string;
  const { currentWorkspace } = useAuthStore();
  const { data: workspaceData } = useWorkspace(currentWorkspace?.id ?? null);
  const workspace = workspaceData?.workspace;
  const isWorkspaceDeactivated = workspace?.isActive === false;

  const { sidebarOpen, toggleSidebar } = useSidebarStore();
  const typingUsers = useTypingStore(
    useShallow((state) => state.typingUsers[channelId] ?? EMPTY_TYPING_USERS)
  );

  useChannelWebSocket(channelId, { enabled: !isWorkspaceDeactivated });
  const { data: channel, isLoading, error } = useQuery({
    queryKey: ['channel', channelId],
    queryFn: async () => {
      const response = await channelsApi.get(channelId);
      return response.channel;
    },
    enabled: !!channelId,
  });


  if (isLoading) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center p-6">
          <ErrorDisplay
            error={error ?? (!channel ? new Error('Channel not found') : null)}
            fallback="Channel not found"
            title="Could not load channel"
            onRetry={() => window.location.reload()}
            variant="full"
          />
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
        typingUsers={typingUsers}
        channelId={channelId}
        disabled={isWorkspaceDeactivated}
      />
      <MessageList channelId={channelId} disabled={isWorkspaceDeactivated} />
      <MessageInput channelId={channelId} disabled={isWorkspaceDeactivated} />
    </div>
  );
}