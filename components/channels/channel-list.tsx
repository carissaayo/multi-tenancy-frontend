'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { channelsApi } from '@/lib/api/channels';
import { ChannelItem } from './channel-item';
import { CreateChannelModal } from './create-channel-modal';
import { Button } from '@/components/ui/button';

export function ChannelList() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['channels'],
    queryFn: async () => {
      const response = await channelsApi.list();
      return response.channels;
    },
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Failed to load channels. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-semibold">Channels</h2>
        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          + New
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {data && data.length > 0 ? (
          <div className="p-2">
            {data.map((channel) => (
              <ChannelItem key={channel.id} channel={channel} />
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No channels yet. Create one to get started!
          </div>
        )}
      </div>
      <CreateChannelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}
