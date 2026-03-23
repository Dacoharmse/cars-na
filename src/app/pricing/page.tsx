'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Check,
  Star,
  Crown,
  Zap,
  Phone,
  Search,
  BarChart3,
  Camera,
  Shield,
  Headphones,
  TrendingUp,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

/* ── Brand palette ─────────────────────────────────── */
const BRAND = {
  navy: '#1F3469',
  red: '#CB2030',
};

interface PricingPlan {
  id: string;
  name: string;
  icon: any;
  description: string;
  price: number;
  originalPrice?: number;
  period: string;
  popular: boolean;
  features: string[];
  color: {
    gradient: string;
    ring: string;
    badge: string;
  };
  buttonText: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    description: 'Perfect for small dealerships just getting started',
    price: 899,
    period: 'month',
    popular: false,
    color: {
      gradient: 'from-blue-500 to-blue-600',
      ring: 'hover:border-blue-300',
      badge: 'bg-blue-50 text-blue-700',
    },
    buttonText: 'Start Free Trial',
    features: [
      'Up to 25 vehicle listings',
      'Basic vehicle detail pages',
      'Standard search visibility',
      'Customer inquiry management',
      'Basic analytics dashboard',
      '5 high-quality photos per vehicle',
      'Mobile-responsive listings',
      'Email support',
      'Dealership profile page',
      'Basic listing promotion',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    icon: Star,
    description: 'Most popular choice for established dealerships',
    price: 2499,
    originalPrice: 2999,
    period: 'month',
    popular: true,
    color: {
      gradient: 'from-violet-500 to-purple-600',
      ring: 'ring-2 ring-[#CB2030]/20 border-[#CB2030]/40',
      badge: 'bg-violet-50 text-violet-700',
    },
    buttonText: 'Start Professional',
    features: [
      'Up to 100 vehicle listings',
      'Priority search placement',
      'Featured listings (10/month)',
      'Enhanced vehicle detail pages',
      'Advanced analytics & reporting',
      '15 photos + 360° spins per vehicle',
      'Customer lead scoring',
      'Automated email campaigns',
      'Homepage carousel feature (monthly)',
      'Social media integration',
      'Custom dealership branding',
      'Performance insights dashboard',
      'Inventory management tools',
      'Phone & email support',
      'CRM integration ready',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Crown,
    description: 'For large dealerships and dealer groups',
    price: 4999,
    period: 'month',
    popular: false,
    color: {
      gradient: 'from-amber-500 to-yellow-500',
      ring: 'hover:border-amber-300',
      badge: 'bg-amber-50 text-amber-700',
    },
    buttonText: 'Contact Sales',
    features: [
      'Unlimited vehicle listings',
      'Hero section featured placement',
      'Premium featured listings (unlimited)',
      'Top search results guarantee',
      'Dedicated account manager',
      'Advanced inventory sync APIs',
      'Multiple location management',
      'White-label solutions',
      'Custom integrations',
      'Advanced CRM integration',
      'Real-time chat support',
      'Custom reporting dashboards',
      'Lead management system',
      'Automated pricing recommendations',
      'Homepage hero section (weekly)',
      'Newsletter sponsorship',
      'Exclusive dealer badge',
      'First-to-market new arrivals',
      'Custom marketing campaigns',
      'Priority customer support',
    ],
  },
];

const features = [
  {
    icon: Search,
    title: 'Enhanced Visibility',
    description: 'Get your vehicles seen by thousands of potential buyers across Namibia',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track performance, leads, and conversions with detailed insights',
  },
  {
    icon: Camera,
    title: 'Professional Listings',
    description: 'Showcase vehicles with high-quality photos and 360° virtual tours',
  },
  {
    icon: Shield,
    title: 'Trusted Platform',
    description: "Join Namibia's most trusted automotive marketplace",
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Get expert help when you need it with our support team',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description: 'Increase sales and reach more customers than ever before',
  },
];

const testimonials = [
  {
    name: 'Johannes Muller',
    company: 'Premium Motors Windhoek',
    quote: "Cars.na has transformed our business. We've seen a 300% increase in leads since joining.",
    plan: 'Enterprise',
  },
  {
    name: 'Maria Silva',
    company: 'City Auto Traders',
    quote: 'The Professional plan gives us everything we need. Excellent value for money.',
    plan: 'Professional',
  },
  {
    name: 'David Shikongo',
    company: 'Desert Wheels',
    quote: 'Started with Starter plan and quickly upgraded. The platform is easy to use and effective.',
    plan: 'Starter',
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const getDiscountedPrice = (price: number) => {
    return billingPeriod === 'annual' ? Math.round(price * 0.85) : price;
  };

  const formatNAD = (amount: number) => {
    return `N$ ${amount.toLocaleString()}`;
  };

  const handleSelectPlan = (planId: string) => {
    // Redirect to dealer login / signup with plan context
    router.push(`/dealer/login?plan=${planId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero Section ────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: BRAND.navy }}>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }} />
        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center">
          <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm mb-6 px-4 py-1.5 text-sm">
            30-Day Free Trial &middot; No Setup Fees
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight leading-tight">
            Grow Your Dealership<br />
            <span style={{ color: '#F59E0B' }}>With the Right Plan</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Join Namibia's leading automotive marketplace. Powerful tools, real leads, measurable results.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* ── Billing Toggle ────────────────────────── */}
        <div className="flex justify-center -mt-6 mb-12">
          <div className="inline-flex items-center bg-white rounded-xl shadow-lg border border-slate-100 p-1.5">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                billingPeriod === 'annual'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Annual
              <span className="text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">
                -15%
              </span>
            </button>
          </div>
        </div>

        {/* ── Pricing Cards ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            const discountedPrice = getDiscountedPrice(plan.price);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 bg-white transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? plan.color.ring
                    : 'border-slate-200 ' + plan.color.ring
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="text-white px-5 py-1 text-xs font-bold shadow-md" style={{ background: BRAND.red }}>
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="p-6 pb-0">
                  {/* Plan icon + name */}
                  <div className="flex items-center gap-3 mb-4 pt-2">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${plan.color.gradient} flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                      <p className="text-xs text-slate-500">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-5">
                    <div className="flex items-baseline gap-2">
                      {plan.originalPrice && billingPeriod === 'monthly' && (
                        <span className="text-base text-slate-300 line-through tabular-nums">
                          {formatNAD(plan.originalPrice)}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-slate-900 tabular-nums tracking-tight">
                        {formatNAD(discountedPrice)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      per {billingPeriod === 'annual' ? 'month, billed annually' : 'month'}
                    </p>
                    {billingPeriod === 'annual' && (
                      <p className="text-xs font-semibold text-emerald-600 mt-1">
                        Save {formatNAD((plan.price - discountedPrice) * 12)} per year
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full mb-5 h-11 font-semibold ${
                      plan.popular
                        ? 'text-white hover:opacity-90 shadow-sm'
                        : 'text-white'
                    }`}
                    style={{ background: plan.popular ? BRAND.red : BRAND.navy }}
                  >
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </div>

                {/* Features list */}
                <div className="border-t border-slate-100 px-6 py-5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">What's included</p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm text-slate-600 gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Why Choose Us ─────────────────────────── */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Why Choose Cars.na?
            </h2>
            <p className="text-slate-500 max-w-lg mx-auto">
              Join successful dealerships already growing their business with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="group rounded-xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 group-hover:bg-[#E8EDF5] flex items-center justify-center mb-4 transition-colors">
                    <Icon className="w-5 h-5 text-slate-500 group-hover:text-[#1F3469] transition-colors" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Testimonials ──────────────────────────── */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Trusted by Leading Dealerships
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-slate-100 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-5 text-sm leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── CTA Section ───────────────────────────── */}
        <div className="mb-16 rounded-2xl overflow-hidden" style={{ background: BRAND.navy }}>
          <div className="relative px-8 py-14 text-center">
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }} />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                Ready to Grow Your Dealership?
              </h2>
              <p className="text-lg text-white/60 mb-8 max-w-lg mx-auto">
                Start your free trial today and reach more customers than ever before
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <Button
                  className="bg-white hover:bg-slate-50 px-7 h-12 font-semibold shadow-lg"
                  style={{ color: BRAND.navy }}
                  onClick={() => handleSelectPlan('professional')}
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-7 h-12 font-semibold"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +264 81 449 4433
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
