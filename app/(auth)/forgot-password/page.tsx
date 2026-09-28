'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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
import { useRequestPasswordReset } from '@/hooks/auth';
import { getErrorMessage } from '@/lib/utils/api-error';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const requestReset = useRequestPasswordReset();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        try {
            await requestReset.mutateAsync(email.trim());
            router.push(`/reset-password?email=${encodeURIComponent(email.trim())}`);
        } catch (err) {
            setError(getErrorMessage(err, 'Could not send a reset code.'));
        }
    };

    return (
        <AuthShell>
            <AuthCard
                title="Reset your password"
                description="If that email has an account, we'll send an 8-digit code. It expires in 30 minutes."
            >
                <AuthError message={error} />
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className={authLabelClass}>Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="name@company.com"
                            className={authInputClass}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={requestReset.isPending}
                        className="h-10 w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-700"
                    >
                        {requestReset.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset code'}
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Remember it?{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                        Sign in
                    </Link>
                </p>
            </AuthCard>
        </AuthShell>
    );
}
