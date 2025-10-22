'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { Alert } from '@/components/ui/Alert';
import {
  CheckCircle,
  TrendingUp,
  Target,
  Eye,
  MousePointerClick,
  BarChart3,
  Sparkles,
  Mail,
  Phone,
  Building,
  Globe,
  DollarSign,
  Calendar,
  Image as ImageIcon,
  Award,
  Users,
  Zap
} from 'lucide-react';

export default function AdvertisePage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    bannerPosition: 'MAIN',
    campaignDuration: '1',
    message: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validation
    if (!formData.companyName || !formData.contactName || !formData.email || !formData.phone) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/advertise/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          website: '',
          bannerPosition: 'MAIN',
          campaignDuration: '1',
          message: '',
          budget: ''
        });
      } else {
        setError('Failed to submit your application. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pricingPlans = [
    {
      name: 'Hero Banner',
      position: 'HERO',
      description: 'Prime placement at the top of homepage',
      price: '15,000',
      features: [
        'Homepage hero section',
        'Full-width display',
        'Maximum visibility',
        'Average 50,000+ impressions/month',
        'Premium positioning',
        'Interactive elements supported'
      ],
      icon: Sparkles,
      color: 'purple'
    },
    {
      name: 'Main Banner',
      position: 'MAIN',
      description: 'Featured placement on homepage',
      price: '10,000',
      features: [
        'Homepage featured section',
        'Large display format',
        'High visibility',
        'Average 35,000+ impressions/month',
        'Above vehicle listings',
        'Call-to-action button'
      ],
      icon: Target,
      color: 'blue'
    },
    {
      name: 'Sidebar Banner',
      position: 'SIDEBAR',
      description: 'Persistent display on all pages',
      price: '8,000',
      features: [
        'Visible on all pages',
        'Constant presence',
        'Good engagement',
        'Average 25,000+ impressions/month',
        'Perfect for long campaigns',
        'Multiple format options'
      ],
      icon: BarChart3,
      color: 'green'
    },
    {
      name: 'Content Banner',
      position: 'BETWEEN',
      description: 'Native placement between content',
      price: '6,500',
      features: [
        'Between vehicle listings',
        'Natural integration',
        'High click-through rate',
        'Average 20,000+ impressions/month',
        'Mobile optimized',
        'Non-intrusive'
      ],
      icon: MousePointerClick,
      color: 'yellow'
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Targeted Audience',
      description: 'Reach 100,000+ monthly active car buyers actively searching for vehicles in Namibia.'
    },
    {
      icon: TrendingUp,
      title: 'High Conversion Rate',
      description: 'Average CTR of 3.5% - significantly higher than industry standards.'
    },
    {
      icon: Eye,
      title: 'Premium Visibility',
      description: 'Your brand displayed alongside Namibia\'s most trusted automotive dealers.'
    },
    {
      icon: Zap,
      title: 'Instant Activation',
      description: 'Your campaign goes live within 24 hours of approval.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1F3469] via-[#2A4A7A] to-[#1F3469] text-white py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold">Namibia's Leading Automotive Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Advertise With Cars.na
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Reach 100,000+ active car buyers every month. Boost your brand visibility with targeted advertising on Namibia's most trusted automotive marketplace.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-[#1F3469] hover:bg-blue-50 px-8 py-6 text-lg"
              >
                View Pricing
              </Button>
              <Button
                onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Advertise on Cars.na?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with serious buyers at the perfect moment - when they're actively searching for their next vehicle.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-2 hover:border-blue-500 transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-6 h-6 text-[#1F3469]" />
                  </div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advertising Packages
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing options to fit your budget. All prices in Namibian Dollars (NAD) per month.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`border-2 hover:border-${plan.color}-500 transition-all duration-200 hover:shadow-xl relative overflow-hidden`}
              >
                {plan.position === 'HERO' && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-purple-400 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <div className={`w-12 h-12 bg-${plan.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                    <plan.icon className={`w-6 h-6 text-${plan.color}-600`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">{plan.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">N${plan.price}</span>
                      <span className="text-gray-600 ml-2">/month</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => {
                      setFormData(prev => ({ ...prev, bannerPosition: plan.position }));
                      document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full mt-6 bg-[#1F3469] hover:bg-[#2A4A7A] text-white"
                  >
                    Select Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Custom Packages Available
                </h3>
                <p className="text-gray-700 mb-4">
                  Need a tailored solution? We offer custom advertising packages for long-term campaigns,
                  multiple banner placements, and enterprise clients. Contact us for a personalized quote.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Volume Discounts:</strong> Save up to 25% on 6+ month campaigns •
                  <strong className="ml-4">Multi-Banner Bundles:</strong> Save 15% when booking 2+ positions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Apply for Advertising
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the form below and our team will contact you within 24 hours.
              </p>
            </div>

            {success && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">Application Submitted Successfully!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Thank you for your interest. Our advertising team will contact you within 24 hours to discuss your campaign.
                  </p>
                </div>
              </Alert>
            )}

            {error && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </Alert>
            )}

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Advertising Application Form</CardTitle>
                <CardDescription>
                  Please provide your details and campaign requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Building className="w-5 h-5 mr-2 text-blue-600" />
                      Company Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Company Name *
                        </label>
                        <Input
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Your Company Ltd."
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Person *
                        </label>
                        <Input
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-blue-600" />
                      Contact Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+264 81 234 5678"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website (Optional)
                      </label>
                      <Input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-blue-600" />
                      Campaign Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Banner Position *
                        </label>
                        <select
                          name="bannerPosition"
                          value={formData.bannerPosition}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="HERO">Hero Banner - N$15,000/month</option>
                          <option value="MAIN">Main Banner - N$10,000/month</option>
                          <option value="SIDEBAR">Sidebar Banner - N$8,000/month</option>
                          <option value="BETWEEN">Content Banner - N$6,500/month</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Campaign Duration *
                        </label>
                        <select
                          name="campaignDuration"
                          value={formData.campaignDuration}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="1">1 Month</option>
                          <option value="3">3 Months (Save 10%)</option>
                          <option value="6">6 Months (Save 20%)</option>
                          <option value="12">12 Months (Save 25%)</option>
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Budget (NAD) *
                      </label>
                      <Input
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        placeholder="e.g., N$10,000"
                        required
                      />
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information or Questions
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your advertising goals, target audience, or any specific requirements..."
                      rows={5}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#1F3469] hover:bg-[#2A4A7A] text-white py-6 text-lg"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                    <p className="text-sm text-gray-600 text-center mt-4">
                      By submitting this form, you agree to be contacted by our advertising team.
                      We typically respond within 24 business hours.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1F3469] to-[#2A4A7A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Boost Your Brand?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join leading automotive brands advertising on Namibia's #1 car marketplace.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-[#1F3469] hover:bg-blue-50 px-8 py-6 text-lg"
            >
              Get Started Today
            </Button>
            <Button
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
              onClick={() => window.location.href = '/contact'}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
