'use client';

// Force dynamic rendering - no static generation
export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HomeShowcase } from "@/components/HomeShowcase";
import { Card, CardContent } from '@/components/ui/Card';
import { Search, Eye, Star, Car, DollarSign, MapPin, Phone, Zap, ArrowRight } from 'lucide-react';
import CarFilterSearch from "@/components/CarFilterSearch";
import { DealerContactModal } from "@/components/DealerContactModal";
import { DynamicBanner } from "@/components/DynamicBanner";


export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [featuredDealership, setFeaturedDealership] = useState<any>(null);
  const [dealershipLoading, setDealershipLoading] = useState(true);

  // Fetch featured dealership on mount
  React.useEffect(() => {
    const fetchFeaturedDealership = async () => {
      try {
        const response = await fetch('/api/dealerships/featured');
        const data = await response.json();
        if (data.success && data.dealership) {
          setFeaturedDealership(data.dealership);
        }
      } catch (error) {
        console.error('Failed to fetch featured dealership');
      } finally {
        setDealershipLoading(false);
      }
    };
    fetchFeaturedDealership();
  }, []);

  // Handle main search form submission
  const handleMainSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchQuery.trim()) searchParams.set('search', searchQuery.trim());
    if (selectedMake) searchParams.set('make', selectedMake);
    if (selectedLocation) searchParams.set('location', selectedLocation);
    const queryString = searchParams.toString();
    router.push(queryString ? `/vehicles?${queryString}` : '/vehicles');
  };

  // Handle quick search for popular vehicles
  const handleQuickSearch = (searchTerm: string) => {
    router.push(`/vehicles?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <MainLayout>
      {/* ═══════════════════════════════════════════
          HERO SECTION — Dark, immersive, cinematic
         ═══════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0B1628]">
        {/* Layered background */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1628] via-[#122044] to-[#0B1628]" />
          {/* Dot pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px]" />
          {/* Glow accents */}
          <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-[#1F3469]/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#CB2030]/15 rounded-full blur-[100px]" />
          <div className="absolute top-0 right-1/3 w-[300px] h-[300px] bg-[#D4A853]/10 rounded-full blur-[80px]" />
          {/* Diagonal accent line */}
          <div className="absolute top-0 right-0 w-[600px] h-full bg-gradient-to-l from-[#1F3469]/8 to-transparent skew-x-[-12deg] translate-x-20" />
        </div>

        <div className="relative container mx-auto px-4 py-12 lg:py-0">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* ── Left: Hero content ── */}
              <div className="text-left z-10 space-y-7">
                {/* Trust badge */}
                <div className="animate-fade-up delay-0 inline-flex items-center gap-3 bg-white/[0.06] backdrop-blur-md rounded-full px-5 py-2.5 border border-white/10">
                  <span className="w-2 h-2 bg-[#34D399] rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-[#34D399] tracking-wide">Namibia&apos;s Leading Car Marketplace</span>
                </div>

                {/* Headline — Bricolage Grotesque, extreme weights */}
                <h1 className="animate-fade-up delay-100 font-display">
                  <span className="block text-[3.2rem] sm:text-[4rem] md:text-[5rem] lg:text-[5.5rem] font-extralight leading-[0.95] tracking-tight text-white/90">
                    Find Your
                  </span>
                  <span className="block text-[3.5rem] sm:text-[4.5rem] md:text-[5.5rem] lg:text-[6rem] font-extrabold leading-[0.95] tracking-tight mt-1">
                    <span className="bg-gradient-to-r from-white via-white to-[#D4A853] bg-clip-text text-transparent">
                      Perfect Car
                    </span>
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="animate-fade-up delay-200 text-lg md:text-xl text-white/50 max-w-lg leading-relaxed font-light">
                  Connect with verified dealers across Windhoek, Swakopmund, and beyond.{' '}
                  <span className="text-white/70 font-medium">No hidden fees, secure transactions.</span>
                </p>

                {/* Stats row — animated counters */}
                <div className="animate-fade-up delay-300 flex items-center gap-8 pt-2">
                  {[
                    { value: '200+', label: 'Dealers', color: 'text-[#34D399]' },
                    { value: '5,000+', label: 'Listings', color: 'text-[#D4A853]' },
                    { value: '5 Yrs', label: 'Trusted', color: 'text-[#60A5FA]' },
                  ].map((stat, i) => (
                    <div key={stat.label} className="animate-count-up" style={{ animationDelay: `${400 + i * 100}ms` }}>
                      <div className={`text-2xl md:text-3xl font-extrabold font-display ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/40 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Search bar */}
                <div className="animate-fade-up delay-500 hidden lg:block pt-2">
                  <button
                    onClick={() => setSearchDialogOpen(true)}
                    className="group w-full max-w-md flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-white/25 hover:bg-white/[0.1] transition-all duration-300"
                  >
                    <Search className="w-5 h-5 text-white/40 group-hover:text-[#D4A853] transition-colors" />
                    <span className="text-white/40 group-hover:text-white/60 text-sm transition-colors">Search 5,000+ verified listings...</span>
                    <kbd className="ml-auto hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-white/30 text-xs font-mono">
                      ⌘K
                    </kbd>
                  </button>
                </div>

                {/* CTA buttons */}
                <div className="animate-fade-up delay-600 flex flex-col sm:flex-row gap-4 pt-2">
                  <Button
                    size="lg"
                    className="bg-[#CB2030] hover:bg-[#E04B56] text-white font-semibold text-base px-8 py-6 rounded-xl shadow-lg shadow-[#CB2030]/25 hover:shadow-xl hover:shadow-[#CB2030]/30 hover:-translate-y-0.5 transition-all duration-300"
                    onClick={() => setSearchDialogOpen(true)}
                  >
                    <Car className="w-5 h-5 mr-2" />
                    Find Your Car
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-semibold text-base px-8 py-6 rounded-xl transition-all duration-300"
                    onClick={() => router.push('/sell')}
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Sell Your Car
                  </Button>
                </div>
              </div>

              {/* ── Right: Featured dealership card ── */}
              <div className="relative hidden lg:block animate-slide-right delay-400">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 bg-white/[0.04] backdrop-blur-xl border border-white/10">
                  {/* Card header */}
                  <div className="bg-gradient-to-r from-[#D4A853] via-[#E8C878] to-[#D4A853] p-5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_70%)]" />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0B1628] rounded-xl flex items-center justify-center">
                          <Star className="w-5 h-5 text-[#D4A853]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#0B1628] tracking-tight font-display">Featured Dealership</h3>
                          <p className="text-sm text-[#0B1628]/70 font-medium">Premium Partner</p>
                        </div>
                      </div>
                      <span className="text-xs bg-[#0B1628]/15 px-3 py-1.5 rounded-full font-semibold text-[#0B1628]/80">Sponsored</span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-7">
                    {dealershipLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-white/20 border-t-[#D4A853]" />
                      </div>
                    ) : !featuredDealership ? (
                      <div className="text-center py-12">
                        <p className="text-white/50">No featured dealership available</p>
                      </div>
                    ) : (
                      <>
                        {/* Dealership info */}
                        <div className="flex items-start gap-5 mb-6">
                          <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-[#1F3469] to-[#3B4F86] rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                              <span className="text-2xl font-bold text-white font-display">
                                {featuredDealership.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                            {featuredDealership.isVerified && (
                              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-[#34D399] rounded-full flex items-center justify-center border-2 border-[#0B1628]">
                                <span className="text-white text-xs font-bold">✓</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-1.5 tracking-tight font-display">{featuredDealership.name}</h4>
                            <p className="text-white/50 text-sm mb-3 leading-relaxed">{featuredDealership.description || 'Premium automotive dealer'}</p>
                            <div className="flex flex-wrap items-center gap-3">
                              {featuredDealership.city && (
                                <span className="flex items-center gap-1.5 bg-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white/70">
                                  <MapPin className="w-3.5 h-3.5 text-[#CB2030]" />
                                  {featuredDealership.city}
                                </span>
                              )}
                              {featuredDealership.phone && (
                                <span className="flex items-center gap-1.5 bg-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white/70">
                                  <Phone className="w-3.5 h-3.5 text-[#34D399]" />
                                  {featuredDealership.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          {[
                            { value: featuredDealership.stats.vehiclesCount, label: 'Vehicles', accent: 'from-[#34D399]/15 to-[#34D399]/5', text: 'text-[#34D399]', border: 'border-[#34D399]/20' },
                            { value: featuredDealership.stats.rating, label: 'Rating', accent: 'from-[#D4A853]/15 to-[#D4A853]/5', text: 'text-[#D4A853]', border: 'border-[#D4A853]/20' },
                            { value: featuredDealership.stats.yearsInBusiness, label: 'Experience', accent: 'from-[#60A5FA]/15 to-[#60A5FA]/5', text: 'text-[#60A5FA]', border: 'border-[#60A5FA]/20' },
                          ].map((s) => (
                            <div key={s.label} className={`text-center p-4 bg-gradient-to-br ${s.accent} rounded-xl border ${s.border}`}>
                              <div className={`text-2xl font-extrabold font-display ${s.text}`}>{s.value}</div>
                              <div className="text-[10px] text-white/40 font-semibold uppercase tracking-wider mt-1">{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Special offer */}
                    <div className="bg-gradient-to-r from-[#D4A853]/10 to-[#D4A853]/5 border border-[#D4A853]/20 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-7 h-7 bg-[#D4A853] rounded-lg flex items-center justify-center">
                          <Zap className="w-3.5 h-3.5 text-[#0B1628]" />
                        </div>
                        <span className="font-bold text-[#D4A853] text-sm">Special Offer</span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">0% financing available on selected vehicles. Trade-in bonuses up to N$50,000!</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-[#D4A853] hover:bg-[#E8C878] text-[#0B1628] font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 rounded-xl"
                        onClick={() => featuredDealership?.slug ? router.push(`/dealership/${featuredDealership.slug}`) : router.push('/vehicles')}
                      >
                        View Inventory
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2 border-white/15 text-white hover:bg-white/10 hover:border-white/30 font-semibold transition-all duration-300 rounded-xl"
                        onClick={() => setContactModalOpen(true)}
                      >
                        Contact Dealer
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-5 -left-5 animate-subtle-float z-20">
                  <div className="bg-gradient-to-br from-[#D4A853] to-[#E8C878] rounded-2xl p-4 shadow-xl rotate-[-6deg]">
                    <div className="text-lg font-black text-[#0B1628] leading-none font-display">TOP</div>
                    <div className="text-[10px] text-[#0B1628]/70 font-bold uppercase tracking-widest mt-0.5">Dealer</div>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 z-20">
                  <div className="bg-[#0B1628] border border-white/10 rounded-xl p-3 shadow-xl">
                    <div className="text-base font-bold text-[#34D399] font-display">24/7</div>
                    <div className="text-[10px] text-white/50 font-medium">Support</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Mobile featured dealership ── */}
            <div className="relative block lg:hidden mt-10 mb-8 animate-fade-up delay-400">
              <div className="rounded-2xl overflow-hidden bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-xl">
                <div className="bg-gradient-to-r from-[#D4A853] to-[#E8C878] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#0B1628] rounded-full flex items-center justify-center">
                        <Star className="w-3.5 h-3.5 text-[#D4A853]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#0B1628]">Featured Dealership</h3>
                        <p className="text-xs text-[#0B1628]/60">Premium Partner</p>
                      </div>
                    </div>
                    <span className="text-xs bg-[#0B1628]/10 px-2 py-1 rounded-full font-medium text-[#0B1628]/70">Sponsored</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1F3469] to-[#3B4F86] rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold text-white font-display">
                        {featuredDealership ? featuredDealership.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'NM'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-white mb-0.5 font-display">{featuredDealership?.name || 'Namibia Motors'}</h4>
                      <p className="text-xs text-white/50 mb-2">{featuredDealership?.description || 'Premium dealer in Windhoek since 1995'}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1 text-white/50"><MapPin className="w-3 h-3 text-[#CB2030]" />{featuredDealership?.city || 'Windhoek'}</span>
                        <span className="flex items-center gap-1 text-white/50"><Phone className="w-3 h-3 text-[#34D399]" />{featuredDealership?.phone || '+264 61 123 456'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2.5 bg-[#34D399]/10 rounded-lg border border-[#34D399]/20">
                      <div className="text-base font-bold text-[#34D399] font-display">{featuredDealership?.stats?.vehiclesCount || '150+'}</div>
                      <div className="text-[10px] text-white/40">Vehicles</div>
                    </div>
                    <div className="text-center p-2.5 bg-[#D4A853]/10 rounded-lg border border-[#D4A853]/20">
                      <div className="text-base font-bold text-[#D4A853] font-display">{featuredDealership?.stats?.rating || '4.9'}</div>
                      <div className="text-[10px] text-white/40">Rating</div>
                    </div>
                    <div className="text-center p-2.5 bg-[#60A5FA]/10 rounded-lg border border-[#60A5FA]/20">
                      <div className="text-base font-bold text-[#60A5FA] font-display">{featuredDealership?.stats?.yearsInBusiness || '28yrs'}</div>
                      <div className="text-[10px] text-white/40">Experience</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-[#D4A853] hover:bg-[#E8C878] text-[#0B1628] font-semibold text-sm rounded-xl" onClick={() => featuredDealership?.slug ? router.push(`/dealership/${featuredDealership.slug}`) : router.push('/vehicles')}>
                      View Inventory
                    </Button>
                    <Button variant="outline" className="border-white/15 text-white hover:bg-white/10 text-sm px-4 rounded-xl" onClick={() => setContactModalOpen(true)}>
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════
                SEARCH FORM — Frosted glass card
               ═══════════════════════════════════ */}
            <div className="animate-fade-up delay-700 mt-8 lg:mt-16 mb-8">
              <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl p-6 lg:p-8 border border-white/10 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-xl lg:text-2xl font-bold text-white font-display">Find Your Perfect Car</h3>
                  <p className="text-white/40 text-sm mt-1">Search through 5,000+ verified listings from trusted Namibian dealers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="main-search" className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5" />
                      What are you looking for?
                    </label>
                    <Input
                      id="main-search"
                      type="text"
                      placeholder="e.g., Toyota Hilux, BMW X3..."
                      value={searchQuery}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                      onKeyPress={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleMainSearch(); }}
                      className="w-full h-12 bg-white/[0.06] border-white/10 text-white placeholder:text-white/30 focus:border-[#D4A853] focus:ring-[#D4A853]/30 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="make-select" className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
                      <Car className="w-3.5 h-3.5" />
                      Make
                    </label>
                    <select
                      id="make-select"
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      className="w-full h-12 bg-white/[0.06] border border-white/10 text-white rounded-xl px-3 text-sm focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]/30 outline-none"
                    >
                      <option value="" className="bg-[#0B1628]">Any Make</option>
                      {['Toyota', 'Ford', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Nissan', 'Isuzu', 'Hyundai', 'Kia'].map(make => (
                        <option key={make} value={make.toLowerCase()} className="bg-[#0B1628]">{make}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="location-select-main" className="text-xs font-semibold text-white/60 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      Location
                    </label>
                    <select
                      id="location-select-main"
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full h-12 bg-white/[0.06] border border-white/10 text-white rounded-xl px-3 text-sm focus:border-[#D4A853] focus:ring-1 focus:ring-[#D4A853]/30 outline-none"
                    >
                      <option value="" className="bg-[#0B1628]">All Locations</option>
                      {['Windhoek', 'Swakopmund', 'Walvis Bay', 'Oshakati', 'Rundu', 'Katima Mulilo', 'Otjiwarongo', 'Gobabis'].map(loc => (
                        <option key={loc} value={loc.toLowerCase().replace(' ', '-')} className="bg-[#0B1628]">{loc}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60">&nbsp;</label>
                    <Button
                      className="w-full h-12 bg-[#CB2030] hover:bg-[#E04B56] text-white font-bold text-sm shadow-lg shadow-[#CB2030]/25 hover:shadow-xl transition-all duration-300 rounded-xl"
                      size="lg"
                      onClick={handleMainSearch}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Search Cars
                    </Button>
                  </div>
                </div>

                {/* Popular searches */}
                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-white/40 mb-2.5 uppercase tracking-wider">Popular in Namibia</p>
                      <div className="flex flex-wrap gap-2">
                        {['Toyota Hilux', 'Ford Ranger', 'BMW X5', 'Toyota Fortuner', 'Mercedes E-Class', 'Toyota Corolla'].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleQuickSearch(tag)}
                            className="px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.1] text-white/50 hover:text-white rounded-lg text-xs font-medium transition-all duration-200 border border-white/[0.06] hover:border-white/15 cursor-pointer"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end gap-6">
                      {[
                        { value: 'NAD 150K', label: 'Avg. Price', color: 'text-[#D4A853]' },
                        { value: '24hrs', label: 'Avg. Response', color: 'text-[#CB2030]' },
                        { value: '98%', label: 'Satisfaction', color: 'text-[#34D399]' },
                      ].map((s, i) => (
                        <React.Fragment key={s.label}>
                          {i > 0 && <div className="w-px h-6 bg-white/10" />}
                          <div className="text-center">
                            <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                            <div className="text-[10px] text-white/30">{s.label}</div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          HOME SHOWCASE — Vehicle carousels
         ═══════════════════════════════════ */}
      <HomeShowcase />

      {/* ═══════════════════════════════════
          HOW IT WORKS — Asymmetric layout
         ═══════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-[#FAFAF8]">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#0B162808_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4A853]/30 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="animate-fade-up inline-flex items-center gap-2 bg-[#0B1628]/[0.04] rounded-full px-5 py-2 mb-5 border border-[#0B1628]/[0.06]">
              <span className="w-1.5 h-1.5 bg-[#D4A853] rounded-full" />
              <span className="text-xs font-semibold text-[#0B1628]/60 uppercase tracking-wider">Simple & Transparent</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B1628] font-display mb-4">
              How It <span className="bg-gradient-to-r from-[#D4A853] to-[#CB2030] bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-lg text-[#0B1628]/50 max-w-xl mx-auto">
              Find your perfect vehicle in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: '01',
                icon: <Search className="w-8 h-8 text-white" strokeWidth={2} />,
                title: 'Search & Browse',
                desc: 'Use our advanced search filters to find vehicles that match your needs, budget, and location across Namibia.',
                accent: 'from-[#1F3469] to-[#3B4F86]',
                link: { label: 'Start searching', action: () => setSearchDialogOpen(true) },
              },
              {
                step: '02',
                icon: <Eye className="w-8 h-8 text-white" strokeWidth={2} />,
                title: 'View & Compare',
                desc: 'View detailed listings with high-quality images and vehicle history. Compare models side by side.',
                accent: 'from-[#CB2030] to-[#E04B56]',
                link: { label: 'Explore vehicles', action: () => router.push('/vehicles') },
              },
              {
                step: '03',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ),
                title: 'Connect & Buy',
                desc: 'Contact verified dealerships directly. No hidden fees, secure transactions, and trusted service.',
                accent: 'from-[#109B4A] to-[#34D399]',
                link: { label: 'Browse dealers', action: () => router.push('/dealers') },
              },
            ].map((item, i) => (
              <div key={item.step} className="group animate-fade-up" style={{ animationDelay: `${i * 150}ms` }}>
                <Card className="h-full bg-white hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 border border-[#0B1628]/[0.06] overflow-hidden rounded-2xl">
                  <CardContent className="p-0">
                    {/* Top accent bar */}
                    <div className={`h-1 bg-gradient-to-r ${item.accent}`} />
                    <div className="p-8">
                      {/* Step number + icon */}
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${item.accent} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          {item.icon}
                        </div>
                        <span className="text-5xl font-extrabold text-[#0B1628]/[0.04] font-display group-hover:text-[#0B1628]/[0.08] transition-colors">{item.step}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0B1628] mb-3 font-display">{item.title}</h3>
                      <p className="text-[#0B1628]/50 leading-relaxed text-sm mb-5">{item.desc}</p>
                      <button
                        onClick={item.link.action}
                        className="text-sm font-semibold flex items-center gap-2 group-hover:gap-3 transition-all text-[#0B1628]/60 hover:text-[#0B1628]"
                      >
                        {item.link.label}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-[#0B1628] rounded-2xl p-8 shadow-xl">
              <div className="text-left">
                <h3 className="text-xl font-bold text-white mb-1 font-display">Ready to find your perfect car?</h3>
                <p className="text-white/40 text-sm">Join thousands of satisfied customers across Namibia.</p>
              </div>
              <Button
                size="lg"
                onClick={() => router.push('/vehicles')}
                className="bg-[#D4A853] hover:bg-[#E8C878] text-[#0B1628] font-semibold px-8 py-5 whitespace-nowrap rounded-xl"
              >
                Browse All Vehicles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          BRANDS — With mesh gradient bg
         ═══════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden bg-white">
        {/* Subtle mesh gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#D4A853]/[0.04] rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-[#1F3469]/[0.04] rounded-full blur-[80px]" />
        </div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0B1628]/10 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0B1628] mb-3 font-display">
              Wide Selection of Brands
            </h2>
            <p className="text-[#0B1628]/50 max-w-lg mx-auto">
              Discover vehicles from the most trusted automotive brands available in Namibia
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center justify-items-center">
            {[
              { name: 'BMW', src: '/brands/bmw.png', useNext: true },
              { name: 'Mercedes-Benz', src: '/brands/merc.png', useNext: false },
              { name: 'Toyota', src: '/brands/toyota.png', useNext: false },
              { name: 'Ford', src: '/brands/ford.png', useNext: true },
              { name: 'Volkswagen', src: '/brands/vw.png', useNext: true },
              { name: 'Audi', src: '/brands/audi.png', useNext: true },
              { name: 'Nissan', src: '/brands/nissan.png', useNext: true },
              { name: 'Jeep', src: '/brands/jeep.png', useNext: true },
              { name: 'Hyundai', src: '/brands/hyundai.png', useNext: true },
              { name: 'Kia', src: '/brands/kia.png', useNext: true },
              { name: 'Mazda', src: '/brands/mazda.png', useNext: true },
              { name: 'Subaru', src: '/brands/subaru.png', useNext: true },
            ].map((brand) => (
              <button
                key={brand.name}
                onClick={() => router.push(`/vehicles?make=${brand.name}`)}
                className="bg-white rounded-xl p-5 w-full h-24 flex items-center justify-center group hover:scale-105 transition-all duration-300 border border-[#0B1628]/[0.06] hover:border-[#D4A853]/40 hover:shadow-lg cursor-pointer"
              >
                {brand.useNext ? (
                  <Image src={brand.src} alt={brand.name} width={56} height={56} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
                ) : (
                  <img src={brand.src} alt={brand.name} width={56} height={56} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
                )}
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/vehicles')}
              className="border-[#0B1628]/15 text-[#0B1628] hover:bg-[#0B1628] hover:text-white rounded-xl transition-all duration-300"
            >
              Browse All Brands
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          DYNAMIC BANNER
         ═══════════════════════════════════ */}
      <section className="py-8 bg-[#FAFAF8]">
        <div className="container mx-auto px-4">
          <DynamicBanner
            position="MAIN"
            fallbackContent={
              <div className="rounded-2xl overflow-hidden border border-[#0B1628]/[0.06]">
                <div className="relative min-h-[200px] bg-gradient-to-r from-[#0B1628] to-[#1F3469]">
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8 max-w-md">
                      <h3 className="text-2xl font-bold mb-3 text-white font-display">Partner with Cars.na</h3>
                      <p className="text-white/50 mb-6 leading-relaxed text-sm">
                        Reach thousands of car buyers across Namibia with our premium advertising solutions
                      </p>
                      <Button size="sm" className="bg-[#D4A853] hover:bg-[#E8C878] text-[#0B1628] font-semibold rounded-xl">
                        Advertise With Us
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* ═══════════════════════════════════
          FINAL CTA — Dark, cinematic
         ═══════════════════════════════════ */}
      <section className="py-20 bg-[#0B1628] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#D4A853]/10 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 font-display">
            Ready to Find Your{' '}
            <span className="bg-gradient-to-r from-[#D4A853] to-[#E8C878] bg-clip-text text-transparent">Perfect Car</span>?
          </h2>
          <p className="text-lg mb-8 text-white/40 max-w-xl mx-auto">
            Join thousands of satisfied customers who found their dream car through Cars.na
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#D4A853] hover:bg-[#E8C878] text-[#0B1628] font-semibold px-8 py-6 rounded-xl shadow-lg shadow-[#D4A853]/25"
              onClick={() => router.push('/vehicles')}
            >
              Browse All Vehicles
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-white border-2 border-white/20 hover:bg-white/10 hover:border-white/40 px-8 py-6 rounded-xl transition-all duration-300"
              onClick={() => router.push('/sell')}
            >
              Sell Your Car
            </Button>
          </div>
        </div>
      </section>

      <CarFilterSearch open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} />
      <DealerContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        dealership={featuredDealership}
      />
    </MainLayout>
  );
}
