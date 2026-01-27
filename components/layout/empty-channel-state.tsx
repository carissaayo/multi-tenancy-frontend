import React from 'react';
import { MessageSquare, Hash } from 'lucide-react';

interface EmptyChannelStateProps {
    appName?: string;
}

export const EmptyChannelState: React.FC<EmptyChannelStateProps> = ({
    appName = 'DevCol'
}) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-linear-to-br from-purple-50 via-white to-blue-50 p-8">
            <div className="max-w-md text-center space-y-6">
                <div className="relative">
                    <div className="w-24 h-24 bg-linear-to-br from-purple-500 to-blue-500 rounded-3xl mx-auto flex items-center justify-center transform rotate-3 shadow-xl">
                        <MessageSquare className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-linear-to-br from-blue-400 to-purple-400 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-lg">
                        <Hash className="w-8 h-8 text-white" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome to {appName}
                    </h2>
                    <p className="text-lg text-gray-600">
                        Select a channel from the sidebar to start collaborating with your team
                    </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Quick Tips:</h3>
                    <ul className="space-y-2 text-sm text-gray-600 text-left">
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 font-bold">→</span>
                            <span>Click a channel in the sidebar to view messages</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 font-bold">→</span>
                            <span>Use the New button to create new channels</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-purple-500 font-bold">→</span>
                            <span>Start direct messages with team members</span>
                        </li>
                    </ul>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-linear-to-br from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-linear-to-br from-green-400 to-teal-500 rounded-full border-2 border-white"></div>
                        <div className="w-8 h-8 bg-linear-to-br from-orange-400 to-red-500 rounded-full border-2 border-white"></div>
                    </div>
                    <span>Join your team in real-time collaboration</span>
                </div>
            </div>
        </div>
    );
};