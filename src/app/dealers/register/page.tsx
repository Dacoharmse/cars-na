'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { NotificationDialog } from '@/components/notifications/NotificationDialog';
import {
  Building2, User, Mail, Phone, MapPin, Lock,
  CheckCircle, AlertCircle, Eye, EyeOff, ArrowLeft,
  ChevronRight
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  features: string[];
  maxListings: number;
  maxPhotos: number;
  priority: number;
  isActive: boolean;
}

interface RegistrationData {
  businessName: string;
  businessType: string;
  registrationNumber: string;
  taxNumber: string;
  subscriptionPlanId: string;
  contactPerson: string;
  email: string;
  phone: string;
  alternatePhone: string;
  streetAddress: string;
  city: string;
  region: string;
  postalCode: string;
  googleMapsUrl: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

const BUSINESS_TYPES = [
  'Independent Dealer', 'Franchise Dealer', 'Car Lot', 'Auto Auction', 'Import/Export'
];

const NAMIBIAN_CITIES = [
  'Aminuis','Arandis','Aroab','Aranos','Aus','Bethanie','Bukalo','Eenhana','Engela',
  'Gibeon','Gobabis','Grootfontein','Henties Bay','Hoachanas','Kamanjab','Karasburg',
  'Karibib','Katima Mulilo','Keetmanshoop','Khorixas','Leonardville','Linyanti',
  'Lüderitz','Maltahöhe','Mariental','Ngoma','Noordoewer','Okahandja','Okakarara',
  'Okahao','Okongo','Omuthiya','Onayena','Ondangwa','Ongenga','Ongwediva','Opuwo',
  'Oranjemund','Oshakati','Oshikuku','Otavi','Otjinene','Otjiwarongo','Outapi',
  'Outjo','Rehoboth','Ruacana','Rundu','Sesfontein','Stampriet','Swakopmund','Tsumeb',
  'Tses','Usakos','Walvis Bay','Warmbad','Windhoek','Witvlei',
].sort();

const STEPS = [
  { id: 1, label: 'Business Info', icon: Building2 },
  { id: 2, label: 'Subscription', icon: CheckCircle },
  { id: 3, label: 'Contact', icon: User },
  { id: 4, label: 'Address', icon: MapPin },
  { id: 5, label: 'Security', icon: Lock },
];

const inputClass = "w-full h-11 px-3.5 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/20 transition-colors disabled:opacity-50 disabled:bg-gray-50";
const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const errorClass = "mt-1.5 text-xs text-red-600 flex items-center gap-1";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className={errorClass}><AlertCircle className="w-3 h-3 shrink-0" />{msg}</p>;
}

export default function DealerRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationData>({
    businessName: '', businessType: '', registrationNumber: '', taxNumber: '',
    subscriptionPlanId: '', contactPerson: '', email: '', phone: '',
    alternatePhone: '', streetAddress: '', city: '', region: '',
    postalCode: '', googleMapsUrl: '', password: '', confirmPassword: '',
    agreeToTerms: false, agreeToMarketing: false,
  });

  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});

  const [notification, setNotification] = useState<{
    isOpen: boolean; variant: 'success' | 'error'; title: string; message: string;
  }>({ isOpen: false, variant: 'success', title: '', message: '' });

  React.useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/subscription-plans');
        const data = await response.json();
        if (data.success && data.plans) {
          setSubscriptionPlans(data.plans);
          const standardPlan = data.plans.find((p: SubscriptionPlan) => p.slug === 'standard');
          if (standardPlan) setFormData(prev => ({ ...prev, subscriptionPlanId: standardPlan.id }));
        }
      } catch { /* silent */ } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const update = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const e: Partial<Record<keyof RegistrationData, string>> = {};
    if (!formData.businessName.trim()) e.businessName = 'Business name is required';
    if (!formData.businessType) e.businessType = 'Business type is required';
    if (!formData.subscriptionPlanId) e.subscriptionPlanId = 'Please select a subscription plan';
    if (!formData.contactPerson.trim()) e.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Please enter a valid email';
    if (!formData.phone.trim()) e.phone = 'Phone number is required';
    if (!formData.streetAddress.trim()) e.streetAddress = 'Street address is required';
    if (!formData.city) e.city = 'City is required';
    if (!formData.password) e.password = 'Password is required';
    else if (formData.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) e.agreeToTerms = 'You must agree to the terms and conditions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Jump to first step with an error
      if (errors.businessName || errors.businessType) setCurrentStep(1);
      else if (errors.subscriptionPlanId) setCurrentStep(2);
      else if (errors.contactPerson || errors.email || errors.phone) setCurrentStep(3);
      else if (errors.streetAddress || errors.city) setCurrentStep(4);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      let data;
      const ct = response.headers.get('content-type');
      if (ct?.includes('application/json')) data = await response.json();
      else throw new Error('Server returned an invalid response');
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      setNotification({ isOpen: true, variant: 'success', title: 'Registration Successful!', message: data.message || 'Your application is pending admin approval. You will receive an email once approved.' });
    } catch (err) {
      setNotification({ isOpen: true, variant: 'error', title: 'Registration Failed', message: err instanceof Error ? err.message : 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
    if (notification.variant === 'success') window.location.href = '/dealer/login?registered=true';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationDialog
        isOpen={notification.isOpen}
        onClose={handleNotificationClose}
        variant={notification.variant}
        title={notification.title}
        message={notification.message}
        primaryAction={{
          label: notification.variant === 'success' ? 'Go to Login' : 'OK',
          onClick: () => { if (notification.variant === 'success') window.location.href = '/dealer/login?registered=true'; },
        }}
      />

      {/* Top bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to site
          </Link>
          <Link href="/">
            <Image src="/cars-na-logo.png" alt="Cars.na" width={110} height={36} className="h-8 w-auto" />
          </Link>
          <Link href="/dealer/login" className="text-sm font-semibold text-[#CB2030] hover:text-[#b81c2a] transition-colors">
            Sign In
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
          {/* ── LEFT: Sticky progress sidebar ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-xl font-extrabold text-gray-900 mb-1">Register Your Dealership</h1>
                <p className="text-sm text-gray-500">Complete all sections to submit your application</p>
              </div>

              {/* Steps */}
              <nav className="space-y-1">
                {STEPS.map((step) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isDone = currentStep > step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => setCurrentStep(step.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        isActive ? 'bg-[#CB2030] text-white' :
                        isDone ? 'text-gray-700 hover:bg-gray-100' :
                        'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isActive ? 'bg-white/20' :
                        isDone ? 'bg-green-100 text-green-600' :
                        'bg-gray-100'
                      }`}>
                        {isDone ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Icon className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-medium">{step.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </nav>

              {/* Benefits */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Why Cars.na?</p>
                <div className="space-y-3">
                  {[
                    'Reach thousands of buyers across Namibia',
                    'Manage leads from one dashboard',
                    'Verified dealer badge builds trust',
                    'Real-time analytics on your listings',
                  ].map(item => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#CB2030] shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-500 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="mt-6 p-4 bg-gray-100 rounded-xl">
                <p className="text-xs font-semibold text-gray-700 mb-2">Need help?</p>
                <a href="tel:+264814494433" className="flex items-center gap-1.5 text-xs text-[#CB2030] font-medium mb-1 hover:text-[#b81c2a] transition-colors">
                  <Phone className="w-3 h-3" /> +264 81 449 4433
                </a>
                <a href="mailto:support@cars.na" className="flex items-center gap-1.5 text-xs text-[#CB2030] font-medium hover:text-[#b81c2a] transition-colors">
                  <Mail className="w-3 h-3" /> support@cars.na
                </a>
              </div>
            </div>
          </aside>

          {/* ── RIGHT: Form ── */}
          <main>
            {/* Mobile step pills */}
            <div className="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-1">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    currentStep === step.id ? 'bg-[#CB2030] text-white' :
                    currentStep > step.id ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-500'
                  }`}
                >
                  {step.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* ── Step 1: Business ── */}
              {currentStep === 1 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-[#CB2030] flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">Business Information</h2>
                    </div>
                    <p className="text-sm text-gray-500 ml-11">Tell us about your dealership</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Business Name <span className="text-[#CB2030]">*</span></label>
                      <input type="text" value={formData.businessName} onChange={e => update('businessName', e.target.value)} placeholder="Your dealership name" className={inputClass} />
                      <FieldError msg={errors.businessName} />
                    </div>
                    <div>
                      <label className={labelClass}>Business Type <span className="text-[#CB2030]">*</span></label>
                      <select value={formData.businessType} onChange={e => update('businessType', e.target.value)} className={inputClass}>
                        <option value="">Select type</option>
                        {BUSINESS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <FieldError msg={errors.businessType} />
                    </div>
                    <div>
                      <label className={labelClass}>Registration Number <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="text" value={formData.registrationNumber} onChange={e => update('registrationNumber', e.target.value)} placeholder="Business reg. number" className={inputClass} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>VAT / Tax Number <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="text" value={formData.taxNumber} onChange={e => update('taxNumber', e.target.value)} placeholder="VAT / Tax number" className={inputClass} />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button type="button" onClick={() => setCurrentStep(2)} className="h-11 px-7 bg-[#CB2030] hover:bg-[#b81c2a] text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Subscription ── */}
              {currentStep === 2 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-[#CB2030] flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">Choose Your Plan</h2>
                    </div>
                    <p className="text-sm text-gray-500 ml-11">Select the plan that works for your business</p>
                  </div>

                  {loadingPlans ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="rounded-xl border border-gray-200 p-6 animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
                          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
                          <div className="space-y-2">
                            {[1,2,3].map(j => <div key={j} className="h-3 bg-gray-100 rounded" />)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {subscriptionPlans.map((plan) => {
                        const features = Array.isArray(plan.features) ? plan.features : JSON.parse(plan.features as any);
                        const isSelected = formData.subscriptionPlanId === plan.id;
                        const isPopular = plan.slug === 'standard';
                        return (
                          <div
                            key={plan.id}
                            onClick={() => update('subscriptionPlanId', plan.id)}
                            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected ? 'border-[#CB2030] bg-red-50/40' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {isPopular && (
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#CB2030] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                                Most Popular
                              </span>
                            )}
                            <h4 className="font-bold text-gray-900 mb-1">{plan.name}</h4>
                            <div className="text-2xl font-extrabold text-[#CB2030] mb-1">
                              N${(plan.price / 100).toFixed(0)}
                              <span className="text-sm font-normal text-gray-400">/mo</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-4">{plan.description}</p>
                            <div className="space-y-1.5">
                              {features.slice(0, 4).map((f: string, i: number) => (
                                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                                  {f}
                                </div>
                              ))}
                            </div>
                            {isSelected && (
                              <div className="mt-4 flex items-center gap-1.5 text-[#CB2030] text-xs font-semibold">
                                <CheckCircle className="w-4 h-4" /> Selected
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <FieldError msg={errors.subscriptionPlanId} />

                  <div className="mt-8 flex items-center justify-between">
                    <button type="button" onClick={() => setCurrentStep(1)} className="h-11 px-5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-sm transition-colors flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="button" onClick={() => setCurrentStep(3)} className="h-11 px-7 bg-[#CB2030] hover:bg-[#b81c2a] text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Contact ── */}
              {currentStep === 3 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-[#CB2030] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
                    </div>
                    <p className="text-sm text-gray-500 ml-11">Who should we contact about your account?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Contact Person <span className="text-[#CB2030]">*</span></label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={formData.contactPerson} onChange={e => update('contactPerson', e.target.value)} placeholder="Primary contact name" className={inputClass + ' pl-10'} />
                      </div>
                      <FieldError msg={errors.contactPerson} />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address <span className="text-[#CB2030]">*</span></label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" value={formData.email} onChange={e => update('email', e.target.value)} placeholder="contact@dealership.com" className={inputClass + ' pl-10'} />
                      </div>
                      <FieldError msg={errors.email} />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number <span className="text-[#CB2030]">*</span></label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="tel" value={formData.phone} onChange={e => update('phone', e.target.value)} placeholder="+264 81 123 4567" className={inputClass + ' pl-10'} />
                      </div>
                      <FieldError msg={errors.phone} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Alternate Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="tel" value={formData.alternatePhone} onChange={e => update('alternatePhone', e.target.value)} placeholder="+264 81 234 5678" className={inputClass + ' pl-10'} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button type="button" onClick={() => setCurrentStep(2)} className="h-11 px-5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-sm transition-colors flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="button" onClick={() => setCurrentStep(4)} className="h-11 px-7 bg-[#CB2030] hover:bg-[#b81c2a] text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 4: Address ── */}
              {currentStep === 4 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-[#CB2030] flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">Business Address</h2>
                    </div>
                    <p className="text-sm text-gray-500 ml-11">Where is your dealership located?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Street Address <span className="text-[#CB2030]">*</span></label>
                      <input type="text" value={formData.streetAddress} onChange={e => update('streetAddress', e.target.value)} placeholder="123 Main Street" className={inputClass} />
                      <FieldError msg={errors.streetAddress} />
                    </div>
                    <div>
                      <label className={labelClass}>City <span className="text-[#CB2030]">*</span></label>
                      <select value={formData.city} onChange={e => update('city', e.target.value)} className={inputClass}>
                        <option value="">Select city</option>
                        {NAMIBIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <FieldError msg={errors.city} />
                    </div>
                    <div>
                      <label className={labelClass}>Region</label>
                      <input type="text" value={formData.region} onChange={e => update('region', e.target.value)} placeholder="Khomas" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Postal Code</label>
                      <input type="text" value={formData.postalCode} onChange={e => update('postalCode', e.target.value)} placeholder="9000" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Google Maps Link <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="url" value={formData.googleMapsUrl} onChange={e => update('googleMapsUrl', e.target.value)} placeholder="https://maps.google.com/..." className={inputClass} />
                      <p className="mt-1.5 text-xs text-gray-400">Paste your Google Maps share link to help customers find you</p>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button type="button" onClick={() => setCurrentStep(3)} className="h-11 px-5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-sm transition-colors flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="button" onClick={() => setCurrentStep(5)} className="h-11 px-7 bg-[#CB2030] hover:bg-[#b81c2a] text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 5: Security & Submit ── */}
              {currentStep === 5 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-[#CB2030] flex items-center justify-center">
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">Account Security</h2>
                    </div>
                    <p className="text-sm text-gray-500 ml-11">Create a strong password for your account</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className={labelClass}>Password <span className="text-[#CB2030]">*</span></label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={e => update('password', e.target.value)}
                          placeholder="Minimum 8 characters"
                          className={inputClass + ' pl-10 pr-11'}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Toggle password">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <FieldError msg={errors.password} />
                    </div>
                    <div>
                      <label className={labelClass}>Confirm Password <span className="text-[#CB2030]">*</span></label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={e => update('confirmPassword', e.target.value)}
                          placeholder="Confirm your password"
                          className={inputClass + ' pl-10 pr-11'}
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Toggle confirm password">
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <FieldError msg={errors.confirmPassword} />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-4 pt-2 border-t border-gray-100 mt-6">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={e => update('agreeToTerms', e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-[#CB2030] cursor-pointer"
                      />
                      <label htmlFor="agreeToTerms" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
                        I agree to the{' '}
                        <Link href="/terms" className="text-[#CB2030] hover:underline">Terms & Conditions</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-[#CB2030] hover:underline">Privacy Policy</Link>
                        {' '}<span className="text-[#CB2030]">*</span>
                      </label>
                    </div>
                    <FieldError msg={errors.agreeToTerms} />

                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="agreeToMarketing"
                        checked={formData.agreeToMarketing}
                        onChange={e => update('agreeToMarketing', e.target.checked)}
                        className="mt-0.5 w-4 h-4 accent-[#CB2030] cursor-pointer"
                      />
                      <label htmlFor="agreeToMarketing" className="text-sm text-gray-500 cursor-pointer leading-relaxed">
                        Send me marketing communications and platform updates
                      </label>
                    </div>
                  </div>

                  {/* Summary box */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Application Summary</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-400">Business:</span> <span className="text-gray-800 font-medium">{formData.businessName || '—'}</span></div>
                      <div><span className="text-gray-400">Type:</span> <span className="text-gray-800 font-medium">{formData.businessType || '—'}</span></div>
                      <div><span className="text-gray-400">Email:</span> <span className="text-gray-800 font-medium">{formData.email || '—'}</span></div>
                      <div><span className="text-gray-400">City:</span> <span className="text-gray-800 font-medium">{formData.city || '—'}</span></div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <button type="button" onClick={() => setCurrentStep(4)} className="h-11 px-5 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg text-sm transition-colors flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-11 px-8 bg-[#CB2030] hover:bg-[#b81c2a] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                      ) : (
                        <><CheckCircle className="w-4 h-4" /> Submit Application</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Already have account */}
            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account?{' '}
              <Link href="/dealer/login" className="text-[#CB2030] font-semibold hover:text-[#b81c2a] transition-colors">
                Sign in here
              </Link>
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
