'use client';

import { useQuery } from '@tanstack/react-query';
import { channelsApi } from '@/lib/api/channels';
import { ChannelItem } from './channel-item';
import { ErrorDisplay } from '@/components/ui/error-display';

interface ChannelListProps {
  /** When true, disables channel navigation (e.g. workspace deactivated) */
  disabled?: boolean;
}

export function ChannelList({ disabled = false }: ChannelListProps) {
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
          <div key={i} className="h-8 bg-sidebar-accent rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-3 py-2">
        <ErrorDisplay
          error={error}
          fallback="Failed to load channels"
          variant="compact"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="px-3 py-2 text-sm text-sidebar-foreground/80">
        No channels yet
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {data.map((channel) => (
        <ChannelItem key={channel.id} channel={channel} disabled={disabled} />
      ))}
    </div>
  );
}
