'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    channelsApi,
    type CreateChannelDto,
    type UpdateChannelDto,
} from '@/lib/api/channels';
import { queryKeys } from './query-keys';

export function useChannels() {
    return useQuery({
        queryKey: queryKeys.channels.all,
        queryFn: () => channelsApi.list(),
    });
}

export function useChannel(id: string | null) {
    return useQuery({
        queryKey: queryKeys.channels.detail(id!),
        queryFn: () => channelsApi.get(id!),
        enabled: !!id,
    });
}

export function useChannelMembers(channelId: string | null) {
    return useQuery({
        queryKey: queryKeys.channels.members(channelId!),
        queryFn: () => channelsApi.getMembers(channelId!),
        enabled: !!channelId,
    });
}

export function useCreateChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateChannelDto) => channelsApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.channels.all });
        },
    });
}

export function useUpdateChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateChannelDto }) =>
            channelsApi.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.channels.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(id) });
        },
    });
}

export function useDeleteChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => channelsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.channels.all });
        },
    });
}

export function useJoinChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => channelsApi.join(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.channels.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(id) });
            queryClient.invalidateQueries({
                queryKey: queryKeys.channels.members(id),
            });
        },
    });
}

export function useLeaveChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => channelsApi.leave(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.channels.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.channels.detail(id) });
            queryClient.invalidateQueries({
                queryKey: queryKeys.channels.members(id),
            });
        },
    });
}