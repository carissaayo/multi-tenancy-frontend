'use client';

import { useQuery } from '@tanstack/react-query';
import { channelsApi } from '@/lib/api/channels';
import { ChannelItem } from './channel-item';

export function ChannelList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const response = await channelsApi.list();
      return response.channels;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 bg-purple-700/30 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2 text-sm text-red-300">
        Failed to load channels
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="px-3 py-2 text-sm text-purple-300">
        No channels yet
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {data.map((channel) => (
        <ChannelItem key={channel.id} channel={channel} />
      ))}
    </div>
  );
}
