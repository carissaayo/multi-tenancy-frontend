'use client';

import { useState } from 'react';
import {
    Hash,
    Lock,
    Plus,
    Search,
    Bell,
    Settings,
    ChevronDown,
    MessageSquare,
    Users,
    Folder,
    Menu,
    X,
    Phone,
    Video,
    Star,
    MoreVertical,
    Volume2,
    Pin
} from 'lucide-react';

export default function WorkspacePage() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeChannel, setActiveChannel] = useState('general');

    const channels = [
        { id: 'general', name: 'general', type: 'public', unread: 0 },
        { id: 'random', name: 'random', type: 'public', unread: 3 },
        { id: 'announcements', name: 'announcements', type: 'public', unread: 0 },
        { id: 'dev-team', name: 'dev-team', type: 'private', unread: 1 },
        { id: 'design', name: 'design', type: 'private', unread: 0 },
    ];

    const directMessages = [
        { id: '1', name: 'Sarah Chen', status: 'online', unread: 2 },
        { id: '2', name: 'Mike Johnson', status: 'away', unread: 0 },
        { id: '3', name: 'Emily Rodriguez', status: 'online', unread: 0 },
        { id: '4', name: 'James Wilson', status: 'offline', unread: 5 },
    ];

    return (
        <div className="h-screen flex bg-gray-50">
            {/* Sidebar */}
            <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gradient-to-b from-purple-900 to-purple-800 text-white transition-all duration-300 flex-shrink-0 overflow-hidden`}>
                <div className="flex flex-col h-full">
                    {/* Workspace Header */}
                    <div className="p-4 border-b border-purple-700/50">
                        <button className="w-full flex items-center justify-between hover:bg-purple-700/30 rounded-lg p-3 transition-colors group">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-purple-900 font-bold text-lg">A</span>
                                </div>
                                <div className="text-left min-w-0">
                                    <h2 className="font-bold text-base truncate">Acme Corp</h2>
                                    <p className="text-xs text-purple-300 truncate">42 members</p>
                                </div>
                            </div>
                            <ChevronDown className="w-5 h-5 text-purple-300 group-hover:text-white flex-shrink-0" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {/* Quick Actions */}
                        <div className="space-y-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-700/30 rounded-lg transition-colors text-sm">
                                <MessageSquare className="w-5 h-5" />
                                <span>Threads</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-700/30 rounded-lg transition-colors text-sm">
                                <Users className="w-5 h-5" />
                                <span>All DMs</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-purple-700/30 rounded-lg transition-colors text-sm">
                                <Star className="w-5 h-5" />
                                <span>Saved Items</span>
                            </button>
                        </div>

                        {/* Channels */}
                        <div>
                            <div className="flex items-center justify-between px-3 mb-2">
                                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Channels</span>
                                <button className="hover:bg-purple-700/30 rounded p-1">
                                    <Plus className="w-4 h-4 text-purple-300" />
                                </button>
                            </div>
                            <div className="space-y-0.5">
                                {channels.map((channel) => (
                                    <button
                                        key={channel.id}
                                        onClick={() => setActiveChannel(channel.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-sm group ${activeChannel === channel.id
                                                ? 'bg-purple-700/50 text-white'
                                                : 'hover:bg-purple-700/30 text-purple-100'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            {channel.type === 'private' ? (
                                                <Lock className="w-4 h-4 flex-shrink-0" />
                                            ) : (
                                                <Hash className="w-4 h-4 flex-shrink-0" />
                                            )}
                                            <span className="truncate">{channel.name}</span>
                                        </div>
                                        {channel.unread > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                                {channel.unread}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Direct Messages */}
                        <div>
                            <div className="flex items-center justify-between px-3 mb-2">
                                <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">Direct Messages</span>
                                <button className="hover:bg-purple-700/30 rounded p-1">
                                    <Plus className="w-4 h-4 text-purple-300" />
                                </button>
                            </div>
                            <div className="space-y-0.5">
                                {directMessages.map((dm) => (
                                    <button
                                        key={dm.id}
                                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-purple-700/30 rounded-lg transition-colors text-sm group"
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-purple-900 ${dm.status === 'online' ? 'bg-green-500' :
                                                        dm.status === 'away' ? 'bg-yellow-500' :
                                                            'bg-gray-400'
                                                    }`}></div>
                                            </div>
                                            <span className="truncate text-purple-100">{dm.name}</span>
                                        </div>
                                        {dm.unread > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                                                {dm.unread}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="p-4 border-t border-purple-700/50">
                        <button className="w-full flex items-center gap-3 hover:bg-purple-700/30 rounded-lg p-3 transition-colors group">
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-purple-900"></div>
                            </div>
                            <div className="flex-1 text-left min-w-0">
                                <p className="font-semibold text-sm truncate">John Doe</p>
                                <p className="text-xs text-purple-300 truncate">Active</p>
                            </div>
                            <Settings className="w-5 h-5 text-purple-300 group-hover:text-white flex-shrink-0" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
                    {/* Left Section */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        <div className="flex items-center gap-2">
                            <Hash className="w-5 h-5 text-gray-600" />
                            <h1 className="text-xl font-bold text-gray-900">general</h1>
                        </div>

                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                            <Star className="w-4 h-4 text-gray-400" />
                        </button>

                        <div className="h-6 w-px bg-gray-200"></div>

                        <p className="text-sm text-gray-500 hidden md:block">
                            Team-wide announcements and work-related matters
                        </p>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Phone className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Video className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="h-6 w-px bg-gray-200 mx-1"></div>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Pin className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Search className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    {/* Sample Message */}
                    <div className="max-w-4xl mx-auto space-y-4">
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
            </div>
        </div>
    );
}