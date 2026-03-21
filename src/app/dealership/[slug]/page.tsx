'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin, Phone, Mail, Globe, Clock,
  Facebook, Instagram, Twitter, Linkedin,
  Send, MessageCircle, ExternalLink, Car,
  CheckCircle, Star, ArrowLeft, ShieldCheck,
  Gauge, Settings, Fuel, Heart
} from 'lucide-react';

const inputClass =
  'w-full h-11 px-3.5 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/20 transition-colors disabled:opacity-50 disabled:bg-gray-50';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

export default function DealershipProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [dealership, setDealership] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '', vehicleId: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDealership = async () => {
      try {
        const response = await fetch(`/api/dealerships/${slug}`);
        const data = await response.json();
        if (data.success && data.dealership) {
          setDealership(data.dealership);
          setVehicles(data.dealership.vehicles || []);
        }
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    };
    fetchDealership();
  }, [slug]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    try {
      const response = await fetch('/api/dealership-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: contactForm.name,
          senderEmail: contactForm.email,
          senderPhone: contactForm.phone || undefined,
          message: contactForm.message,
          dealershipId: dealership.id,
          vehicleId: contactForm.vehicleId || undefined,
          source: 'dealership_page',
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setFormSubmitted(true);
        setContactForm({ name: '', email: '', phone: '', message: '', vehicleId: '' });
        setTimeout(() => setFormSubmitted(false), 5000);
      } else {
        setFormError(data.error || 'Failed to send message. Please try again.');
      }
    } catch {
      setFormError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsApp = () => {
    if (!dealership) return;
    const msg = encodeURIComponent(`Hi, I'm interested in your vehicles at ${dealership.name}`);
    window.open(`https://wa.me/${dealership.whatsappNumber?.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-gray-200 rounded-xl" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-gray-200 rounded-xl" />
              <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (!dealership) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-[#CB2030]" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Dealership Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">
            The dealership you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/dealers" className="inline-flex items-center gap-2 h-10 px-6 bg-[#CB2030] hover:bg-[#b81c2a] text-white font-semibold rounded-lg text-sm transition-colors">
            Browse Dealers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── HERO HEADER ── */}
      <div
        className="relative h-44 sm:h-56"
        style={{
          backgroundImage: dealership?.coverImage
            ? `linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.55)),url(${dealership.coverImage})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: dealership?.coverImage ? undefined : '#111827',
        }}
      >
        {/* Subtle grid pattern on plain bg */}
        {!dealership?.coverImage && (
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        )}
        {/* Back link */}
        <div className="relative max-w-6xl mx-auto px-4 pt-5">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
        </div>
      </div>

      {/* ── DEALER IDENTITY CARD ── */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm -mt-10 relative z-10 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Logo */}
            <div className="w-20 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
              {dealership.logo ? (
                <img src={dealership.logo} alt={dealership.name} className="w-full h-full object-contain" />
              ) : (
                <Car className="w-9 h-9 text-gray-400" />
              )}
            </div>

            {/* Name & meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">{dealership.name}</h1>
                {dealership.isVerified && (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              {dealership.description && (
                <p className="text-sm text-gray-500 leading-relaxed mb-2 line-clamp-2">{dealership.description}</p>
              )}
              {dealership.city && (
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin className="w-3 h-3" />
                  {[dealership.city, dealership.region].filter(Boolean).join(', ')}
                </div>
              )}
              {/* Specializations */}
              {dealership.specializations && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {dealership.specializations.split(',').map((s: string, i: number) => (
                    <span key={i} className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {s.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              {dealership.whatsappNumber && (
                <button
                  onClick={handleWhatsApp}
                  className="flex-1 sm:flex-none h-10 px-4 bg-[#25D366] hover:bg-[#1eb558] text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
              )}
              {dealership.phone && (
                <a
                  href={`tel:${dealership.phone}`}
                  className="flex-1 sm:flex-none h-10 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
            {[
              { value: dealership._count?.vehicles ?? 0, label: 'Vehicles' },
              { value: dealership.profileViews?.toLocaleString() ?? '0', label: 'Profile Views' },
              { value: dealership.responseTime || '< 1 hr', label: 'Response Time' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-xl sm:text-2xl font-extrabold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Highlight banner */}
          {dealership.highlightActive && dealership.highlightTitle && (
            <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
              <Star className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">{dealership.highlightTitle}</p>
                {dealership.highlightDescription && (
                  <p className="text-xs text-amber-700 mt-0.5">{dealership.highlightDescription}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── LEFT: Vehicles ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Available Vehicles</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{vehicles.length} listing{vehicles.length !== 1 ? 's' : ''} in inventory</p>
                </div>
                {vehicles.length > 0 && (
                  <Link
                    href={`/vehicles?dealer=${dealership.id}`}
                    className="text-sm font-semibold text-[#CB2030] hover:text-[#b81c2a] transition-colors"
                  >
                    View All
                  </Link>
                )}
              </div>

              {vehicles.length === 0 ? (
                <div className="text-center py-14">
                  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Car className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No vehicles available at the moment</p>
                  <p className="text-xs text-gray-400 mt-1">Check back soon or contact the dealer directly</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
                    >
                      {/* Image */}
                      <div className="relative">
                        <img
                          src={vehicle.images?.[0]?.url || vehicle.images?.[0] || '/placeholder-car.jpg'}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          loading="lazy"
                        />
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
                          aria-label="Add to favorites"
                        >
                          <Heart className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                        {vehicle.isNew && (
                          <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">New</span>
                        )}
                        {vehicle.featured && !vehicle.isNew && (
                          <span className="absolute top-2 left-2 bg-[#CB2030] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">Featured</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-gray-900 line-clamp-1 mb-1">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-2">
                          <Gauge className="w-3 h-3 shrink-0" />
                          <span>{vehicle.mileage > 0 ? `${vehicle.mileage.toLocaleString()} km` : 'Brand New'}</span>
                          <span className="text-gray-300">·</span>
                          <Settings className="w-3 h-3 shrink-0" />
                          <span>{vehicle.transmission}</span>
                          <span className="text-gray-300">·</span>
                          <Fuel className="w-3 h-3 shrink-0" />
                          <span>{vehicle.fuelType}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-[#CB2030]">
                            N$ {vehicle.price?.toLocaleString()}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setContactForm(prev => ({ ...prev, vehicleId: vehicle.id })); }}
                            className="text-xs font-semibold text-gray-500 hover:text-[#CB2030] transition-colors"
                          >
                            Inquire
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT: Contact & Info ── */}
          <div className="space-y-4">
            {/* Contact Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">Message Sent!</h3>
                  <p className="text-sm text-gray-500">The dealership will contact you shortly.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-base font-bold text-gray-900 mb-1">Contact Dealership</h2>
                  <p className="text-xs text-gray-400 mb-4">Send an inquiry or request information</p>

                  {formError && (
                    <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                      <span className="text-xs text-red-700">{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className={labelClass}>Name <span className="text-[#CB2030]">*</span></label>
                      <input
                        required
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your name"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email <span className="text-[#CB2030]">*</span></label>
                      <input
                        required
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="your@email.com"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+264 81 123 4567"
                        disabled={isSubmitting}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Message <span className="text-[#CB2030]">*</span></label>
                      <textarea
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))}
                        placeholder="I'm interested in..."
                        disabled={isSubmitting}
                        rows={3}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/20 transition-colors disabled:opacity-50 disabled:bg-gray-50 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-11 bg-[#CB2030] hover:bg-[#b81c2a] disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">Contact Info</h2>
              <div className="space-y-3.5">
                {(dealership.streetAddress || dealership.city) && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Address</p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {[dealership.streetAddress, dealership.city, dealership.region].filter(Boolean).join(', ')}
                        {dealership.postalCode && ` ${dealership.postalCode}`}
                      </p>
                      {dealership.googleMapsUrl && (
                        <a href={dealership.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-[#CB2030] hover:text-[#b81c2a] inline-flex items-center gap-1 mt-1 transition-colors">
                          View on Map <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {dealership.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Phone</p>
                      <a href={`tel:${dealership.phone}`} className="text-sm text-gray-700 hover:text-[#CB2030] transition-colors">{dealership.phone}</a>
                      {dealership.alternatePhone && (
                        <p className="text-sm text-gray-500">{dealership.alternatePhone}</p>
                      )}
                    </div>
                  </div>
                )}

                {dealership.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Email</p>
                      <a href={`mailto:${dealership.email}`} className="text-sm text-gray-700 hover:text-[#CB2030] transition-colors truncate block">{dealership.email}</a>
                    </div>
                  </div>
                )}

                {dealership.website && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Website</p>
                      <a href={`https://${dealership.website}`} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-[#CB2030] hover:text-[#b81c2a] transition-colors truncate block">{dealership.website}</a>
                    </div>
                  </div>
                )}

                {dealership.openingHours && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Hours</p>
                      <pre className="text-sm text-gray-700 whitespace-pre-line font-sans leading-relaxed">{dealership.openingHours}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            {(dealership.facebookUrl || dealership.instagramUrl || dealership.twitterUrl || dealership.linkedinUrl) && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-base font-bold text-gray-900 mb-4">Follow Us</h2>
                <div className="flex gap-2">
                  {[
                    { url: dealership.facebookUrl, icon: Facebook, label: 'Facebook' },
                    { url: dealership.instagramUrl, icon: Instagram, label: 'Instagram' },
                    { url: dealership.twitterUrl, icon: Twitter, label: 'X / Twitter' },
                    { url: dealership.linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
                  ].filter(s => s.url).map(({ url, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-900 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
