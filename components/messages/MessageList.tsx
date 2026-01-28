'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { messagesApi } from '@/lib/api/messages';
import { MessageItem } from './MessageItem';
import { useMessageStore } from '@/store/message-store';
import { MessageSquare, Sparkles } from 'lucide-react';

interface MessageListProps {
  channelId: string;
}

export function MessageList({ channelId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, setMessages } = useMessageStore();
  const channelMessages = messages[channelId] || [];

  const { data, isLoading, error } = useQuery({
    queryKey: ['messages', channelId],
    queryFn: async () => {
      const response = await messagesApi.list({ channelId });
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

  // Loading State
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 bg-linear-to-br from-gray-200 to-gray-300 rounded-lg shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-32" />
                  <div className="h-3 bg-gray-200 rounded w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white p-6">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load messages
            </h3>
            <p className="text-sm text-gray-600">
              We couldn&lsquo;t load the messages. Please try again.
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (channelMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 to-white p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <div className="w-20 h-20 bg-linear-to-br from-purple-500 to-blue-500 rounded-2xl mx-auto flex items-center justify-center transform rotate-3 shadow-xl">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-linear-to-br from-yellow-400 to-orange-400 rounded-lg flex items-center justify-center transform -rotate-12 shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">
              Start the conversation!
            </h3>
            <p className="text-gray-600">
              Be the first to share your thoughts in this channel
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">
              💡 <span className="font-medium">Pro tip:</span> Use @ to mention someone and get their attention
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Messages List
  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="mx-4  py-4">
        <div className="space-y-0.5">
          {channelMessages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}