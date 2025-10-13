'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import {
  Eye,
  EyeOff,
  Car,
  User,
  Lock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function DealerLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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

      // Check if user is dealer after successful login
      const session = await getSession();
      if (session?.user?.role !== 'DEALER' && session?.user?.role !== 'DEALER_ADMIN' && session?.user?.role !== 'DEALER_PRINCIPAL' && session?.user?.role !== 'SALES_EXECUTIVE') {
        setError('Access denied. Dealer account required.');
        return;
      }

      setSuccess('Login successful! Redirecting to dealer dashboard...');

      // Redirect to dealer dashboard after a brief delay
      setTimeout(() => {
        router.push('/dealer/dashboard');
      }, 1500);

    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.email.trim() && formData.password.trim();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F3469] via-[#2A4A7A] to-[#1F3469] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#CB2030]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#109B4A]/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#CB2030] to-[#109B4A] rounded-2xl shadow-lg"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#CB2030] to-[#109B4A] rounded-2xl shadow-lg transform rotate-6"></div>
            <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1F3469] to-[#3B4F86] rounded-2xl shadow-xl">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Dealer Portal</h1>
          <p className="text-slate-300">Cars.na Dealership Dashboard</p>
        </div>

        {/* Login Form */}
        <Card className="backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center text-white flex items-center justify-center gap-2">
              <User className="w-5 h-5" />
              Dealership Login
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Alert Messages */}
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10 text-red-200">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500/50 bg-green-500/10 text-green-200">
                <CheckCircle className="w-4 h-4" />
                <span>{success}</span>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="dealer@example.com"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-[#CB2030] focus:ring-[#CB2030]/20"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-[#CB2030] focus:ring-[#CB2030]/20"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1F3469] to-[#3B4F86] hover:from-[#3B4F86] hover:to-[#1F3469] text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Car className="w-4 h-4" />
                    Access Dealer Portal
                  </div>
                )}
              </Button>
            </form>

            {/* Actions */}
            <div className="space-y-4">
              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-slate-300">
                  Don't have a dealer account?{' '}
                  <a
                    href="/dealers/register"
                    className="text-[#CB2030] hover:text-[#CB2030]/80 font-medium transition-colors"
                  >
                    Register your dealership
                  </a>
                </p>
              </div>
            </div>

            {/* Demo Credentials Info */}
            <div className="mt-4 p-3 bg-[#1F3469]/20 rounded-lg border border-[#1F3469]/30">
              <div className="text-center">
                <p className="text-xs text-slate-200 mb-2">Demo Dealer Credentials:</p>
                <div className="font-mono text-xs text-slate-100">
                  <p>Email: dealer@premium-motors.com</p>
                  <p>Password: dealer123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-400">
            © 2024 Cars.na - Dealer Portal
          </p>
        </div>
      </div>
    </div>
  );
}