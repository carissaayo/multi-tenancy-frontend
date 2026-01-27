'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    messagesApi,
    type CreateMessageDto,
    type UpdateMessageDto,
} from '@/lib/api/messages';
import { queryKeys } from './query-keys';

export function useMessages(channelId: string | null, page = 1, limit = 50) {
    return useQuery({
        queryKey: queryKeys.messages(channelId!, page),
        queryFn: () => messagesApi.list(channelId!, page, limit),
        enabled: !!channelId,
    });
}

export function useMessage(id: string | null) {
    return useQuery({
        queryKey: queryKeys.messageDetail(id!),
        queryFn: () => messagesApi.get(id!),
        enabled: !!id,
    });
}

export function useCreateMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMessageDto) => messagesApi.create(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.messages(variables.channelId),
            });
        },
    });
}

export function useUpdateMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMessageDto }) =>
            messagesApi.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.messages(data.message.channelId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.messageDetail(data.message.id),
            });
        },
    });
}

export function useDeleteMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            channelId,
        }: {
            id: string;
            channelId: string;
        }) => messagesApi.delete(id).then(() => ({ id, channelId })),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.messages(variables.channelId),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.messageDetail(variables.id),
            });
        },
    });
}