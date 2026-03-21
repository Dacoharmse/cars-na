'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  CheckCircle,
  AlertCircle,
  Car,
  Users,
  Shield,
  Headphones,
  ArrowRight
} from 'lucide-react';

const inputCls = 'w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#CB2030]/20 focus:border-[#CB2030] transition-colors';
const labelCls = 'block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5';

const contactMethods = [
  {
    icon: Phone,
    title: 'Phone',
    contact: '+264 81 449 4433',
    action: 'tel:+264814494433',
    note: 'Mon–Fri, 8am–6pm'
  },
  {
    icon: Mail,
    title: 'Email',
    contact: 'support@cars.na',
    action: 'mailto:support@cars.na',
    note: 'Reply within 24h'
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    contact: '+264 81 449 4433',
    action: 'https://wa.me/264814494433',
    note: 'Daily, 8am–8pm'
  }
];

const departments = [
  { icon: Car, title: 'Vehicle Sales', description: 'Buying or selling vehicles', email: 'support@cars.na' },
  { icon: Users, title: 'Dealer Support', description: 'Support for dealership partners', email: 'support@cars.na' },
  { icon: Shield, title: 'Trust & Safety', description: 'Report issues or safety concerns', email: 'support@cars.na' },
  { icon: Headphones, title: 'Technical', description: 'Website and technical assistance', email: 'support@cars.na' }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', category: '', message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', category: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  return (
    <MainLayout>
      {/* Page header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#CB2030] uppercase tracking-widest mb-3">
            <span className="w-6 h-px bg-[#CB2030]" />
            Get in touch
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-500 max-w-xl">
            Have a question about buying, selling, or using Cars.na? Our team is ready to help.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-6xl px-4 py-12">

          {/* Quick contact pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            {contactMethods.map(m => {
              const Icon = m.icon;
              return (
                <a
                  key={m.title}
                  href={m.action}
                  target={m.action.startsWith('http') ? '_blank' : undefined}
                  rel={m.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-[#CB2030]/40 hover:shadow-sm transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#CB2030]/8 flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(203,32,48,0.08)' }}>
                    <Icon className="w-4 h-4 text-[#CB2030]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">{m.title}</p>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#CB2030] transition-colors">{m.contact}</p>
                    <p className="text-[11px] text-gray-400">{m.note}</p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Send us a message</h2>
                <p className="text-sm text-gray-500 mb-6">Fill out the form and we'll get back to you as soon as possible.</p>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-green-800">Message sent!</p>
                      <p className="text-xs text-green-600 mt-0.5">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Failed to send</p>
                      <p className="text-xs text-red-600 mt-0.5">Please try again or contact us directly.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input name="name" value={formData.name} onChange={handleInputChange}
                        placeholder="John Doe" required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                        placeholder="john@example.com" required className={inputCls} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                        placeholder="+264 81 123 4567" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Category</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} className={inputCls}>
                        <option value="">Select a category</option>
                        <option value="general">General Inquiry</option>
                        <option value="buying">Buying a Vehicle</option>
                        <option value="selling">Selling a Vehicle</option>
                        <option value="dealer">Dealer Partnership</option>
                        <option value="technical">Technical Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Subject *</label>
                    <input name="subject" value={formData.subject} onChange={handleInputChange}
                      placeholder="Brief description of your inquiry" required className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange}
                      rows={6} required placeholder="Please provide details about your inquiry..."
                      className={inputCls + ' resize-none'} />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ background: '#CB2030' }}
                  >
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Office */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#CB2030]" /> Office
                </h3>
                <p className="text-sm text-gray-700 font-semibold mb-1">Cars.na Headquarters</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  123 Independence Avenue<br />
                  Windhoek Central, Namibia
                </p>
                <div className="flex items-start gap-2 text-xs text-gray-500 mb-4">
                  <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-400" />
                  <div className="space-y-0.5">
                    <p>Mon–Fri: 8:00 AM – 6:00 PM</p>
                    <p>Sat: 9:00 AM – 4:00 PM</p>
                    <p>Sun: Closed</p>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=123+Independence+Avenue+Windhoek+Namibia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#CB2030] hover:underline"
                >
                  View on Google Maps <ArrowRight className="w-3 h-3" />
                </a>
              </div>

              {/* Social */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex gap-2">
                  {[
                    { href: 'https://facebook.com/cars.na', icon: Facebook, bg: '#1877F2', label: 'Facebook' },
                    { href: 'https://instagram.com/cars.na', icon: Instagram, bg: '#E1306C', label: 'Instagram' },
                    { href: 'https://twitter.com/cars_na', icon: Twitter, bg: '#1DA1F2', label: 'Twitter/X' },
                  ].map(s => {
                    const Icon = s.icon;
                    return (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                        style={{ background: s.bg }}
                        aria-label={s.label}
                      >
                        <Icon className="w-4 h-4" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* FAQ teaser */}
              <div className="bg-gray-900 rounded-2xl p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Quick answers</p>
                <h3 className="text-base font-bold mb-2">Need fast help?</h3>
                <p className="text-sm text-gray-400 mb-4">Browse our Help Center for instant answers to common questions.</p>
                <a href="/help" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#CB2030] hover:underline">
                  Visit Help Center <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact by Department</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.map(dept => {
                const Icon = dept.icon;
                return (
                  <div key={dept.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(203,32,48,0.08)' }}>
                      <Icon className="w-5 h-5 text-[#CB2030]" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{dept.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">{dept.description}</p>
                    <a href={`mailto:${dept.email}`} className="text-xs font-semibold text-[#CB2030] hover:underline">{dept.email}</a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini FAQ */}
          <div className="mt-12 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Common Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {[
                { q: 'How do I list my car for sale?', a: 'Use our "Sell Your Car" wizard — it\'s free and takes just a few minutes.' },
                { q: 'Is Cars.na free to use?', a: 'Yes! Browsing and basic listings are free. Dealers can upgrade for premium features.' },
                { q: 'How do I become a dealer partner?', a: 'Visit our dealer registration page or contact our dealer support team directly.' },
                { q: 'Do you provide financing?', a: 'We offer a financing calculator. For actual loans, apply through your preferred bank or dealership.' },
              ].map(({ q, a }) => (
                <div key={q}>
                  <p className="text-sm font-semibold text-gray-900 mb-1">{q}</p>
                  <p className="text-sm text-gray-500">{a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
