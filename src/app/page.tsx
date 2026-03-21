'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/Button";
import { HomeShowcase } from "@/components/HomeShowcase";
import { Search, ArrowRight, MapPin, ChevronRight, Star, Truck, Car, Zap } from 'lucide-react';
import CarFilterSearch from "@/components/CarFilterSearch";
import { DealerContactModal } from "@/components/DealerContactModal";
import { DynamicBanner } from "@/components/DynamicBanner";

const vehicleTypes = [
  { label: 'All', value: '', icon: null },
  { label: 'Sedan', value: 'sedan', icon: null },
  { label: 'SUV', value: 'suv', icon: null },
  { label: 'Bakkie', value: 'bakkie', icon: null },
  { label: 'Hatchback', value: 'hatchback', icon: null },
  { label: 'Double Cab', value: 'double-cab', icon: null },
  { label: 'Coupe', value: 'coupe', icon: null },
  { label: 'Van', value: 'van', icon: null },
];

const popularSearches = [
  'Toyota Hilux', 'Ford Ranger', 'VW Polo', 'Toyota Fortuner',
  'BMW X5', 'Mercedes C-Class', 'Isuzu D-Max', 'Hyundai Tucson',
];

const brands = [
  { name: 'Toyota', src: '/brands/toyota.png', useNext: false },
  { name: 'Ford', src: '/brands/ford.png', useNext: true },
  { name: 'Volkswagen', src: '/brands/vw.png', useNext: true },
  { name: 'BMW', src: '/brands/bmw.png', useNext: true },
  { name: 'Mercedes-Benz', src: '/brands/merc.png', useNext: false },
  { name: 'Nissan', src: '/brands/nissan.png', useNext: true },
  { name: 'Hyundai', src: '/brands/hyundai.png', useNext: true },
  { name: 'Isuzu', src: '/brands/isuzu.png', useNext: true },
  { name: 'Kia', src: '/brands/kia.png', useNext: true },
  { name: 'Audi', src: '/brands/audi.png', useNext: true },
  { name: 'Mazda', src: '/brands/mazda.png', useNext: true },
  { name: 'Subaru', src: '/brands/subaru.png', useNext: true },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [featuredDealership, setFeaturedDealership] = useState<any>(null);

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
      }
    };
    fetchFeaturedDealership();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (activeType) params.set('bodyType', activeType);
    const qs = params.toString();
    router.push(qs ? `/vehicles?${qs}` : '/vehicles');
  };

  const handleQuickSearch = (term: string) => {
    router.push(`/vehicles?search=${encodeURIComponent(term)}`);
  };

  return (
    <MainLayout>
      {/* ── HERO: Clean, search-first ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 pt-10 pb-8">
          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Find your next car
            </h1>
            <p className="mt-3 text-base sm:text-lg text-gray-500">
              Search thousands of vehicles from verified dealers across Namibia
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search make, model, year..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#CB2030] focus:ring-2 focus:ring-[#CB2030]/20 text-sm"
                />
              </div>
              <button
                onClick={handleSearch}
                className="h-12 px-6 bg-[#CB2030] hover:bg-[#b81c2a] text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* Vehicle Type Pills */}
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
              {vehicleTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setActiveType(type.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeType === type.value
                      ? 'bg-[#CB2030] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          <div className="max-w-2xl mx-auto mt-5 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="text-xs text-gray-500 hover:text-[#CB2030] transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-8 sm:gap-16 text-center">
            {[
              { value: '200+', label: 'Dealers' },
              { value: '5,000+', label: 'Listings' },
              { value: '5yr', label: 'Trusted' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</span>
                <span className="text-xs sm:text-sm text-gray-400 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VEHICLE SHOWCASE ── */}
      <HomeShowcase />

      {/* ── MOTORSPORT EVENT + AD SPACE ── */}
      <section className="bg-white py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Motorsport Event Card */}
            <div className="rounded-xl border border-gray-200 overflow-hidden bg-gray-900 text-white relative">
              <div className="absolute top-3 right-3 bg-[#CB2030] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Event
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#CB2030] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CB2030]">Motorsport</span>
                    <span className="text-[10px] text-white/40 ml-2">Featured Event</span>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-1">Namibian Desert Rally</h3>
                <p className="text-sm text-[#CB2030] font-semibold mb-3">Championship 2026</p>
                <p className="text-sm text-white/50 mb-5 leading-relaxed">
                  500km of adrenaline-fueled off-road racing from Swakopmund to Sossusvlei.
                  Experience the raw power of desert motorsport.
                </p>
                <div className="flex items-center gap-4 text-xs text-white/40 mb-6">
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2"/></svg>
                    18-20 Apr 2026
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Swakopmund
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="h-9 px-5 bg-[#CB2030] hover:bg-[#b81c2a] text-white text-sm font-semibold rounded-lg transition-colors">
                    Learn More
                  </button>
                  <button className="h-9 px-5 border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-sm font-medium rounded-lg transition-colors">
                    Tickets
                  </button>
                </div>
              </div>
            </div>

            {/* Dynamic Banner / Ad Space */}
            <DynamicBanner
              position="MAIN"
              fallbackContent={
                <div className="rounded-xl border border-gray-200 overflow-hidden bg-gradient-to-br from-gray-50 to-white h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Star className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Advertise Here</h3>
                    <p className="text-sm text-gray-500 mb-4 max-w-xs">
                      Reach thousands of car buyers across Namibia with premium placement
                    </p>
                    <Link
                      href="/advertise"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#CB2030] hover:text-[#b81c2a] transition-colors"
                    >
                      Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              }
            />
          </div>

          {/* "Want to advertise your event?" strip */}
          <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg px-5 py-3 border border-gray-100">
            <span className="text-sm text-gray-500">Want to advertise your motorsport event or business?</span>
            <Link
              href="/advertise"
              className="text-sm font-semibold text-[#CB2030] hover:text-[#b81c2a] flex items-center gap-1 transition-colors"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY BRAND ── */}
      <section className="bg-gray-50 py-10 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Browse by Brand</h2>
            <Link
              href="/vehicles"
              className="text-sm font-semibold text-[#CB2030] hover:text-[#b81c2a] flex items-center gap-1 transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {brands.map((brand) => (
              <button
                key={brand.name}
                onClick={() => router.push(`/vehicles?make=${brand.name}`)}
                className="bg-white rounded-lg p-4 h-20 flex flex-col items-center justify-center gap-1.5 border border-gray-200 hover:border-[#CB2030]/30 hover:shadow-sm transition-all group"
              >
                {brand.useNext ? (
                  <Image src={brand.src} alt={brand.name} width={36} height={36} className="object-contain group-hover:scale-110 transition-transform" />
                ) : (
                  <img src={brand.src} alt={brand.name} width={36} height={36} className="object-contain group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[11px] text-gray-500 font-medium">{brand.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DEALER (if exists) ── */}
      {featuredDealership && (
        <section className="bg-white py-6 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-10 h-10 bg-[#CB2030] rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Featured Dealer</span>
              </div>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">
                    {featuredDealership.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{featuredDealership.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {featuredDealership.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{featuredDealership.city}</span>}
                    {featuredDealership.stats?.vehiclesCount && <span>{featuredDealership.stats.vehiclesCount} vehicles</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => featuredDealership?.slug ? router.push(`/dealership/${featuredDealership.slug}`) : router.push('/vehicles')}
                  className="h-9 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                >
                  View Inventory <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setContactModalOpen(true)}
                  className="h-9 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS — Minimal ── */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Search', desc: 'Browse thousands of vehicles using our search filters — by make, model, price, or location.', color: 'bg-blue-50 text-blue-600' },
              { step: '2', title: 'Compare', desc: 'View detailed listings with photos, specs, and pricing. Compare models to find the best fit.', color: 'bg-orange-50 text-orange-600' },
              { step: '3', title: 'Connect', desc: 'Contact verified dealers directly. No middlemen, no hidden fees — just transparent car buying.', color: 'bg-green-50 text-green-600' },
            ].map((item) => (
              <div key={item.step} className="text-center p-6">
                <div className={`w-10 h-10 rounded-full ${item.color} font-bold text-sm flex items-center justify-center mx-auto mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR SEARCHES / SEO ── */}
      <section className="bg-gray-50 py-10 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Popular Searches</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-2">
            {[
              'Used Cars in Windhoek',
              'Toyota Hilux for Sale',
              'Ford Ranger Namibia',
              'SUVs Under N$500,000',
              'BMW for Sale',
              'Double Cab Bakkies',
              'Cars Under N$200,000',
              'Mercedes-Benz Namibia',
              'Volkswagen Polo',
              'Hyundai Tucson',
              'Isuzu D-Max',
              'Toyota Fortuner',
            ].map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                className="text-left text-sm text-gray-500 hover:text-[#CB2030] py-1 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-gray-900 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Ready to find your next car?
          </h2>
          <p className="text-gray-400 mb-6">
            Join thousands of satisfied buyers across Namibia
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/vehicles')}
              className="h-11 px-8 bg-[#CB2030] hover:bg-[#b81c2a] text-white font-semibold rounded-lg transition-colors"
            >
              Browse All Cars
            </button>
            <button
              onClick={() => router.push('/sell')}
              className="h-11 px-8 border border-white/20 text-white hover:bg-white/10 font-medium rounded-lg transition-colors"
            >
              Sell Your Car
            </button>
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
