'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, MailCheck, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { invitationsApi } from '@/lib/api/invitations';
import { authApi } from '@/lib/api/auth';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/query-keys';
import { getErrorMessage } from '@/lib/utils/api-error';
import { Button } from '@/components/ui/button';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = searchParams.get('token');
  const { isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'checking' | 'redirecting' | 'accepting' | 'error'>('checking');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!token) {
      setError('Token is missing');
      setStatus('error');
      return;
    }

    if (!isAuthenticated) {
      const nextUrl = `/accept-invite?token=${encodeURIComponent(token)}`;
      router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
      setStatus('redirecting');
      return;
    }

    let cancelled = false;

    const accept = async () => {
      setStatus('accepting');
      setError(null);
      try {
        const { workspace } = await invitationsApi.accept(token);
        await authApi.selectWorkspace(workspace.id);
        useAuthStore.getState().setCurrentWorkspace({
          id: workspace.id,
          slug: workspace.slug,
          name: workspace.name,
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.forSelect });
        if (!cancelled) {
          router.replace('/workspace');
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Failed to accept invitation'));
          setStatus('error');
        }
      }
    };

    accept();
    return () => {
      cancelled = true;
    };
  }, [mounted, token, isAuthenticated, router, queryClient]);

  if (status === 'error' && error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid or expired invitation</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => router.push('/select-workspace')}
            className="cursor-pointer"
          >
            Go to workspaces
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {status === 'accepting' ? (
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          ) : (
            <MailCheck className="w-8 h-8 text-blue-600" />
          )}
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {status === 'accepting' ? 'Accepting invitation...' : 'Joining workspace...'}
        </h2>
        <p className="text-gray-600">
          {status === 'accepting'
            ? 'Please wait while we add you to the workspace.'
            : 'Redirecting you to sign in or the workspace.'}
        </p>
      </div>
    </div>
  );
}
