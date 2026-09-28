'use client';

import Link from 'next/link';
import { useEffect } from 'react';
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
import { useRegisterPage } from '@/hooks/pages/use-register';

export default function RegisterPage() {
    const { formData, setFormData, error, success, loading, handleSubmit } = useRegisterPage();

    useEffect(() => {
        if (success) {
            toast.success('Account created. Sign in, then enter the code from your email.');
        }
    }, [success]);

    return (
        <AuthShell>
            <AuthCard title="Create your account" description="We'll email you an 8-digit code to verify it.">
                <AuthError message={error} />
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                        <Label htmlFor="fullName" className={authLabelClass}>Full name</Label>
                        <Input
                            id="fullName"
                            required
                            autoComplete="name"
                            placeholder="John Doe"
                            className={authInputClass}
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className={authLabelClass}>Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="name@company.com"
                            className={authInputClass}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className={authLabelClass}>Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            required
                            autoComplete="tel"
                            placeholder="+2348012345678"
                            className={authInputClass}
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className={authLabelClass}>Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className={authInputClass}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword" className={authLabelClass}>Confirm</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                autoComplete="new-password"
                                placeholder="••••••••"
                                className={authInputClass}
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-10 w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                        Sign in
                    </Link>
                </p>
            </AuthCard>
        </AuthShell>
    );
}
