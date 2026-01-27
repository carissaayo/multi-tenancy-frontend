'use client';

import { WorkspaceHeader } from '@/components/workspace/channel-navbar';

export default function ChannelsPage() {
  return (
    <div className="flex flex-col h-screen">
      <WorkspaceHeader />
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Select a channel to start messaging
          </h3>
          <p className="text-gray-500">
            Choose a channel from the sidebar or create a new one
          </p>
        </div>
      </div>
    </div>
  );
}
