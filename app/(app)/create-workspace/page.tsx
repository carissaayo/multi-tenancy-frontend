'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Building2,
  ArrowLeft,
  Check,
  AlertCircle,
  Sparkles,
  ImageIcon,
  Zap,
  Crown,
  Building,
} from 'lucide-react';
import { useCreateWorkspace } from '@/hooks/workspace';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api/client';
import { WorkspacePlan } from '@/lib/api/workspaces';

const PLAN_OPTIONS = [
  {
    value: WorkspacePlan.FREE,
    label: 'Free',
    description: 'Perfect for small teams getting started',
    icon: Zap,
    color: 'from-green-500 to-emerald-600',
  },
  {
    value: WorkspacePlan.PRO,
    label: 'Pro',
    description: 'More features for growing teams',
    icon: Crown,
    color: 'from-purple-500 to-indigo-600',
  },
  {
    value: WorkspacePlan.ENTERPRISE,
    label: 'Enterprise',
    description: 'Advanced features for large organizations',
    icon: Building,
    color: 'from-blue-500 to-cyan-600',
  },
] as const;

export default function CreateWorkspacePage() {
  const router = useRouter();
  const createWorkspace = useCreateWorkspace();
  const setCurrentWorkspace = useAuthStore((s) => s.setCurrentWorkspace);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [plan, setPlan] = useState<WorkspacePlan>(WorkspacePlan.FREE);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const nameToSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugManuallyEdited) setSlug(nameToSlug(value));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    createWorkspace.mutate(
      {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        plan,
        logo: logoFile || undefined,
      },
      {
        onSuccess: (data) => {
          setCurrentWorkspace({
            id: data.workspace.id,
            slug: data.workspace.slug,
            name: data.workspace.name,
          });
          apiClient.setWorkspaceSlug(data.workspace.slug);
          router.push('/workspace');
        },
      }
    );
  };

  const error = createWorkspace.error as { response?: { data?: { message?: string } } } | undefined;
  const errorMessage = error?.response?.data?.message || 'Failed to create workspace';

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push('/select-workspace')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Create a Workspace</h1>
          </div>
          <p className="text-gray-600">
            Set up a new workspace for your team to collaborate
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {createWorkspace.isError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900">Error creating workspace</h3>
                  <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Workspace Name */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Workspace Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. My Team, Acme Inc"
                  required
                  maxLength={255}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            {/* Workspace Slug */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Workspace URL <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">your-subdomain.localhost/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true);
                    setSlug(nameToSlug(e.target.value));
                  }}
                  placeholder="nerdy-developers"
                  required
                  maxLength={100}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Lowercase letters, numbers, and hyphens only. No spaces.
              </p>
            </div>

            {/* Logo Upload */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Logo <span className="text-gray-400">(optional)</span>
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
                  {logoPreview ? (
                    <Image
                      src={logoPreview}
                      alt="Logo preview"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
                  >
                    {logoFile ? 'Change logo' : 'Upload logo'}
                  </button>
                  {logoFile && (
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="ml-2 px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    PNG, JPG or GIF.
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What&apos;s this workspace for?"
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 resize-none"
              />
            </div>

            {/* Plan Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Plan
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PLAN_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = plan === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setPlan(option.value)}
                      className={`p-4 border-2 rounded-xl transition-all text-left ${
                        isSelected
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br ${option.color}`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{option.label}</h4>
                            {isSelected && (
                              <Check className="w-4 h-4 text-purple-600 shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/select-workspace')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createWorkspace.isPending || !name.trim() || !slug.trim()}
                className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl transition-all cursor-pointer enabled:hover:from-purple-700 enabled:hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {createWorkspace.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Create Workspace
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
