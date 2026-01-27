'use client';

import { Loader2, Plus, Building2, Users, ArrowRight, Sparkles, Search, Hash } from 'lucide-react';
import { useSelectWorkspacePage } from '@/hooks/pages/use-select-workspace';

// optional: deterministic color from slug
function workspaceColor(slug: string) {
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-orange-500'];
  let n = 0;
  for (let i = 0; i < slug.length; i++) n += slug.charCodeAt(i);
  return colors[n % colors.length];
}

export default function SelectWorkspacePage() {
  const {
    workspaces,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedId,
    selectWorkspace,
    handleSelectWorkspace,
    handleCreateWorkspace,
  } = useSelectWorkspacePage();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
          <p className="text-red-600 mb-4">Failed to load workspaces. Please try again.</p>
          {/* optional: retry button that refetches */}
        </div>
      </div>
    );
  }
  
  

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">
              Dev<span className="text-blue-600">Col</span>
            </h1>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
            Choose your workspace
          </h2>
          <p className="text-lg text-gray-600">
            Select a workspace to continue or create a new one
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/5 p-8 border border-gray-100">
          {workspaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleSelectWorkspace(workspace)}
                  disabled={selectWorkspace.isPending}
                  className="group relative p-6 border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed bg-white hover:bg-linear-to-br hover:from-blue-50 hover:to-purple-50"
                >
                  {selectWorkspace.isPending && selectedId === workspace.id && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 ${workspaceColor(workspace.slug)} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{workspace.name}</h3>
                      <p className="text-sm text-gray-500">@{workspace.slug}</p>
                    </div>
                  </div>

                  {workspace.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workspace.description}</p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {workspace.membersCount != null && (
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {workspace.membersCount} {workspace.membersCount === 1 ? 'member' : 'members'}
                        </span>
                      )}
                      {workspace.channelCount != null && (
                        <span className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          {workspace.channelCount} {workspace.channelCount === 1 ? 'channel' : 'channels'}
                        </span>
                      )}
                      {workspace.membersCount == null && workspace.channelCount == null && (
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Workspace
                        </span>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>


                </button>
              ))}

              <button
                onClick={handleCreateWorkspace}
                className="group relative p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-blue-500 hover:bg-linear-to-br hover:from-blue-50 hover:to-purple-50 transition-all text-left"
              >
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                  <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">Create New Workspace</h3>
                  <p className="text-sm text-gray-500">Start fresh with a new team space</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No workspaces found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or create a new workspace
              </p>
              <button
                onClick={handleCreateWorkspace}
                className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" /> Create Workspace
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? <a href="/support" className="text-blue-600 hover:text-blue-700 font-semibold">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}