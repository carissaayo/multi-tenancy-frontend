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

    connect(workspaceSlug: string, token: string) {
        if (this.socket?.connected) {
            this.disconnect();
        }

        this.workspaceSlug = workspaceSlug;
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000';
        
        this.socket = io(`${wsUrl}/messaging`, {
            auth: {
                token,
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
            // Join workspace room
            this.socket?.emit('joinWorkspace', { workspaceSlug });
        });

        this.socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
            this.errorHandlers.forEach((handler) => handler({ message: error.message }));
        });

        // Message events
        this.socket.on('messageCreated', (message: Message) => {
            this.messageHandlers.forEach((handler) => handler(message));
        });

        this.socket.on('messageUpdated', (message: Message) => {
            this.messageHandlers.forEach((handler) => handler(message));
        });

        this.socket.on('messageDeleted', (message: { id: string; channelId: string }) => {
            // Handle deleted message
            this.messageHandlers.forEach((handler) => handler(message as any));
        });

        // Workspace events
        this.socket.on('workspaceCreated', (workspace: any) => {
            this.workspaceHandlers.forEach((handler) => handler(workspace));
        });

        // Error events
        this.socket.on('error', (error: { message: string; code?: string }) => {
            this.errorHandlers.forEach((handler) => handler(error));
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.workspaceSlug = null;
        }
        this.messageHandlers.clear();
        this.errorHandlers.clear();
        this.workspaceHandlers.clear();
    }

    // Join a channel room
    joinChannel(channelId: string) {
        if (this.socket?.connected) {
            this.socket.emit('joinChannel', { channelId });
        }
    }

    // Leave a channel room
    leaveChannel(channelId: string) {
        if (this.socket?.connected) {
            this.socket.emit('leaveChannel', { channelId });
        }
    }

    // Send message via WebSocket
    sendMessage(data: { channelId: string; content: string }) {
        if (this.socket?.connected) {
            this.socket.emit('sendMessage', data);
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
        return this.socket?.connected ?? false;
    }
}

export const wsClient = new WebSocketClient();