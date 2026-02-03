'use client';

import React from 'react';
import { MessageSquare, Hash, Menu } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebar-store';

interface EmptyChannelStateProps {
    appName?: string;
}

export const EmptyChannelState: React.FC<EmptyChannelStateProps> = ({
    appName = 'DevCol'
}) => {
    const { setSidebarOpen } = useSidebarStore();

    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-background p-8">
            <div className="max-w-md text-center space-y-6">
                <div className="relative">
                    <div className="w-24 h-24 bg-primary rounded-3xl mx-auto flex items-center justify-center transform rotate-3 shadow-xl text-primary-foreground">
                        <MessageSquare className="w-12 h-12" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-primary/80 rounded-2xl flex items-center justify-center transform -rotate-6 shadow-lg text-primary-foreground">
                        <Hash className="w-8 h-8" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-foreground">
                        Welcome to {appName}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Select a channel from the sidebar to start collaborating with your team
                    </p>
                </div>

                {/* Mobile: Open Sidebar Button */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-lg cursor-pointer"
                >
                    <Menu className="w-5 h-5" />
                    Open Sidebar
                </button>

                <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                    <h3 className="font-semibold text-card-foreground mb-3">Quick Tips:</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground text-left">
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">→</span>
                            <span>Click a channel in the sidebar to view messages</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">→</span>
                            <span>Use the New button to create new channels</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">→</span>
                            <span>Start direct messages with team members</span>
                        </li>
                    </ul>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-primary/80 rounded-full border-2 border-card"></div>
                        <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-card"></div>
                        <div className="w-8 h-8 bg-orange-500 rounded-full border-2 border-card"></div>
                    </div>
                    <span>Join your team in real-time collaboration</span>
                </div>
            </div>
        </div>
    );
};