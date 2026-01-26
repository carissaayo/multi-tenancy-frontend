'use client';

import { useState } from 'react';
import { Loader2, Sparkles, Users, Zap, Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            if (formData.email && formData.password) {
                // Success - would redirect to /select-workspace
                console.log('Login successful');
                setLoading(false);
            } else {
                setError('Please enter your credentials');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen flex bg-linear-to-br from-blue-50 via-white to-purple-50">
            {/* Left Side - Branding & Features */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 p-12 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="relative z-10 flex flex-col justify-between w-full text-white">
                    <div>
                        <div className="flex items-center gap-2 mb-12">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter">
                                Dev<span className="text-blue-200">Col</span>
                            </h1>
                        </div>

                        <div className="space-y-8 max-w-lg">
                            <div>
                                <h2 className="text-5xl font-bold leading-tight mb-4">
                                    Welcome back to your workspace
                                </h2>
                                <p className="text-xl text-blue-100">
                                    Continue building amazing things with your team.
                                </p>
                            </div>

                            <div className="space-y-6 mt-12">
                                <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Multi-workspace Support</h3>
                                        <p className="text-blue-100 text-sm">Organize your projects across unlimited workspaces with granular access control.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Lightning Fast</h3>
                                        <p className="text-blue-100 text-sm">Real-time sync across all devices. Never miss a beat with instant notifications.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Enterprise Security</h3>
                                        <p className="text-blue-100 text-sm">Bank-level encryption, SSO, and compliance certifications you can trust.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12">
                        <div className="flex items-center gap-8 text-sm">
                            <div>
                                <div className="text-3xl font-bold">10K+</div>
                                <div className="text-blue-200">Active Teams</div>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div>
                                <div className="text-3xl font-bold">99.9%</div>
                                <div className="text-blue-200">Uptime SLA</div>
                            </div>
                            <div className="w-px h-12 bg-white/20"></div>
                            <div>
                                <div className="text-3xl font-bold">24/7</div>
                                <div className="text-blue-200">Support</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-2xl shadow-blue-500/10 p-8 border border-gray-100">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                                Welcome back
                            </h2>
                            <p className="text-gray-600">
                                Sign in to access your workspaces
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-6 flex items-start gap-3">
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                    Email Address
                                </Label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        className="h-12 pl-12 rounded-xl"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({ ...formData, email: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                        Password
                                    </Label>
                                    <a
                                        href="/forgot-password"
                                        className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                    >
                                        Forgot Password?
                                    </a>
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-12 pl-12 rounded-xl"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({ ...formData, password: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center gap-2">
                                <Input
                                    id="remember"
                                    type="checkbox"
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                                    Keep me signed in for a day
                                </Label>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                New to DevCol?{' '}
                                <a
                                    href="/register"
                                    className="font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Create an account
                                </a>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        🔒 Protected by enterprise-grade security
                    </p>
                </div>
            </div>
        </div>
    );
}