'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import {
  Check,
  Star,
  Crown,
  Zap,
  Phone,
  Mail,
  MessageSquare,
  TrendingUp,
  Camera,
  Search,
  BarChart3,
  Shield,
  Headphones,
  Sparkles
} from 'lucide-react';

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
  limitations?: string[];
  color: string;
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
    color: 'border-blue-200 hover:border-blue-300',
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
      'Basic listing promotion'
    ],
    limitations: [
      'Limited to 25 listings',
      'Basic analytics only',
      'Email support only'
    ]
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
    color: 'border-purple-300 hover:border-purple-400 ring-2 ring-purple-500',
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
      'CRM integration ready'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Crown,
    description: 'For large dealerships and dealer groups',
    price: 4999,
    period: 'month',
    popular: false,
    color: 'border-yellow-200 hover:border-yellow-300',
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
      'Priority customer support'
    ]
  }
];

const features = [
  {
    icon: Search,
    title: 'Enhanced Visibility',
    description: 'Get your vehicles seen by thousands of potential buyers across Namibia'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track performance, leads, and conversions with detailed insights'
  },
  {
    icon: Camera,
    title: 'Professional Listings',
    description: 'Showcase vehicles with high-quality photos and 360° virtual tours'
  },
  {
    icon: Shield,
    title: 'Trusted Platform',
    description: 'Join Namibia\'s most trusted automotive marketplace'
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    description: 'Get expert help when you need it with our support team'
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    description: 'Increase sales and reach more customers than ever before'
  }
];

const testimonials = [
  {
    name: 'Johannes Müller',
    company: 'Premium Motors Windhoek',
    quote: 'Cars.na has transformed our business. We\'ve seen a 300% increase in leads since joining.',
    plan: 'Enterprise'
  },
  {
    name: 'Maria Silva',
    company: 'City Auto Traders',
    quote: 'The Professional plan gives us everything we need. Excellent value for money.',
    plan: 'Professional'
  },
  {
    name: 'David Shikongo',
    company: 'Desert Wheels',
    quote: 'Started with Starter plan and quickly upgraded. The platform is easy to use and effective.',
    plan: 'Starter'
  }
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const getDiscountedPrice = (price: number) => {
    return billingPeriod === 'annual' ? Math.round(price * 0.85) : price;
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    // Implementation would redirect to signup/checkout
    console.log('Selected plan:', planId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Choose Your <span className="text-yellow-300">Success</span> Plan
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Join Namibia's leading automotive marketplace and grow your dealership with our powerful platform
            </p>
            <div className="flex justify-center items-center space-x-4">
              <Badge className="bg-green-500 text-white px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                30-Day Free Trial
              </Badge>
              <Badge className="bg-blue-500 text-white px-4 py-2">
                No Setup Fees
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingPeriod === 'annual'
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <Badge className="ml-2 bg-green-500 text-white text-xs">
                Save 15%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => {
            const Icon = plan.icon;
            const discountedPrice = getDiscountedPrice(plan.price);

            return (
              <Card key={plan.id} className={`relative ${plan.color} transition-all duration-300 hover:shadow-xl`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-500 text-white px-6 py-2">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{plan.description}</p>

                  <div className="mt-4">
                    <div className="flex items-center justify-center">
                      {plan.originalPrice && billingPeriod === 'monthly' && (
                        <span className="text-lg text-gray-400 line-through mr-2">
                          NAD {plan.originalPrice.toLocaleString()}
                        </span>
                      )}
                      <span className="text-4xl font-bold text-gray-900">
                        NAD {discountedPrice.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      per {billingPeriod === 'annual' ? 'month (billed annually)' : 'month'}
                    </p>
                    {billingPeriod === 'annual' && (
                      <p className="text-green-600 text-xs font-medium mt-1">
                        Save NAD {((plan.price - discountedPrice) * 12).toLocaleString()} annually
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full mb-6 ${
                      plan.popular
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-sm">What's included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Cars.na?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of successful dealerships already growing their business with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by Leading Dealerships
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">
                      {testimonial.plan} Plan
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl text-white text-center p-8">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Grow Your Dealership?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join Cars.na today and start reaching more customers than ever before
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
              <Phone className="w-4 h-4 mr-2" />
              Call Sales: +264 61 000 000
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}