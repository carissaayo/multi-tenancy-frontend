'use client';

import { useParams } from 'next/navigation';
import { Plus, Volume2, } from 'lucide-react';
import { ChannelNavbar } from '@/components/workspace/channel-navbar';
import { EmptyChannelState } from '@/components/layout/empty-channel-state';

export default function WorkspacePage() {
    const params = useParams();
    const channelId = params?.channelId as string | undefined;


    // Channel content when a channel is selected
    return (
        <>
        {channelId ?
        
        <div className="flex-1 flex flex-col min-w-0">
            <ChannelNavbar channelName="general" />

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* Sample Messages */}
                    <div className="flex gap-4 hover:bg-gray-100/50 p-3 rounded-lg transition-colors group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-semibold text-gray-900">John Doe</span>
                                <span className="text-xs text-gray-500">10:30 AM</span>
                            </div>
                            <p className="text-gray-700">
                                Welcome to the #general channel! This is where we discuss team-wide topics.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 hover:bg-gray-100/50 p-3 rounded-lg transition-colors group">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-semibold text-gray-900">Sarah Chen</span>
                                <span className="text-xs text-gray-500">10:32 AM</span>
                            </div>
                            <p className="text-gray-700">
                                Thanks! Excited to be here 🎉
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 hover:bg-gray-100/50 p-3 rounded-lg transition-colors group">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-semibold text-gray-900">Mike Johnson</span>
                                <span className="text-xs text-gray-500">10:35 AM</span>
                            </div>
                            <p className="text-gray-700">
                                Don't forget about our standup meeting at 2 PM today!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-3">
                        <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                            <Plus className="w-5 h-5 text-gray-600" />
                        </button>
                        <input
                            type="text"
                            placeholder="Message #general"
                            className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                        />
                        <button className="p-2 hover:bg-gray-200 rounded transition-colors">
                            <Volume2 className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
                </div> : <EmptyChannelState appName="DevCol" />
    }

        </>
    );
}