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
    const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!cooldownUntil) return;
        const timer = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(timer);
    }, [cooldownUntil]);

    const secondsLeft = cooldownUntil
        ? Math.max(0, Math.ceil((cooldownUntil - now) / 1000))
        : 0;

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
            setCooldownUntil(Date.now() + 60_000);
        } catch (err) {
            const message = getErrorMessage(err, 'Could not resend the code.');
            setError(message);
            const wait = message.match(/(\d+) seconds/);
            if (wait) setCooldownUntil(Date.now() + Number(wait[1]) * 1000);
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
                    disabled={resend.isPending || secondsLeft > 0}
                    className="mt-4 w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60"
                >
                    {resend.isPending
                        ? 'Sending...'
                        : secondsLeft > 0
                          ? `Resend code in ${secondsLeft}s`
                          : 'Resend code'}
                </button>
            </AuthCard>
        </AuthShell>
    );
}
