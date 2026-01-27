export const queryKeys = {
    auth: ['auth'] as const,
    workspaces: {
        all: ['workspaces'] as const,
        forSelect: ['workspaces', 'select'] as const, 
        detail: (id: string) => ['workspaces', id] as const,
    },
    members: ['members'] as const,
    channels: {
        all: ['channels'] as const,
        forSelect: ['channels', 'select'] as const,  
        detail: (id: string) => ['channels', id] as const,
        members: (id: string) => ['channels', id, 'members'] as const,
    },
    messages: (channelId: string, page?: number) =>
        page != null
            ? (['messages', channelId, page] as const)
            : (['messages', channelId] as const),
    messageDetail: (id: string) => ['messages', 'detail', id] as const,
};