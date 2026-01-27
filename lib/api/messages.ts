import { apiClient } from './client';

export interface Message {
  id: string;
  content: string;
  channelId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    avatarUrl?: string;
  };
  edited?: boolean;
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

export interface CreateMessageDto {
  content: string;
  channelId: string;
  attachments?: File[];
}

export interface UpdateMessageDto {
  content: string;
}

export interface MessageResponse {
  message: Message;
}

export interface MessagesResponse {
  messages: Message[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface GetMessagesDto {
  channelId: string;
  cursor?: string;
  limit?: number;
  direction?: 'before' | 'after';
}

export interface MessagesListResponse {
  messages: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}


export const messagesApi = {
  list: async (dto: GetMessagesDto): Promise<MessagesListResponse> => {
    const { channelId, cursor, limit = 50, direction = 'before' } = dto;
    const response = await apiClient.instance.post<MessagesListResponse>(
      '/messages/channel/',
      {
        params: {
          channelId,
          ...(cursor != null && { cursor }),
          limit: Math.min(limit, 100),
          direction,
        },
      }
    );
    return response.data;
  },


  get: async (id: string): Promise<MessageResponse> => {
    const response = await apiClient.instance.get(`/messages/${id}`);
    return response.data;
  },

  create: async (data: CreateMessageDto): Promise<MessageResponse> => {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('channelId', data.channelId);
    
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await apiClient.instance.post('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: UpdateMessageDto): Promise<MessageResponse> => {
    const response = await apiClient.instance.patch(`/messages/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.instance.delete(`/messages/${id}`);
  },
};
