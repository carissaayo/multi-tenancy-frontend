'use client';

import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { messagesApi } from '@/lib/api/messages';
import { MessageItem } from './MessageItem';
import { useMessageStore } from '@/store/message-store';
import { MessageSquare, Sparkles } from 'lucide-react';
import { ErrorDisplay } from '@/components/ui/error-display';

interface MessageListProps {
  channelId: string;
  /** When true, disables message actions (e.g. workspace deactivated) */
  disabled?: boolean;
}

export function MessageList({ channelId, disabled = false }: MessageListProps) {
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
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-lg shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-muted rounded w-32" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
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
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <ErrorDisplay
          error={error}
          fallback="We couldn't load the messages. Please try again."
          title="Failed to load messages"
          onRetry={() => window.location.reload()}
          variant="full"
        />
      </div>
    );
  }

  // Empty State
  if (channelMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="relative">
            <div className="w-20 h-20 bg-primary rounded-2xl mx-auto flex items-center justify-center transform rotate-3 shadow-xl text-primary-foreground">
              <MessageSquare className="w-10 h-10" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center transform -rotate-12 shadow-lg text-white">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">
              Start the conversation!
            </h3>
            <p className="text-muted-foreground">
              Be the first to share your thoughts in this channel
            </p>
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
            <p className="text-sm text-muted-foreground">
              💡 <span className="font-medium text-foreground">Pro tip:</span> Use @ to mention someone and get their attention
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Messages List
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="mx-4  py-4">
        <div className="space-y-0.5">
          {channelMessages.map((message) => (
            <MessageItem key={message.id} message={message} disabled={disabled} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}