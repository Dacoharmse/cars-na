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
import { Search, Eye, Star, Car, DollarSign, MapPin, Phone, Zap, ArrowRight, ChevronRight } from 'lucide-react';
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
          HERO — Editorial automotive, asymmetric
         ═══════════════════════════════════════════ */}
      <section className="relative min-h-[100vh] flex items-end overflow-hidden bg-[#080C18] -mt-[6.5rem]">
        {/* ── Atmospheric background layers ── */}
        <div className="absolute inset-0">
          {/* Deep base gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080C18] via-[#0D1425] to-[#080C18]" />
          {/* Warm amber glow — bottom center, like headlights approaching */}
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#C9A84C]/[0.07] rounded-full blur-[150px] animate-glow-pulse" />
          {/* Cool blue atmospheric — top left */}
          <div className="absolute -top-[10%] -left-[10%] w-[700px] h-[500px] bg-[#1A2744]/30 rounded-full blur-[120px]" />
          {/* Subtle red accent — far right */}
          <div className="absolute top-[30%] -right-[5%] w-[300px] h-[400px] bg-[#CB2030]/[0.04] rounded-full blur-[100px]" />
          {/* Fine grain texture overlay */}
          <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")' }} />
        </div>

        {/* ── Massive decorative background text — depth layer ── */}
        <div className="absolute top-1/2 -translate-y-[45%] -right-[3vw] select-none pointer-events-none hidden lg:block">
          <span className="font-serif text-[22vw] leading-none font-normal italic text-white/[0.015] tracking-[0.08em]">
            drive
          </span>
        </div>

        {/* ── Horizontal accent line ── */}
        <div className="absolute top-[38%] left-0 w-full h-px hidden lg:block">
          <div className="animate-line-reveal delay-600 h-full bg-gradient-to-r from-transparent via-[#C9A84C]/15 to-transparent origin-left" />
        </div>

        {/* ── Main content ── */}
        <div className="relative container mx-auto px-4 pb-12 lg:pb-20 pt-40 lg:pt-48 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">

            {/* ── Left: Editorial hero content — 8 cols ── */}
            <div className="lg:col-span-8 space-y-8">
              {/* Marketplace badge */}
              <div className="animate-fade-up delay-0 flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
                <span className="text-sm font-medium text-[#C9A84C]/80 tracking-[0.2em] uppercase">Namibia&apos;s #1 Car Marketplace</span>
              </div>

              {/* Headline — Instrument Serif for editorial feel, extreme size contrast */}
              <h1 className="animate-fade-up delay-100">
                <span className="block font-serif italic text-[2.4rem] sm:text-[3.2rem] md:text-[4.2rem] lg:text-[5rem] xl:text-[5.8rem] leading-[0.95] text-white/60">
                  The smarter way
                </span>
                <span className="block font-display text-[2.6rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.4rem] xl:text-[6.2rem] font-extrabold leading-[0.95] tracking-[-0.03em] text-white mt-2">
                  to buy &amp; sell
                </span>
                <span className="block font-display text-[2.6rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.4rem] xl:text-[6.2rem] font-extrabold leading-[0.95] tracking-[-0.03em] mt-1">
                  <span className="bg-gradient-to-r from-[#C9A84C] via-[#D4B65C] to-[#C9A84C] bg-clip-text text-transparent">cars</span>
                  <span className="text-white/30 font-light ml-2">in Namibia.</span>
                </span>
              </h1>

              {/* Subtitle — clean, understated */}
              <p className="animate-fade-up delay-200 text-base md:text-lg text-white/35 max-w-lg leading-relaxed">
                Connect with 200+ verified dealers across Windhoek, Swakopmund, and beyond.
                Transparent pricing. No hidden fees.
              </p>

              {/* CTA buttons — bold red primary, ghost secondary */}
              <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  className="bg-[#CB2030] hover:bg-[#D93440] text-white font-semibold text-base px-8 py-6 rounded-xl shadow-lg shadow-[#CB2030]/20 hover:shadow-xl hover:shadow-[#CB2030]/30 hover:-translate-y-0.5 transition-all duration-300 group"
                  onClick={() => setSearchDialogOpen(true)}
                >
                  Browse All Cars
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border border-white/10 text-white/70 hover:text-white hover:bg-white/[0.06] hover:border-white/20 font-medium text-base px-8 py-6 rounded-xl transition-all duration-300"
                  onClick={() => router.push('/sell')}
                >
                  Sell Your Car
                </Button>
              </div>
            </div>

            {/* ── Right: Stats sidebar — 3 cols, editorial vertical layout ── */}
            <div className="lg:col-span-3 lg:col-start-10 animate-fade-up delay-400">
              <div className="border-l border-[#C9A84C]/15 pl-8 space-y-10">
                {[
                  { value: '200+', label: 'Verified Dealers', color: 'text-[#C9A84C]' },
                  { value: '5K+', label: 'Active Listings', color: 'text-white' },
                  { value: '5yr', label: 'Trusted Platform', color: 'text-white/40' },
                ].map((stat, i) => (
                  <div key={stat.label} className="animate-count-up" style={{ animationDelay: `${500 + i * 120}ms` }}>
                    <div className={`text-4xl lg:text-5xl font-serif ${stat.color} leading-none`}>{stat.value}</div>
                    <div className="text-xs text-white/30 mt-2 tracking-[0.1em] uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Popular searches strip — subtle, bottom of hero ── */}
          <div className="animate-fade-up delay-500 mt-14 pt-6 border-t border-white/[0.05]">
            <div className="flex items-center gap-4 md:gap-6 flex-wrap">
              <span className="text-[11px] text-white/20 uppercase tracking-[0.2em] font-semibold shrink-0">Popular</span>
              <div className="w-px h-4 bg-white/10 hidden md:block" />
              {['Toyota Hilux', 'Ford Ranger', 'BMW X5', 'Toyota Fortuner', 'Mercedes E-Class'].map((car, i) => (
                <React.Fragment key={car}>
                  {i > 0 && <span className="text-white/10 hidden md:inline">·</span>}
                  <button
                    onClick={() => handleQuickSearch(car)}
                    className="text-sm text-white/30 hover:text-[#C9A84C] transition-colors duration-200 cursor-pointer"
                  >
                    {car}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SEARCH FORM — Clean, integrated
         ═══════════════════════════════════ */}
      <section className="bg-[#080C18] pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-fade-up delay-700 bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/[0.06]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label htmlFor="main-search" className="text-xs font-semibold text-white/40 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  Search
                </label>
                <Input
                  id="main-search"
                  type="text"
                  placeholder="e.g., Toyota Hilux, BMW X3..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  onKeyPress={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleMainSearch(); }}
                  className="w-full h-12 bg-white/[0.05] border-white/[0.08] text-white placeholder:text-white/20 focus:border-[#C9A84C]/50 focus:ring-[#C9A84C]/20 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="make-select" className="text-xs font-semibold text-white/40 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5" />
                  Make
                </label>
                <select
                  id="make-select"
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full h-12 bg-white/[0.05] border border-white/[0.08] text-white rounded-xl px-3 text-sm focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/20 outline-none"
                >
                  <option value="" className="bg-[#0B1628]">Any Make</option>
                  {['Toyota', 'Ford', 'Volkswagen', 'BMW', 'Mercedes-Benz', 'Nissan', 'Isuzu', 'Hyundai', 'Kia'].map(make => (
                    <option key={make} value={make.toLowerCase()} className="bg-[#0B1628]">{make}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="location-select-main" className="text-xs font-semibold text-white/40 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Location
                </label>
                <select
                  id="location-select-main"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full h-12 bg-white/[0.05] border border-white/[0.08] text-white rounded-xl px-3 text-sm focus:border-[#C9A84C]/50 focus:ring-1 focus:ring-[#C9A84C]/20 outline-none"
                >
                  <option value="" className="bg-[#0B1628]">All Locations</option>
                  {['Windhoek', 'Swakopmund', 'Walvis Bay', 'Oshakati', 'Rundu', 'Katima Mulilo', 'Otjiwarongo', 'Gobabis'].map(loc => (
                    <option key={loc} value={loc.toLowerCase().replace(' ', '-')} className="bg-[#0B1628]">{loc}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/40">&nbsp;</label>
                <Button
                  className="w-full h-12 bg-[#CB2030] hover:bg-[#D93440] text-white font-bold text-sm shadow-lg shadow-[#CB2030]/20 hover:shadow-xl transition-all duration-300 rounded-xl"
                  size="lg"
                  onClick={handleMainSearch}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search Cars
                </Button>
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
          FEATURED DEALER — Compact strip (only when exists)
         ═══════════════════════════════════ */}
      {featuredDealership && (
        <section className="py-6 bg-[#FAFAF8] border-b border-[#0B1628]/[0.04]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-white rounded-xl p-4 sm:p-5 border border-[#0B1628]/[0.06] shadow-sm">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-[#C9A84C] to-[#D4B65C] rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#0B1628]" />
                </div>
                <span className="text-xs font-semibold text-[#0B1628]/40 uppercase tracking-wider">Featured Dealer</span>
              </div>
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1F3469] to-[#3B4F86] rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white font-display">
                    {featuredDealership.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-[#0B1628] truncate font-display">{featuredDealership.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-[#0B1628]/50">
                    {featuredDealership.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{featuredDealership.city}</span>}
                    {featuredDealership.stats?.vehiclesCount && <span>{featuredDealership.stats.vehiclesCount} vehicles</span>}
                    {featuredDealership.isVerified && <span className="text-[#34D399] font-medium">Verified</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  className="bg-[#0B1628] hover:bg-[#1F3469] text-white font-semibold rounded-lg text-sm"
                  onClick={() => featuredDealership?.slug ? router.push(`/dealership/${featuredDealership.slug}`) : router.push('/vehicles')}
                >
                  View Inventory
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#0B1628]/15 text-[#0B1628] hover:bg-[#0B1628]/5 rounded-lg text-sm"
                  onClick={() => setContactModalOpen(true)}
                >
                  Contact
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          HOW IT WORKS — Asymmetric layout
         ═══════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden bg-[#FAFAF8]">
        {/* Background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#0B162808_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="animate-fade-up inline-flex items-center gap-2 bg-[#0B1628]/[0.04] rounded-full px-5 py-2 mb-5 border border-[#0B1628]/[0.06]">
              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full" />
              <span className="text-xs font-semibold text-[#0B1628]/60 uppercase tracking-wider">Simple & Transparent</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0B1628] font-display mb-4">
              How It <span className="bg-gradient-to-r from-[#C9A84C] to-[#CB2030] bg-clip-text text-transparent">Works</span>
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
                className="bg-[#C9A84C] hover:bg-[#D4B65C] text-[#0B1628] font-semibold px-8 py-5 whitespace-nowrap rounded-xl"
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
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#C9A84C]/[0.04] rounded-full blur-[80px]" />
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
                className="bg-white rounded-xl p-5 w-full h-24 flex items-center justify-center group hover:scale-105 transition-all duration-300 border border-[#0B1628]/[0.06] hover:border-[#C9A84C]/40 hover:shadow-lg cursor-pointer"
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
                      <Button size="sm" className="bg-[#C9A84C] hover:bg-[#D4B65C] text-[#0B1628] font-semibold rounded-xl">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#C9A84C]/10 rounded-full blur-[120px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 font-display">
            Ready to Find Your{' '}
            <span className="bg-gradient-to-r from-[#C9A84C] to-[#D4B65C] bg-clip-text text-transparent">Perfect Car</span>?
          </h2>
          <p className="text-lg mb-8 text-white/40 max-w-xl mx-auto">
            Join thousands of satisfied customers who found their dream car through Cars.na
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#C9A84C] hover:bg-[#D4B65C] text-[#0B1628] font-semibold px-8 py-6 rounded-xl shadow-lg shadow-[#C9A84C]/25"
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
