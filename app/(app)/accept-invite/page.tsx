'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, MailCheck, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { invitationsApi } from '@/lib/api/invitations';
import { authApi } from '@/lib/api/auth';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/query-keys';
import { getErrorMessage } from '@/lib/utils/api-error';
import { Button } from '@/components/ui/button';

function ErrorView({
  message,
  onGoToWorkspaces,
}: {
  message: string;
  onGoToWorkspaces: () => void;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Invalid or expired invitation</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button onClick={onGoToWorkspaces} className="cursor-pointer">
          Go to workspaces
        </Button>
      </div>
    </div>
  );
}

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = searchParams.get('token');
  const { isAuthenticated } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'checking' | 'redirecting' | 'accepting' | 'error'>('checking');

  useEffect(() => {
    if (!token) return;
    if (!isAuthenticated) {
      const nextUrl = `/accept-invite?token=${encodeURIComponent(token)}`;
      router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
      return;
    }

    let cancelled = false;

    const runAccept = async () => {
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

    queueMicrotask(runAccept);
    return () => {
      cancelled = true;
    };
  }, [token, isAuthenticated, router, queryClient]);

  if (!token) {
    return <ErrorView message="Token is missing" onGoToWorkspaces={() => router.push('/select-workspace')} />;
  }
  if (status === 'error' && error) {
    return <ErrorView message={error} onGoToWorkspaces={() => router.push('/select-workspace')} />;
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

function AcceptInviteFallback() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Joining workspace...</h2>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<AcceptInviteFallback />}>
      <AcceptInviteContent />
    </Suspense>
  );
}
