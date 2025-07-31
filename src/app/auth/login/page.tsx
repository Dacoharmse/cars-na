'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <p className="text-neutral-600">Welcome back to Cars.na</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
                
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                />
                
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 h-4 w-4 rounded border-neutral-300" />
                    Remember me
                  </label>
                  <Link href="/auth/forgot-password" className="text-primary-600 hover:text-primary-700">
                    Forgot password?
                  </Link>
                </div>
                
                <Button type="submit" fullWidth>
                  Sign In
                </Button>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-neutral-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" fullWidth>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" fullWidth>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>
              </div>
              
              <p className="mt-6 text-center text-sm text-neutral-600">
                Don't have an account?{' '}
                <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
