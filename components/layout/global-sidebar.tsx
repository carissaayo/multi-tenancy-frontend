'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ChevronDown,
    Hash,
    Lock,
    MessageSquare,
    Plus,
    Settings,
    Star,
    Users,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
// use channels hook or ChannelList; mock DMs for now

type Props = { open: boolean; onToggle: () => void };

export function GlobalSidebar({ open, onToggle }: Props) {
    const pathname = usePathname();
    const { currentWorkspace, user } = useAuthStore();
    // const { data: channels } = useChannels(); // your hook
    const channels = []; // or from API
    const directMessages = []; // mock: { id, name, status, unread }[]

    return (
        <div
            className={`${open ? 'w-64' : 'w-0'
                } bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-all duration-300 flex-shrink-0 overflow-hidden`}
        >
            <div className="flex flex-col h-full w-64">
                {/* Workspace header */}
                <div className="p-4 border-b border-purple-700/50">
                    <Link href="/select-workspace" className="block">
                        <button className="w-full flex items-center justify-between hover:bg-purple-700/30 rounded-lg p-3 ...">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 bg-white rounded-lg ...">
                                    <span className="text-purple-900 font-bold text-lg">
                                        {currentWorkspace?.name?.slice(0, 1) ?? 'W'}
                                    </span>
                                </div>
                                <div className="text-left min-w-0">
                                    <h2 className="font-bold truncate">{currentWorkspace?.name ?? 'Select workspace'}</h2>
                                    <p className="text-xs text-purple-300 truncate">...</p>
                                </div>
                            </div>
                            <ChevronDown className="w-5 h-5 ..." />
                        </button>
                    </Link>
                </div>

                {/* Nav: Threads, All DMs, Saved */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div className="space-y-1">
                        <Link href="/workspace/channels">
                            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-700/30 rounded-lg ...">
                                <MessageSquare className="w-5 h-5" /> <span>Threads</span>
                            </button>
                        </Link>
                        {/* All DMs, Saved Items — similar */}
                    </div>

                    {/* Channels */}
                    <div>
                        <div className="flex items-center justify-between px-3 mb-2">
                            <span className="text-xs font-semibold text-purple-300 uppercase ...">Channels</span>
                            <button className="hover:bg-purple-700/30 rounded p-1">...</button>
                        </div>
                        <div className="space-y-0.5">
                            {channels.map((ch) => (
                                <Link key={ch.id} href={`/workspace/channels/${ch.id}`}>
                                    <button className={`w-full flex ... ${pathname === `/workspace/channels/${ch.id}` ? 'bg-purple-700/50' : '...'}`}>
                                        {ch.isPrivate ? <Lock /> : <Hash />}
                                        <span className="truncate">{ch.name}</span>
                                        {ch.unreadCount ? <span className="...">{ch.unreadCount}</span> : null}
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* DMs — mock */}
                    <div>...</div>
                </div>

                {/* User profile */}
                <div className="p-4 border-t border-purple-700/50">
                    <Link href="/workspace/settings">
                        <button className="w-full flex items-center gap-3 hover:bg-purple-700/30 rounded-lg p-3 ...">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg" />
                            <div className="flex-1 text-left min-w-0">
                                <p className="font-semibold text-sm truncate">{user?.fullName ?? 'User'}</p>
                                <p className="text-xs text-purple-300 truncate">{user?.email}</p>
                            </div>
                            <Settings className="w-5 h-5 ..." />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}