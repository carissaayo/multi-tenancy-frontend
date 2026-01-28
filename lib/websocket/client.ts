import { io, Socket } from 'socket.io-client';
import { Message } from '../api/messages';

type MessageEventHandler = (message: Message) => void;
type ErrorEventHandler = (error: { message: string; code?: string }) => void;
type WorkspaceEventHandler = (workspace: any) => void;

class WebSocketClient {
    private socket: Socket | null = null;
    private workspaceSlug: string | null = null;
    private messageHandlers: Set<MessageEventHandler> = new Set();
    private errorHandlers: Set<ErrorEventHandler> = new Set();
    private workspaceHandlers: Set<WorkspaceEventHandler> = new Set();
    private connectionPromise: Promise<void> | null = null;

    connect(workspaceId: string, token: string): Promise<void> {
        if (this.socket?.connected) {
            this.disconnect();
        }

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000';

        // ✅ Return a promise that resolves when connected
        this.connectionPromise = new Promise((resolve, reject) => {
            this.socket = io(`${wsUrl}/messaging`, {
                auth: { token },
                transports: ['websocket'],
                withCredentials: true,
                reconnection: true,
            });

            this.socket.on('connect', () => {
                console.log('✅ WebSocket connected:', this.socket?.id);
                this.socket?.emit('joinWorkspace', { workspaceId });
                resolve(); 
            });

            this.socket.on('disconnect', (reason) => {
                console.log('❌ WebSocket disconnected:', reason);
                this.connectionPromise = null; 
            });

            this.socket.on('connect_error', (error) => {
                console.error('❌ WS connection error:', error.message);
                this.errorHandlers.forEach((h) =>
                    h({ message: error.message }),
                );
                this.connectionPromise = null; 
                reject(error); 
            });

            /** MESSAGE EVENTS */
            this.socket.on('newMessage', (message) => {
                console.log('📨 Received message:', message); 
                this.messageHandlers.forEach((h) => h(message));
            });

            /** ERRORS FROM BACKEND */
            this.socket.on('error', (error) => {
                console.error('❌ WS backend error:', error); 
                this.errorHandlers.forEach((h) => h(error));
            });
        });

        return this.connectionPromise;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.workspaceSlug = null;
            this.connectionPromise = null; 
        }
        this.messageHandlers.clear();
        this.errorHandlers.clear();
        this.workspaceHandlers.clear();
    }

    // Join a channel room
    joinChannel(channelId: string) {
        if (this.socket?.connected) {
            this.socket.emit('joinChannel', { channelId });
            console.log('✅ Joined channel:', channelId); 
        } else {
            console.warn('⚠️ Cannot join channel - WebSocket not connected'); 
        }
    }

    // Leave a channel room
    leaveChannel(channelId: string) {
        if (this.socket?.connected) {
            this.socket.emit('leaveChannel', { channelId });
        }
    }

    // Send message via WebSocket
    sendMessage(data: {
        channelId: string;
        content: string;
        workspaceId: string;
        threadId?: string;
    }) {
        if (this.socket?.connected) {
            console.log('📤 Sending message via WebSocket:', data); 
            this.socket.emit('sendMessage', data);
        } else {
            console.warn('⚠️ Cannot send message - WebSocket not connected. Current state:', {
                socket: !!this.socket,
                connected: this.socket?.connected,
            }); 
        }
    }


    // Update message via WebSocket
    updateMessage(data: { messageId: string; content: string }) {
        if (this.socket?.connected) {
            this.socket.emit('updateMessage', data);
        }
    }

    // Delete message via WebSocket
    deleteMessage(data: { messageId: string }) {
        if (this.socket?.connected) {
            this.socket.emit('deleteMessage', data);
        }
    }

    // Event handlers
    onMessage(handler: MessageEventHandler) {
        this.messageHandlers.add(handler);
        return () => this.messageHandlers.delete(handler);
    }

    onError(handler: ErrorEventHandler) {
        this.errorHandlers.add(handler);
        return () => this.errorHandlers.delete(handler);
    }

    onWorkspace(handler: WorkspaceEventHandler) {
        this.workspaceHandlers.add(handler);
        return () => this.workspaceHandlers.delete(handler);
    }

 
    getSocket(): Socket | null {
        return this.socket;
    }

    isConnected(): boolean {
        const connected = this.socket?.connected ?? false;
        console.log('🔍 WebSocket connection check:', {
            hasSocket: !!this.socket,
            connected,
            socketId: this.socket?.id,
        }); 
        return connected;
    }

    async waitForConnection(): Promise<boolean> {
        if (this.isConnected()) {
            return true;
        }

        if (this.connectionPromise) {
            try {
                await this.connectionPromise;
                return true;
            } catch {
                return false;
            }
        }

        return false;
    }
}

export const wsClient = new WebSocketClient();