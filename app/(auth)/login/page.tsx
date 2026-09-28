'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';

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
import { useLoginPage } from '@/hooks/pages/use-login';

function LoginContent() {
    const searchParams = useSearchParams();
    const next = searchParams.get('next') ?? undefined;
    const { formData, setFormData, error, loading, handleSubmit } = useLoginPage(next);

    return (
        <AuthShell>
            <AuthCard title="Welcome back" description="Sign in to open your workspaces.">
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
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className={authLabelClass}>Password</Label>
                            <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className={authInputClass}
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-10 w-full rounded-lg bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    New here?{' '}
                    <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                        Create an account
                    </Link>
                </p>
            </AuthCard>
        </AuthShell>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-dvh items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
