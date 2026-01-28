'use client';

import { useEffect } from 'react';
import { wsClient } from '@/lib/websocket/client';
import { useAuthStore } from '@/store/auth-store';
import { useMessageStore } from '@/store/message-store';

/**
 * Connects to the messaging WebSocket (if needed), joins the given channel,
 * subscribes to newMessage/error, and updates the message store. Cleans up
 * (leave channel, unsubscribes) on unmount or when channelId/workspace/user change.
 */
export function useChannelWebSocket(channelId: string | null) {
    const { currentWorkspace, user } = useAuthStore();
    const { addMessage, updateMessage } = useMessageStore();

    useEffect(() => {
        if (!currentWorkspace || !user || !channelId) return;

        const token =
            typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (!token) {
            console.warn('No access token found for WebSocket connection');
            return;
        }

        if (!wsClient.isConnected()) {
            wsClient.connect(currentWorkspace.id, token);
        }

        wsClient.joinChannel(channelId);

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

        return () => {
            wsClient.leaveChannel(channelId);
            messageUnsubscribe();
            errorUnsubscribe();
        };
    }, [channelId, currentWorkspace?.id, user?.id, addMessage, updateMessage]);
}