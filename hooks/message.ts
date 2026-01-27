'use client';

import {
    useQuery,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from '@tanstack/react-query';
import {
    messagesApi,
    type CreateMessageDto,
    type UpdateMessageDto,
} from '@/lib/api/messages';
import { queryKeys } from './query-keys';

export function useInfiniteMessages(
    channelId: string | null,
    limit = 50,
    direction: 'before' | 'after' = 'before'
) {
    return useInfiniteQuery({
        queryKey: ['messages', 'infinite', channelId!, limit, direction],
        queryFn: async ({ pageParam }) => {
            const res = await messagesApi.list({
                channelId: channelId!,
                cursor: pageParam ?? undefined,
                limit,
                direction,
            });
            return res;
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        getPreviousPageParam: (firstPage) => firstPage.nextCursor ?? undefined,
        enabled: !!channelId,
    });
}

/** Simple list (no infinite scroll). Good for initial load or single fetch. */
export function useMessages(
    channelId: string | null,
    options?: { cursor?: string; limit?: number; direction?: 'before' | 'after' }
) {
    const { cursor, limit = 50, direction = 'before' } = options ?? {};
    return useQuery({
        queryKey: queryKeys.messages(channelId!, cursor),
        queryFn: () =>
            messagesApi.list({
                channelId: channelId!,
                cursor,
                limit,
                direction,
            }),
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
            queryClient.invalidateQueries({ queryKey: ['messages', variables.channelId] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'infinite', variables.channelId] });
        },
    });
}

export function useUpdateMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMessageDto }) =>
            messagesApi.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['messages', data.message.channelId] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'infinite', data.message.channelId] });
            queryClient.invalidateQueries({ queryKey: queryKeys.messageDetail(data.message.id) });
        },
    });
}

export function useDeleteMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, channelId }: { id: string; channelId: string }) =>
            messagesApi.delete(id).then(() => ({ id, channelId })),
        onSuccess: (_, { channelId }) => {
            queryClient.invalidateQueries({ queryKey: ['messages', channelId] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'infinite', channelId] });
        },
    });
}