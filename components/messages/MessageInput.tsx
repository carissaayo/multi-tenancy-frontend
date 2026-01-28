'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { messagesApi } from '@/lib/api/messages';
import { useMessageStore } from '@/store/message-store';
import { useAuthStore } from '@/store/auth-store';
import { wsClient } from '@/lib/websocket/client';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

interface MessageInputProps {
  channelId: string;
}

export function MessageInput({ channelId }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage } = useMessageStore();
  const { currentWorkspace } = useAuthStore();
  const queryClient = useQueryClient();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || loading) return;

    const messageContent = content.trim();
    setContent('');
    setLoading(true);

    const resetHeight = () => {
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const useWs =
      wsClient.isConnected() && currentWorkspace?.id != null;

    if (useWs) {
      wsClient.sendMessage({
        channelId,
        content: messageContent,
        workspaceId: currentWorkspace!.id,
      });
      resetHeight();
      setLoading(false);
      return;
    }

    try {
      const response = await messagesApi.create({
        content: messageContent,
        channelId,
      });
      addMessage(channelId, response.message);
      queryClient.invalidateQueries({ queryKey: ['messages', channelId] });
      resetHeight();
    } catch (err) {
      console.error('Failed to send message:', err);
      setContent(messageContent);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="border-t p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Press Enter to send, Shift+Enter for new line)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-[200px]"
          rows={1}
          disabled={loading}
        />
        <Button type="submit" disabled={!content.trim() || loading}>
          {loading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  );
}
