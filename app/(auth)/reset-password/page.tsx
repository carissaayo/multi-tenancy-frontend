'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { useResetPassword } from '@/hooks/auth';
import { getErrorMessage } from '@/lib/utils/api-error';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const resetPassword = useResetPassword();
    const [email, setEmail] = useState(searchParams.get('email') ?? '');
    const [passwordResetCode, setPasswordResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const result = await resetPassword.mutateAsync({
                email: email.trim(),
                passwordResetCode: passwordResetCode.trim(),
                newPassword,
                confirmNewPassword,
            });
            toast.success(result.message || 'Password updated. Sign in with the new one.');
        } catch (err) {
            setError(getErrorMessage(err, 'That code is invalid or expired.'));
        }
    };

    return (
        <AuthShell>
            <AuthCard title="Choose a new password" description="Enter the 8-digit code from your email.">
                <AuthError message={error} />
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className={authLabelClass}>Email</Label>
                        <Input id="email" type="email" required autoComplete="email" className={authInputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="code" className={authLabelClass}>Reset code</Label>
                        <Input id="code" required inputMode="numeric" autoComplete="one-time-code" placeholder="12345678" className={authInputClass} value={passwordResetCode} onChange={(e) => setPasswordResetCode(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="newPassword" className={authLabelClass}>New password</Label>
                            <Input id="newPassword" type="password" required minLength={6} autoComplete="new-password" className={authInputClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmNewPassword" className={authLabelClass}>Confirm</Label>
                            <Input id="confirmNewPassword" type="password" required minLength={6} autoComplete="new-password" className={authInputClass} value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                        </div>
                    </div>
                    <Button type="submit" disabled={resetPassword.isPending} className="h-10 w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-700">
                        {resetPassword.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    <Link href="/forgot-password" className="font-semibold text-blue-600 hover:text-blue-700">
                        Send a new code
                    </Link>
                </p>
            </AuthCard>
        </AuthShell>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex h-dvh items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
