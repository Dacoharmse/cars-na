'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Eye, EyeOff, Car, Mail, Lock, AlertCircle, CheckCircle, ArrowLeft, Shield, Users, TrendingUp
} from 'lucide-react';

export default function DealerLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
        return;
      }

      const session = await getSession();
      if (session?.user?.role !== 'DEALER_PRINCIPAL' && session?.user?.role !== 'SALES_EXECUTIVE') {
        setError('Access denied. Dealer account required.');
        return;
      }

      setSuccess('Login successful! Redirecting to your dashboard...');
      setTimeout(() => router.push('/dealer/dashboard'), 1500);
    } catch {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email.trim() && formData.password.trim();

  return (
    <div className="flex" style={{ minHeight: '100dvh', marginTop: '-86px' }}>
      {/* ── LEFT PANEL: Brand ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] bg-gray-900 flex-col relative overflow-hidden">
        {/* Subtle red accent top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#CB2030]" />

        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />

        {/* Content */}
        <div className="relative flex flex-col h-full px-10 py-12">
          {/* Logo */}
          <Link href="/" className="inline-block mb-16">
            <Image src="/cars-na-logo.png" alt="Cars.na" width={130} height={40} className="h-9 w-auto brightness-0 invert" />
          </Link>

          {/* Hero text */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-2">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-[#CB2030] mb-4">
                Dealer Portal
              </span>
            </div>
            <h1 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-4">
              Manage your dealership<br />
              <span className="text-gray-400">from one place.</span>
            </h1>
            <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-sm">
              List vehicles, track leads, view analytics, and grow your business — all in your Cars.na dashboard.
            </p>

            {/* Stats */}
            <div className="space-y-5">
              {[
                { icon: Users, value: '200+', label: 'Active dealers on the platform' },
                { icon: TrendingUp, value: '5,000+', label: 'Vehicles listed across Namibia' },
                { icon: Shield, value: 'Verified', label: 'All dealers are verified & trusted' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#CB2030]" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-sm">{value}</span>
                    <span className="text-gray-500 text-sm ml-2">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-white/[0.06]">
            <p className="text-gray-600 text-xs">
              © {new Date().getFullYear()} Cars.na · Namibia&apos;s #1 Car Marketplace
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL: Form ── */}
      <div className="flex-1 bg-white flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 pt-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to site
          </Link>
          <span className="text-sm text-gray-400">
            No account?{' '}
            <Link href="/dealers/register" className="text-[#CB2030] font-semibold hover:text-[#b81c2a] transition-colors">
              Register
            </Link>
          </span>
        </div>

        {/* Form center */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
          <div className="w-full max-w-md">
            {/* Heading */}
            <div className="mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#CB2030] flex items-center justify-center mb-5">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
              <p className="text-sm text-gray-500">Sign in to your dealership account</p>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            {success && (
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-6">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="dealer@example.com"
                    disabled={isLoading}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/20 disabled:opacity-50 disabled:bg-gray-50 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <Link href="/dealer/forgot-password" className="text-xs text-[#CB2030] hover:text-[#b81c2a] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    className="w-full h-11 pl-10 pr-11 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/20 disabled:opacity-50 disabled:bg-gray-50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full h-11 bg-[#CB2030] hover:bg-[#b81c2a] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have a dealership account?{' '}
              <Link href="/dealers/register" className="text-[#CB2030] font-semibold hover:text-[#b81c2a] transition-colors">
                Register your dealership
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
