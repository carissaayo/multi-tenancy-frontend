'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
    AuthCard,
    AuthError,
    AuthShell,
    authInputClass,
    authLabelClass,
} from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useResendVerificationEmail, useVerifyEmail } from '@/hooks/auth';
import { getErrorMessage } from '@/lib/utils/api-error';

export default function VerifyEmailPage() {
    const router = useRouter();
    const verifyEmail = useVerifyEmail();
    const resend = useResendVerificationEmail();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            router.replace('/login');
        }
    }, [router]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            const result = await verifyEmail.mutateAsync(code.trim());
            toast.success(result.message || 'Email verified.');
        } catch (err) {
            setError(getErrorMessage(err, 'That code does not match.'));
        }
    };

    const handleResend = async () => {
        setError('');
        try {
            const result = await resend.mutateAsync();
            toast.success(result.message || 'A new code is on the way.');
        } catch (err) {
            setError(getErrorMessage(err, 'Could not resend the code.'));
        }
    };

    return (
        <AuthShell>
            <AuthCard title="Verify your email" description="Enter the 8-digit code we sent when you signed up.">
                <AuthError message={error} />
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="code" className={authLabelClass}>Verification code</Label>
                        <Input
                            id="code"
                            required
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            placeholder="12345678"
                            className={authInputClass}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={verifyEmail.isPending} className="h-10 w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-700">
                        {verifyEmail.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify email'}
                    </Button>
                </form>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={resend.isPending}
                    className="mt-4 w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60"
                >
                    {resend.isPending ? 'Sending...' : 'Resend code'}
                </button>
            </AuthCard>
        </AuthShell>
    );
}
