'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import {
  CheckCircle,
  Megaphone,
  Building,
  Mail,
  Phone,
  Globe,
  Calendar,
  MapPin,
  Users,
  Tag,
  DollarSign,
  ArrowLeft,
  Star,
  Eye,
  TrendingUp,
  Zap,
  Car,
  Gavel,
  Layers,
  Gauge,
} from 'lucide-react';

const CATEGORIES = ['Car Show', 'Auction', 'Expo', 'Track Day', 'Other'];

const ATTENDEE_OPTIONS = [
  'Under 100',
  '100 – 500',
  '500 – 1,000',
  '1,000 – 5,000',
  '5,000+',
];

const BENEFITS = [
  {
    icon: Eye,
    title: 'Massive Reach',
    description: 'Get your event in front of 100,000+ monthly active car enthusiasts across Namibia.',
  },
  {
    icon: TrendingUp,
    title: 'Targeted Audience',
    description: 'Every visitor is already interested in automotive events — no wasted impressions.',
  },
  {
    icon: Star,
    title: 'Featured Placement',
    description: 'Your event can be featured in our homepage showcase and navigation mega menu.',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    description: 'Our team reviews and lists approved events within 24–48 hours of your submission.',
  },
];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Car Show': Car,
  'Auction': Gavel,
  'Expo': Layers,
  'Track Day': Gauge,
  'Other': Tag,
};

export default function EventAdvertisePage() {
  const [form, setForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    eventName: '',
    eventDate: '',
    eventCategory: '',
    eventLocation: '',
    expectedAttendees: '',
    description: '',
    budget: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const required: Array<[keyof typeof form, string]> = [
      ['companyName', 'Company Name'],
      ['contactName', 'Contact Person'],
      ['email', 'Email Address'],
      ['phone', 'Phone Number'],
      ['eventName', 'Event Name'],
      ['eventDate', 'Event Date'],
      ['eventLocation', 'Event Location'],
    ];
    for (const [field, label] of required) {
      if (!form[field].trim()) {
        setError(`Please fill in: ${label}`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/events/advertise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setError('A network error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Inquiry Submitted!</h1>
          <p className="text-slate-600 mb-2">
            Thank you for reaching out. Our events team will review your submission and contact you within <strong>24–48 hours</strong>.
          </p>
          <p className="text-sm text-slate-500 mb-8">
            We'll discuss listing options, pricing, and how to maximise your event's visibility on Cars.na.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/events">
              <Button className="bg-[#1F3469] hover:bg-[#2A4A7A] text-white px-6">
                Browse Events
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="px-6">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#1F3469] via-[#2A4A7A] to-[#1F3469] text-white py-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-1.5 mb-5">
              <Megaphone className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-semibold">Promote Your Automotive Event</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Advertise Your Event on Cars.na
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl">
              Reach thousands of passionate car enthusiasts across Namibia. Get your car show, auction, expo, or track day listed on Namibia's leading automotive platform.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {BENEFITS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-start gap-3 p-5 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-[#1F3469]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#1F3469]" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">{title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                Submit Your Event Listing Inquiry
              </h2>
              <p className="text-slate-500">
                Fill in the details below and our team will get back to you within 24–48 hours.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Card className="border border-slate-200 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                  {/* Company / Organiser */}
                  <section>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 mb-4">
                      <Building className="w-4 h-4 text-[#1F3469]" />
                      Organiser Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Company / Organisation <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="companyName"
                          value={form.companyName}
                          onChange={handleChange}
                          placeholder="Windhoek Car Club"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Contact Person <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="contactName"
                          value={form.contactName}
                          onChange={handleChange}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email Address <span className="text-red-500">*</span></span>
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="contact@carclub.na"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number <span className="text-red-500">*</span></span>
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+264 81 234 5678"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website <span className="text-slate-400 font-normal">(optional)</span></span>
                        </label>
                        <Input
                          type="url"
                          name="website"
                          value={form.website}
                          onChange={handleChange}
                          placeholder="https://yourclub.na"
                        />
                      </div>
                    </div>
                  </section>

                  <div className="border-t border-slate-100" />

                  {/* Event Details */}
                  <section>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 mb-4">
                      <Calendar className="w-4 h-4 text-[#1F3469]" />
                      Event Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Event Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          name="eventName"
                          value={form.eventName}
                          onChange={handleChange}
                          placeholder="Windhoek Classic Car Show 2026"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Event Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          name="eventDate"
                          value={form.eventDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Category</span>
                        </label>
                        <select
                          name="eventCategory"
                          value={form.eventCategory}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#1F3469]/30 focus:border-[#1F3469]"
                        >
                          <option value="">Select a category</option>
                          {CATEGORIES.map(c => {
                            const Icon = CATEGORY_ICONS[c] || Tag;
                            return <option key={c} value={c}>{c}</option>;
                          })}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Event Location / City <span className="text-red-500">*</span></span>
                        </label>
                        <Input
                          name="eventLocation"
                          value={form.eventLocation}
                          onChange={handleChange}
                          placeholder="Windhoek, Namibia"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Expected Attendance <span className="text-slate-400 font-normal">(optional)</span></span>
                        </label>
                        <select
                          name="expectedAttendees"
                          value={form.expectedAttendees}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-[#1F3469]/30 focus:border-[#1F3469]"
                        >
                          <option value="">Select expected attendance</option>
                          {ATTENDEE_OPTIONS.map(o => (
                            <option key={o} value={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </section>

                  <div className="border-t border-slate-100" />

                  {/* Additional Info */}
                  <section>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 mb-4">
                      <Megaphone className="w-4 h-4 text-[#1F3469]" />
                      Additional Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Event Description / Goals <span className="text-slate-400 font-normal">(optional)</span>
                        </label>
                        <Textarea
                          name="description"
                          value={form.description}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about your event — what makes it special, what you'd like to achieve, target audience, etc."
                          className="resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> Advertising Budget (NAD) <span className="text-slate-400 font-normal">(optional)</span></span>
                        </label>
                        <Input
                          name="budget"
                          value={form.budget}
                          onChange={handleChange}
                          placeholder="e.g., N$5,000"
                        />
                        <p className="text-xs text-slate-400 mt-1.5">
                          We offer listing packages from free basic listings to premium featured placements. Sharing your budget helps us recommend the best option.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Submit */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#1F3469] hover:bg-[#2A4A7A] text-white py-3 text-base font-semibold"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Megaphone className="w-4 h-4" />
                          Submit Inquiry
                        </span>
                      )}
                    </Button>
                    <p className="text-xs text-slate-400 text-center mt-3">
                      By submitting, you agree to be contacted by our events team. We typically respond within 24–48 business hours.
                    </p>
                  </div>

                </form>
              </CardContent>
            </Card>

            {/* Contact alternative */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                Prefer to talk directly?{' '}
                <Link href="/contact" className="text-[#1F3469] font-semibold hover:underline">
                  Contact our events team
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
