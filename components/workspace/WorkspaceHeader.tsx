'use client';

import { Channel } from '@/lib/api/channels';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface WorkspaceHeaderProps {
  channel?: Channel;
}

export function WorkspaceHeader({ channel }: WorkspaceHeaderProps) {
  return (
    <div className="h-14 border-b bg-white px-4 flex items-center justify-between">
      <div>
        {channel ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              #{channel.name}
            </h2>
            {channel.description && (
              <p className="text-sm text-gray-500">{channel.description}</p>
            )}
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-gray-900">Workspace</h2>
        )}
      </div>
    </div>
  );
}
