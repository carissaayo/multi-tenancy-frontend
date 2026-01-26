'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { messagesApi, Message } from '@/lib/api/messages';
import { MessageItem } from './MessageItem';
import { useMessageStore } from '@/store/message-store';

interface MessageListProps {
  channelId: string;
}

export function MessageList({ channelId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, setMessages, addMessage } = useMessageStore();
  const channelMessages = messages[channelId] || [];

  const { data, isLoading, error } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: async () => {
      const response = await messagesApi.list(channelId);
      return response.messages;
    },
    enabled: !!channelId,
  });

  useEffect(() => {
    if (data) {
      setMessages(channelId, data);
    }
  }, [data, channelId, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages]);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500">
        Failed to load messages. Please try again.
      </div>
    );
  }

  if (channelMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {channelMessages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
