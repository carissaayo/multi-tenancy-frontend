'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Hash,
    Lock,
    Users,
    Mail,
    LogOut,
    Trash2,
    Edit2,
    X,
    Check,
    Plus,
    Crown,
    Shield,
    AlertCircle
} from 'lucide-react';
import { ChannelNavbar } from '@/components/workspace/channel-navbar';

interface ChannelMember {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: string;
}

export default function ChannelDetailsPage() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [channelName, setChannelName] = useState('general');
    const [channelDescription, setChannelDescription] = useState('Team-wide announcements and work-related matters');
    const [isPrivate, setIsPrivate] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    // Mock data - replace with actual API calls
    const currentUserRole = 'admin'; // or 'owner', 'member'
    const canEdit = currentUserRole === 'owner' || currentUserRole === 'admin';
    const canDelete = currentUserRole === 'owner';

    const members: ChannelMember[] = [
        {
            id: '1',
            fullName: 'John Doe',
            email: 'john@acme.com',
            role: 'owner',
            joinedAt: '2024-01-15',
        },
        {
            id: '2',
            fullName: 'Sarah Chen',
            email: 'sarah@acme.com',
            role: 'admin',
            joinedAt: '2024-01-16',
        },
        {
            id: '3',
            fullName: 'Mike Johnson',
            email: 'mike@acme.com',
            role: 'member',
            joinedAt: '2024-01-20',
        },
    ];

    const handleSave = () => {
        // API call to update channel
        console.log('Saving channel:', { channelName, channelDescription, isPrivate });
        setIsEditing(false);
    };

    const handleInvite = (e: React.FormEvent) => {
        e.preventDefault();
        // API call to invite member
        console.log('Inviting:', inviteEmail);
        setInviteEmail('');
    };

    const handleDeleteChannel = () => {
        // API call to delete channel
        console.log('Deleting channel...');
        router.push('/workspace/channels');
    };

    const handleLeaveChannel = () => {
        // API call to leave channel
        console.log('Leaving channel...');
        router.push('/workspace/channels');
    };

    const handleRemoveMember = (memberId: string) => {
        // API call to remove member
        console.log('Removing member:', memberId);
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'owner':
                return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'admin':
                return <Shield className="w-4 h-4 text-blue-500" />;
            default:
                return null;
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 h-screen">
            <ChannelNavbar
                channelName={channelName}
                channelDescription={channelDescription}
                isPrivate={isPrivate}
            />

            <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {isPrivate ? (
                                    <Lock className="w-8 h-8 text-gray-600" />
                                ) : (
                                    <Hash className="w-8 h-8 text-gray-600" />
                                )}
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {isPrivate ? '' : '#'}{channelName}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {isPrivate ? 'Private Channel' : 'Public Channel'}
                                    </p>
                                </div>
                            </div>
                            {canEdit && (
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    {isEditing ? (
                                        <X className="w-5 h-5 text-gray-600" />
                                    ) : (
                                        <Edit2 className="w-5 h-5 text-gray-600" />
                                    )}
                                </button>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Channel Name
                                    </label>
                                    <input
                                        type="text"
                                        value={channelName}
                                        onChange={(e) => setChannelName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={channelDescription}
                                        onChange={(e) => setChannelDescription(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="private"
                                        checked={isPrivate}
                                        onChange={(e) => setIsPrivate(e.target.checked)}
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="private" className="text-sm text-gray-700">
                                        Make this channel private
                                    </label>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                                    >
                                        <Check className="w-4 h-4" />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-700">{channelDescription}</p>
                        )}
                    </div>

                    {/* Invite Members */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-bold text-gray-900">Invite Members</h2>
                        </div>
                        <form onSubmit={handleInvite} className="flex gap-3">
                            <input
                                type="email"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                placeholder="colleague@example.com"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Invite
                            </button>
                        </form>
                    </div>

                    {/* Members List */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-gray-600" />
                                <h2 className="text-lg font-bold text-gray-900">
                                    Members ({members.length})
                                </h2>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                            {getInitials(member.fullName)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-gray-900">
                                                    {member.fullName}
                                                </p>
                                                {getRoleIcon(member.role)}
                                                <span className="text-xs text-gray-500 capitalize">
                                                    {member.role}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">{member.email}</p>
                                        </div>
                                    </div>
                                    {canEdit && member.role !== 'owner' && (
                                        <button
                                            onClick={() => handleRemoveMember(member.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Leave Channel</h3>
                                    <p className="text-sm text-gray-500">
                                        You will no longer have access to this channel
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowLeaveModal(true)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Leave
                                </button>
                            </div>

                            {canDelete && (
                                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                                    <div>
                                        <h3 className="font-semibold text-red-600">Delete Channel</h3>
                                        <p className="text-sm text-red-500">
                                            Permanently delete this channel and all its messages
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Delete Channel?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>#{channelName}</strong>? This action cannot be undone and all messages will be permanently deleted.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteChannel}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Delete Channel
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Leave Confirmation Modal */}
            {showLeaveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <LogOut className="w-6 h-6 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Leave Channel?</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to leave <strong>#{channelName}</strong>? You'll need to be re-invited to access this channel again.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleLeaveChannel}
                                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Leave Channel
                            </button>
                            <button
                                onClick={() => setShowLeaveModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}