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
        // Note: Backend sends { userId, channelId, isTyping } - no userName
        // We use userId as display name for now (backend should ideally include userName)
        const typingStartUnsubscribe = wsClient.onTypingStart((data) => {
            console.log('⌨️ Hook received typingStart:', data, '| Current channelId:', channelId, '| Current userId:', user?.id);
            if (data.channelId !== channelId) {
                console.log('⌨️ Ignoring - different channel');
                return;
            }
            // Don't show self as typing
            if (data.userId === user?.id) {
                console.log('⌨️ Ignoring - self typing');
                return;
            }
            // Use userName from backend if available, otherwise fallback to "Someone"
            const displayName = data.userName || 'Someone';
            console.log('⌨️ Adding typing user:', data.userId, 'name:', displayName);
            addTypingUser(channelId, { id: data.userId, name: displayName });
        });

        const typingStopUnsubscribe = wsClient.onTypingStop((data) => {
            console.log('⌨️ Hook received typingStop:', data, '| Current channelId:', channelId);
            if (data.channelId !== channelId) return;
            console.log('⌨️ Removing typing user:', data.userId);
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