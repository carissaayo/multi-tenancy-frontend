'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { messagesApi } from '@/lib/api/messages';
import { useMessageStore } from '@/store/message-store';
import { useAuthStore } from '@/store/auth-store';
import { wsClient } from '@/lib/websocket/client';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

interface MessageInputProps {
  channelId: string;
}

const TYPING_DEBOUNCE_MS = 2000;

export function MessageInput({ channelId }: MessageInputProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false); // Use ref to avoid stale closures
  const { addMessage } = useMessageStore();
  const { currentWorkspace } = useAuthStore();
  const queryClient = useQueryClient();

  // Stop typing indicator
  const stopTypingIndicator = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTypingRef.current) {
      console.log('⌨️ MessageInput: Stopping typing indicator for channel:', channelId);
      isTypingRef.current = false;
      wsClient.stopTyping({ channelId });
    }
  };

  // Clean up on unmount or channelId change only
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (isTypingRef.current) {
        console.log('⌨️ MessageInput: Cleanup - stopping typing for channel:', channelId);
        wsClient.stopTyping({ channelId });
        isTypingRef.current = false;
      }
    };
  }, [channelId]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || loading) return;

    const messageContent = content.trim();
    setContent('');
    setLoading(true);
    stopTypingIndicator();

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
      queryClient.invalidateQueries({ queryKey: ['messages', channelId] });
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
    const value = e.target.value;
    setContent(value);

    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;

    // Handle typing indicator
    if (value.trim()) {
      // Start typing if not already
      if (!isTypingRef.current) {
        console.log('⌨️ MessageInput: Starting typing indicator for channel:', channelId);
        isTypingRef.current = true;
        wsClient.startTyping({ channelId });
      }

      // Reset the debounce timer
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        stopTypingIndicator();
      }, TYPING_DEBOUNCE_MS);
    } else {
      // Empty input - stop typing
      stopTypingIndicator();
    }
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
