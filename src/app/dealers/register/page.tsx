'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface RegistrationData {
  // Business Information
  businessName: string;
  businessType: string;
  registrationNumber: string;
  taxNumber: string;
  
  // Contact Information
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone: string;
  
  // Address Information
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  googleMapsUrl: string;
  
  // Account Information
  password: string;
  confirmPassword: string;
  
  // Terms and Conditions
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

const BUSINESS_TYPES = [
  'Independent Dealer',
  'Franchise Dealer',
  'Car Lot',
  'Auto Auction',
  'Import/Export'
];

const NAMIBIAN_CITIES = [
  'Windhoek',
  'Swakopmund',
  'Walvis Bay',
  'Oshakati',
  'Rundu',
  'Katima Mulilo',
  'Otjiwarongo',
  'Gobabis',
  'Keetmanshoop',
  'Tsumeb'
];

export default function DealerRegisterPage() {
  const [formData, setFormData] = useState<RegistrationData>({
    businessName: '',
    businessType: '',
    registrationNumber: '',
    taxNumber: '',
    contactPerson: '',
    email: '',
    phone: '',
    alternatePhone: '',
    streetAddress: '',
    city: '',
    region: '',
    postalCode: '',
    googleMapsUrl: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToMarketing: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<RegistrationData>>({});

  const updateFormData = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};

    // Required field validation
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.businessType) newErrors.businessType = 'Business type is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Try to parse JSON response
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned an invalid response');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Success - redirect to login with success message
      alert(data.message || 'Registration successful! Please check your email to verify your account.');
      window.location.href = '/dealer/login?registered=true';

    } catch (error) {
      console.error('Registration error:', error);
      alert(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Join Cars.na as a Dealer
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Expand your reach and connect with thousands of potential customers across Namibia. 
              Register your dealership today and start selling more cars.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Professional Presence</h3>
                <p className="text-sm text-slate-600">Showcase your inventory with professional listings</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Lead Management</h3>
                <p className="text-sm text-slate-600">Track and manage customer inquiries efficiently</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Verified Listings</h3>
                <p className="text-sm text-slate-600">Build trust with verified dealer status</p>
              </CardContent>
            </Card>
          </div>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Dealer Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Business Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Name *</label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => updateFormData('businessName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your dealership name"
                      />
                      {errors.businessName && (
                        <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Type *</label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => updateFormData('businessType', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select business type</option>
                        {BUSINESS_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.businessType && (
                        <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Registration Number</label>
                      <input
                        type="text"
                        value={formData.registrationNumber}
                        onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Business registration number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Tax Number</label>
                      <input
                        type="text"
                        value={formData.taxNumber}
                        onChange={(e) => updateFormData('taxNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="VAT/Tax number"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Contact Person *</label>
                      <input
                        type="text"
                        value={formData.contactPerson}
                        onChange={(e) => updateFormData('contactPerson', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Primary contact name"
                      />
                      {errors.contactPerson && (
                        <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="contact@yourdealership.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+264 61 000 000"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Alternate Phone</label>
                      <input
                        type="tel"
                        value={formData.alternatePhone}
                        onChange={(e) => updateFormData('alternatePhone', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+264 81 000 000"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Business Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">Street Address *</label>
                      <input
                        type="text"
                        value={formData.streetAddress}
                        onChange={(e) => updateFormData('streetAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main Street"
                      />
                      {errors.streetAddress && (
                        <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <select
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select city</option>
                        {NAMIBIAN_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Region</label>
                      <input
                        type="text"
                        value={formData.region}
                        onChange={(e) => updateFormData('region', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Khomas"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => updateFormData('postalCode', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="9000"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Google Maps Location (Optional)
                        <span className="text-xs text-slate-500 ml-2">Share your Google Maps link to help customers find you</span>
                      </label>
                      <input
                        type="url"
                        value={formData.googleMapsUrl}
                        onChange={(e) => updateFormData('googleMapsUrl', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://maps.google.com/..."
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        To get your Google Maps link: Search for your business on Google Maps, click "Share", then copy the link.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Security */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Account Security
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Password *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => updateFormData('password', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Minimum 8 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm Password *</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => updateFormData('agreeToTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="agreeToTerms" className="text-sm text-slate-700">
                      I agree to the <a href="/terms" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a> *
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="agreeToMarketing"
                      checked={formData.agreeToMarketing}
                      onChange={(e) => updateFormData('agreeToMarketing', e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="agreeToMarketing" className="text-sm text-slate-700">
                      I would like to receive marketing communications and updates about Cars.na services
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Create Dealer Account
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.location.href = '/auth/login'}
                    className="flex-1 sm:flex-none"
                  >
                    Already have an account? Login
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Support Information */}
          <div className="mt-12 text-center">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Need Help?</h3>
                </div>
                <p className="text-blue-800 mb-4">
                  Our team is here to help you get started. Contact us if you have any questions about the registration process.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+264-61-000-000"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Phone className="w-4 h-4" />
                    +264 61 000 000
                  </a>
                  <a
                    href="mailto:support@cars.na"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Mail className="w-4 h-4" />
                    support@cars.na
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
