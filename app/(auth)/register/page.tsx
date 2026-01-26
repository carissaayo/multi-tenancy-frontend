'use client';
import Link from 'next/link';
import { Loader2, Sparkles, Users, Zap, Shield } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

import { useRegisterPage } from '@/hooks/pages/use-register';

export default function RegisterPage() {
  const { formData, setFormData, error, success, loading, handleSubmit } = useRegisterPage();

  useEffect(() => {
    if (success) {
      toast.success('Account created! You will be redirected to the login page.');
    }
  }, [success]);

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
                  Collaborate in real-time with your team
                </h2>
                <p className="text-xl text-blue-100">
                  Build faster, ship better. Join thousands of teams already working smarter.
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

      {/* Right Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl shadow-blue-500/10 p-8 border border-gray-100">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Get started with your free workspace today
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-900"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className="h-12 rounded-xl text-gray-900 font-medium placeholder:text-gray-400"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-900"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="h-12 rounded-xl text-gray-900 font-medium placeholder:text-gray-400"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-gray-900"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="h-12 rounded-xl text-gray-900 font-medium placeholder:text-gray-400"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 rounded-xl text-gray-900 font-medium placeholder:text-gray-400"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-gray-900"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 rounded-xl text-gray-900 font-medium placeholder:text-gray-400"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Creating your account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">
            🔒 Your data is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}