'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/utils/api-error';
import {
    Hash,
    Lock,
    ArrowLeft,
    Check,
    AlertCircle,
    Users,
    Globe
} from 'lucide-react';
import { channelsApi } from '@/lib/api/channels';
import { useAuthStore } from '@/store/auth-store';
import { useWorkspace } from '@/hooks/workspace';

export default function CreateChannelPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { currentWorkspace } = useAuthStore();
    const { data: workspaceData } = useWorkspace(currentWorkspace?.id ?? null);
    const isWorkspaceDeactivated = workspaceData?.workspace?.isActive === false;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isWorkspaceDeactivated) return;
        setLoading(true);
        setError('');

        try {
            const response = await channelsApi.create({
                name,
                description: description || undefined,
                isPrivate,
            });

            // Invalidate channels query to refetch the channel list
            await queryClient.invalidateQueries({ queryKey: ['channels'] });

            // Redirect to the newly created channel
            router.push(`/workspace/channels/${response.channel.id}`);
        } catch (err: any) {
            const msg = getErrorMessage(err, 'Failed to create channel');
            setError(msg);
            toast.error(msg, { duration: 4000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Create a Channel</h1>
                    <p className="text-gray-600 mt-2">
                        Channels are where your team communicates. They&#39;re best organized around a topic, project, or team.
                    </p>
                </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Deactivated workspace notice */}
                        {isWorkspaceDeactivated && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-amber-900">Workspace is deactivated</h3>
                                    <p className="text-sm text-amber-700 mt-1">
                                        Activate the workspace from settings to create channels.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-semibold text-red-900">Error creating channel</h3>
                                    <p className="text-sm text-red-700 mt-1">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Channel Name */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Channel Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Hash className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                                    placeholder="e.g. general, announcements, team-updates"
                                    required
                                    maxLength={50}
                                    disabled={isWorkspaceDeactivated}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Channel names must be lowercase, without spaces. Use hyphens instead.
                            </p>
                            {name && (
                                <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                    <p className="text-sm text-purple-900">
                                        Your channel will appear as: <strong>#{name}</strong>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Channel Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <label className="block text-sm font-semibold text-gray-900 mb-3">
                                Description <span className="text-gray-400">(optional)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What's this channel about?"
                                maxLength={200}
                                rows={4}
                                disabled={isWorkspaceDeactivated}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-sm text-gray-500">
                                    Help others understand what this channel is for
                                </p>
                                <span className="text-xs text-gray-400">
                                    {description.length}/200
                                </span>
                            </div>
                        </div>

                        {/* Privacy Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                Channel Privacy
                            </h3>

                            <div className="space-y-3">
                                {/* Public Option */}
                                <button
                                    type="button"
                                    onClick={() => !isWorkspaceDeactivated && setIsPrivate(false)}
                                    disabled={isWorkspaceDeactivated}
                                    className={`w-full p-4 border-2 rounded-xl transition-all text-left ${!isPrivate
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${!isPrivate ? 'bg-purple-100' : 'bg-gray-100'
                                            }`}>
                                            <Globe className={`w-5 h-5 ${!isPrivate ? 'text-purple-600' : 'text-gray-600'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">Public</h4>
                                                {!isPrivate && (
                                                    <Check className="w-4 h-4 text-purple-600" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Anyone in the workspace can find and join this channel
                                            </p>
                                        </div>
                                    </div>
                                </button>

                                {/* Private Option */}
                                <button
                                    type="button"
                                    onClick={() => !isWorkspaceDeactivated && setIsPrivate(true)}
                                    disabled={isWorkspaceDeactivated}
                                    className={`w-full p-4 border-2 rounded-xl transition-all text-left cursor-pointer ${isPrivate
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isPrivate ? 'bg-purple-100' : 'bg-gray-100'
                                            }`}>
                                            <Lock className={`w-5 h-5 ${isPrivate ? 'text-purple-600' : 'text-gray-600'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-gray-900">Private</h4>
                                                {isPrivate && (
                                                    <Check className="w-4 h-4 text-purple-600" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Only invited members can access this channel
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <div className="flex gap-3">
                                <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-1">
                                        Pro Tip
                                    </h4>
                                    <p className="text-sm text-blue-700">
                                        You can always change these settings later from the channel details page.
                                        Start with public and switch to private if needed!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isWorkspaceDeactivated || loading || !name.trim()}
                                className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl transition-all cursor-pointer enabled:hover:from-purple-700 enabled:hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Create Channel
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}