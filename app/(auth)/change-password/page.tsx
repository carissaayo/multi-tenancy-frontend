'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
import { useChangePassword } from '@/hooks/auth';
import { getErrorMessage } from '@/lib/utils/api-error';

export default function ChangePasswordPage() {
    const router = useRouter();
    const changePassword = useChangePassword();
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            router.replace('/login');
        }
    }, [router]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError('');
        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
            const result = await changePassword.mutateAsync({
                password,
                newPassword,
                confirmNewPassword,
            });
            toast.success(result.message || 'Password changed.');
            setPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            setError(getErrorMessage(err, 'Could not change your password.'));
        }
    };

    return (
        <AuthShell>
            <AuthCard title="Change password" description="Use the password you sign in with today.">
                <AuthError message={error} />
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className={authLabelClass}>Current password</Label>
                        <Input id="password" type="password" required autoComplete="current-password" className={authInputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
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
                    <Button type="submit" disabled={changePassword.isPending} className="h-10 w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-700">
                        {changePassword.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update password'}
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    <Link href="/select-workspace" className="font-semibold text-blue-600 hover:text-blue-700">
                        Back to workspaces
                    </Link>
                </p>
            </AuthCard>
        </AuthShell>
    );
}
