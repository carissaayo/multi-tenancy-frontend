'use client';

import { useEffect } from 'react';

import { wsClient } from '@/lib/websocket/client';
import { useAuthStore } from '@/store/auth-store';
import { useMessageStore } from '@/store/message-store';
import { useTypingStore } from '@/store/typing-store';

/**
 * Connects to the messaging WebSocket (if needed), joins the given channel
 * after connection is ready, subscribes to newMessage/error/typing, and updates
 * the message and typing stores. Cleans up on unmount or when channelId/workspace/user change.
 */
export function useChannelWebSocket(channelId: string | null) {
    const { currentWorkspace, user } = useAuthStore();
    const { addMessage, updateMessage } = useMessageStore();
    const { addTypingUser, removeTypingUser, clearTypingUsers } = useTypingStore();

    useEffect(() => {
        if (!currentWorkspace || !user || !channelId) return;
        const token =
            typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
            console.warn('No access token found for WebSocket connection');
            return;
        }

        let cancelled = false;

        const run = async () => {
            if (!wsClient.isConnected()) {
                wsClient.connect(currentWorkspace.id, token);
            }
            const ready = await wsClient.waitForConnection();
            if (cancelled || !ready) return;
            wsClient.joinChannel(channelId);
        };

        run();

        const errorUnsubscribe = wsClient.onError((error) => {
            console.error('WebSocket error:', error);
        });

        const messageUnsubscribe = wsClient.onMessage((message) => {
            if (message.channelId !== channelId) return;

            const existing = useMessageStore.getState().messages[channelId] ?? [];
            const exists = existing.some((m) => m.id === message.id);

            if (exists) {
                updateMessage(channelId, message.id, message);
            } else {
                addMessage(channelId, message);
            }
        });

        // Subscribe to typing events
        const typingStartUnsubscribe = wsClient.onTypingStart((data) => {
        
            if (data.channelId !== channelId) {
                return;
            }
            // Don't show self as typing
            if (data.userId === user?.id) {
                return;
            }
            addTypingUser(channelId, { 
                id: data.userId, 
                username: data.username,
                fullName: data.fullName,
            });
        });

        const typingStopUnsubscribe = wsClient.onTypingStop((data) => {
            if (data.channelId !== channelId) return;
            removeTypingUser(channelId, data.userId);
        });

        return () => {
            cancelled = true;
            wsClient.leaveChannel(channelId);
            messageUnsubscribe();
            errorUnsubscribe();
            typingStartUnsubscribe();
            typingStopUnsubscribe();
            clearTypingUsers(channelId);
        };
    }, [channelId, currentWorkspace, user, addMessage, updateMessage, addTypingUser, removeTypingUser, clearTypingUsers]);
}