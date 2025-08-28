'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { HomeShowcase } from "@/components/HomeShowcase";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Search, Eye, CheckCircle, Star, TrendingUp, Car, DollarSign, MapPin, Phone, Zap, ArrowRight } from 'lucide-react';
import CarFilterSearch from "@/components/CarFilterSearch";
import { DealerContactModal } from "@/components/DealerContactModal";


export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  // Dealership data for the contact modal
  const featuredDealership = {
    name: 'Namibia Motors',
    address: '101 Robert Mugabe Avenue',
    city: 'Windhoek, Khomas',
    phone: '+264 61 123 456',
    email: 'info@namibiamotors.na'
  };

  // Handle main search form submission
  const handleMainSearch = () => {
    const searchParams = new URLSearchParams();
    
    if (searchQuery.trim()) {
      searchParams.set('search', searchQuery.trim());
    }
    
    if (selectedMake) {
      searchParams.set('make', selectedMake);
    }
    
    if (selectedLocation) {
      searchParams.set('location', selectedLocation);
    }
    
    const queryString = searchParams.toString();
    const url = queryString ? `/vehicles?${queryString}` : '/vehicles';
    
    router.push(url);
  };

  // Handle quick search for popular vehicles
  const handleQuickSearch = (searchTerm: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('search', searchTerm);
    
    router.push(`/vehicles?${searchParams.toString()}`);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-160px)] bg-gradient-to-br from-white via-neutral-50 to-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(#1F346915_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-white/60" />
          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#1F3469]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#CB2030]/5 rounded-full blur-3xl" />
          {/* Spotlight behind dealership card */}
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-radial from-white to-transparent opacity-60 rounded-full blur-2xl" />
        </div>
        
        <div className="relative container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              {/* Hero Content - Left Side */}
              <div className="text-left z-10 relative space-y-8">
                {/* Trust Badge */}
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#109B4A]/10 to-[#109B4A]/5 backdrop-blur-sm rounded-full px-6 py-3 shadow-sm border border-[#109B4A]/20 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#109B4A] rounded-full animate-pulse"></span>
                    <span className="text-sm font-semibold text-[#109B4A]">🇳🇦 Namibia's Leading Car Marketplace</span>
                  </div>
                </div>
                
                {/* Main Headline */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-normal animate-fade-in" style={{animationDelay: '100ms'}}>
                  <span className="text-neutral-900">Find Your</span>
                  <span className="block mt-2">
                    <span className="text-[#1F3469]">Perfect</span>
                    <span className="text-neutral-900 ml-4">Car</span>
                  </span>
                  <span className="block text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-700">
                    Trusted by Namibian Drivers
                  </span>
                </h1>
                
                {/* Security Trust Signal */}
                <div className="flex items-center gap-2 mt-4 text-sm text-neutral-600 animate-fade-in" style={{animationDelay: '150ms'}}>
                  <svg className="w-4 h-4 text-[#109B4A]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>No hidden fees • Secure transactions</span>
                </div>
                
                {/* Value Proposition */}
                <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl leading-relaxed animate-fade-in" style={{animationDelay: '200ms'}}>
                  Connect with verified dealers across Windhoek, Swakopmund, and beyond. 
                  <span className="font-semibold text-neutral-800">No hidden fees, secure transactions.</span>
                </p>
                
                {/* Trust Indicators */}
                <div className="bg-slate-50/60 dark:bg-slate-800/60 rounded-lg px-4 py-3 mt-6 animate-fade-in" style={{animationDelay: '250ms'}}>
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 bg-[#109B4A]/10 rounded-full flex items-center justify-center mb-1">
                        <span className="text-[#109B4A] font-bold text-sm">✓</span>
                      </div>
                      <span className="font-medium text-neutral-700">200+</span>
                      <span className="text-[10px] uppercase tracking-wide text-slate-500">Dealers</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 bg-[#109B4A]/10 rounded-full flex items-center justify-center mb-1">
                        <span className="text-[#109B4A] font-bold text-sm">5K+</span>
                      </div>
                      <span className="font-medium text-neutral-700">5,000+</span>
                      <span className="text-[10px] uppercase tracking-wide text-slate-500">Listings</span>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 bg-[#109B4A]/10 rounded-full flex items-center justify-center mb-1">
                        <span className="text-[#109B4A] font-bold text-sm">5</span>
                      </div>
                      <span className="font-medium text-neutral-700">5</span>
                      <span className="text-[10px] uppercase tracking-wide text-slate-500">Years</span>
                    </div>
                  </div>
                </div>
                
                {/* Hero Search Field - Desktop Only */}
                <div className="hidden lg:block animate-fade-in" style={{animationDelay: '280ms'}}>
                  <div className="relative max-w-md">
                    <label htmlFor="hero-search" className="sr-only">
                      Search for cars by make, model, or keyword
                    </label>
                    <button
                      onClick={() => setSearchDialogOpen(true)}
                      className="w-full px-4 py-3 pl-12 rounded-lg border border-slate-200 hover:border-[#1F3469] focus:border-[#1F3469] focus:ring-2 focus:ring-[#1F3469]/20 outline-none transition-all duration-200 text-sm text-left text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50"
                    >
                      Search 5,000+ verified listings...
                    </button>
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden="true" />
                  </div>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{animationDelay: '300ms'}}>
                  <Button 
                    size="lg" 
                    className="flex-1 sm:flex-none bg-[#1F3469] text-white hover:bg-[#3B4F86] shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 font-semibold text-base px-8 py-6 animate-pulse" 
                    style={{animationDuration: '1.5s', animationIterationCount: '3'}}
                    onClick={() => setSearchDialogOpen(true)}
                  >
                    <Car className="w-5 h-5 mr-2" />
                    Find Your Car
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-[#CB2030] text-[#CB2030] hover:bg-[#CB2030] hover:text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 font-semibold text-base px-8 py-6"
                    onClick={() => router.push('/sell')}
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    Sell Your Car
                  </Button>
                </div>
              </div>
              
              {/* Top Dealership Carousel - Right Side */}
              <div className="relative hidden lg:block mt-8">
                {/* Dealership Carousel Container */}
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-white border border-neutral-200/50 backdrop-blur-sm mt-4">
                  {/* Carousel Header */}
                  <div className="bg-gradient-to-r from-[#1F3469] via-[#2A4A7A] to-[#3B4F86] p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#FFDD11] to-[#FFE55C] rounded-xl flex items-center justify-center shadow-lg">
                          <Star className="w-5 h-5 text-[#1F3469]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold tracking-tight">Featured Dealership</h3>
                          <p className="text-sm text-white/90 font-medium">Premium Partner</p>
                        </div>
                      </div>
                      <div className="text-xs bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-semibold border border-white/10">
                        Sponsored
                      </div>
                    </div>
                  </div>
                  
                  {/* Current Dealership Display */}
                  <div className="p-8 bg-gradient-to-br from-white to-slate-50/50">
                    {/* Dealership Logo & Info */}
                    <div className="flex items-start gap-6 mb-8">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#1F3469] via-[#2A4A7A] to-[#3B4F86] rounded-2xl flex items-center justify-center shadow-xl border-2 border-white">
                          <span className="text-3xl font-bold text-white">NM</span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#109B4A] rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">Namibia Motors</h4>
                        <p className="text-neutral-600 mb-4 leading-relaxed">Premium automotive dealer serving Windhoek and surrounding areas since 1995</p>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                            <MapPin className="w-4 h-4 text-[#CB2030]" />
                            <span className="text-sm font-semibold text-neutral-700">Windhoek Central</span>
                          </div>
                          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
                            <Phone className="w-4 h-4 text-[#109B4A]" />
                            <span className="text-sm font-semibold text-neutral-700">+264 61 123 456</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Dealership Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="text-center p-5 bg-gradient-to-br from-[#109B4A]/10 via-[#109B4A]/5 to-transparent rounded-xl border border-[#109B4A]/20 hover:border-[#109B4A]/30 transition-all duration-200 hover:shadow-md">
                        <div className="text-3xl font-bold text-[#109B4A] mb-2">150+</div>
                        <div className="text-xs text-neutral-600 font-semibold uppercase tracking-wide">Vehicles</div>
                      </div>
                      <div className="text-center p-5 bg-gradient-to-br from-[#FFDD11]/10 via-[#FFDD11]/5 to-transparent rounded-xl border border-[#FFDD11]/30 hover:border-[#FFDD11]/40 transition-all duration-200 hover:shadow-md">
                        <div className="text-3xl font-bold text-[#1F3469] mb-2">4.9</div>
                        <div className="text-xs text-neutral-600 font-semibold uppercase tracking-wide">Rating</div>
                      </div>
                      <div className="text-center p-5 bg-gradient-to-br from-[#CB2030]/10 via-[#CB2030]/5 to-transparent rounded-xl border border-[#CB2030]/20 hover:border-[#CB2030]/30 transition-all duration-200 hover:shadow-md">
                        <div className="text-3xl font-bold text-[#CB2030] mb-2">28yrs</div>
                        <div className="text-xs text-neutral-600 font-semibold uppercase tracking-wide">Experience</div>
                      </div>
                    </div>
                    
                    {/* Special Offers */}
                    <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900 dark:to-yellow-800 border border-yellow-200 dark:border-yellow-700 rounded-xl p-5 mb-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-200/20 dark:bg-yellow-700/20 rounded-full -translate-y-10 translate-x-10"></div>
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-[#1F3469] rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-[#FFDD11]" />
                          </div>
                          <span className="font-bold text-yellow-900 dark:text-yellow-100 text-lg">Special Offer</span>
                        </div>
                        <p className="text-sm text-yellow-900 dark:text-yellow-100 font-medium leading-relaxed">0% financing available on selected vehicles. Trade-in bonuses up to N$50,000!</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-[#1F3469] to-[#3B4F86] hover:from-[#3B4F86] hover:to-[#1F3469] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                        onClick={() => router.push('/vehicles?dealer=namibia-motors')}
                      >
                        View Inventory
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-2 border-[#1F3469] text-[#1F3469] hover:bg-[#1F3469] hover:text-white font-semibold transition-all duration-200 hover:shadow-lg"
                        onClick={() => setContactModalOpen(true)}
                      >
                        Contact Dealer
                      </Button>
                    </div>
                  </div>
                  
                  {/* Carousel Navigation */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
                    <button className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-[#1F3469] hover:text-[#3B4F86] transition-all duration-200 pointer-events-auto">
                      <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <button className="w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-[#1F3469] hover:text-[#3B4F86] transition-all duration-200 pointer-events-auto">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Carousel Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-2 h-2 bg-[#1F3469] rounded-full"></div>
                    <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
                    <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
                  </div>
                </div>
                
                {/* Floating Promotion Badge */}
                <div className="absolute -top-6 -left-6 bg-gradient-to-br from-[#FFDD11] via-[#FFE55C] to-[#FFDD11] rounded-2xl p-5 shadow-2xl border-2 border-white z-20 transform rotate-[-8deg] hover:rotate-[-4deg] transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  <div className="relative text-center">
                    <div className="text-xl font-black text-[#1F3469] tracking-tight leading-none">TOP</div>
                    <div className="text-xs text-[#1F3469] font-bold uppercase tracking-widest mt-1">Dealer</div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#CB2030] rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Floating Contact Badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-neutral-100 z-20">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#109B4A]">24/7</div>
                    <div className="text-xs text-neutral-600 font-medium">Support</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-[#1F3469] rounded-full opacity-5 blur-3xl z-0 animate-pulse" />
              </div>
            </div>
            
            {/* Mobile Top Dealership Carousel */}
            <div className="relative block lg:hidden mt-12 mb-16">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-white border border-neutral-100">
                {/* Mobile Carousel Header */}
                <div className="bg-gradient-to-r from-[#1F3469] to-[#3B4F86] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#FFDD11] rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-[#1F3469]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold">Featured Dealership</h3>
                        <p className="text-xs text-white/80">Premium Partner</p>
                      </div>
                    </div>
                    <div className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium">
                      Sponsored
                    </div>
                  </div>
                </div>
                
                {/* Mobile Dealership Display */}
                <div className="p-6">
                  {/* Dealership Logo & Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#1F3469] to-[#3B4F86] rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-lg font-bold text-white">NM</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-neutral-900 mb-1">Namibia Motors</h4>
                      <p className="text-sm text-neutral-600 mb-2">Premium dealer in Windhoek since 1995</p>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#CB2030]" />
                          <span className="font-medium text-neutral-700">Windhoek</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#109B4A]" />
                          <span className="font-medium text-neutral-700">+264 61 123 456</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 bg-gradient-to-br from-[#109B4A]/10 to-[#109B4A]/5 rounded-lg border border-[#109B4A]/20">
                      <div className="text-lg font-bold text-[#109B4A] mb-1">150+</div>
                      <div className="text-xs text-neutral-600 font-medium">Vehicles</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-[#FFDD11]/10 to-[#FFDD11]/5 rounded-lg border border-[#FFDD11]/30">
                      <div className="text-lg font-bold text-[#1F3469] mb-1">4.9</div>
                      <div className="text-xs text-neutral-600 font-medium">Rating</div>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-[#CB2030]/10 to-[#CB2030]/5 rounded-lg border border-[#CB2030]/20">
                      <div className="text-lg font-bold text-[#CB2030] mb-1">28yrs</div>
                      <div className="text-xs text-neutral-600 font-medium">Experience</div>
                    </div>
                  </div>
                  
                  {/* Mobile Special Offer */}
                  <div className="bg-gradient-to-r from-[#FFDD11]/20 to-[#FFDD11]/10 border border-[#FFDD11]/30 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-[#1F3469]" />
                      <span className="font-bold text-[#1F3469] text-sm">Special Offer</span>
                    </div>
                    <p className="text-xs text-neutral-700 font-medium">0% financing + trade-in bonuses up to N$50,000!</p>
                  </div>
                  
                  {/* Mobile Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[#1F3469] hover:bg-[#3B4F86] text-white font-semibold text-sm py-2"
                      onClick={() => router.push('/vehicles?dealer=namibia-motors')}
                    >
                      View Inventory
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-[#1F3469] text-[#1F3469] hover:bg-[#1F3469] hover:text-white text-sm py-2 px-4"
                      onClick={() => setContactModalOpen(true)}
                    >
                      Contact
                    </Button>
                  </div>
                </div>
                
                {/* Mobile Carousel Indicators */}
                <div className="flex justify-center gap-2 pb-4">
                  <div className="w-2 h-2 bg-[#1F3469] rounded-full"></div>
                  <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
                  <div className="w-2 h-2 bg-neutral-300 rounded-full"></div>
                </div>
              </div>
              
              {/* Mobile Floating Badge */}
              <div className="absolute -top-2 -left-2 bg-gradient-to-r from-[#FFDD11] to-[#FFE55C] rounded-xl p-2 shadow-lg border border-[#FFDD11]/30 z-20">
                <div className="text-center">
                  <div className="text-sm font-bold text-[#1F3469]">TOP</div>
                  <div className="text-xs text-[#1F3469] font-medium">Dealer</div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Search Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/20 mt-12 animate-fade-in" style={{animationDelay: '400ms'}}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">Find Your Perfect Car</h3>
                <p className="text-neutral-600">Search through 5,000+ verified listings from trusted Namibian dealers</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label htmlFor="main-search" className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#1F3469]" aria-hidden="true" />
                    What are you looking for?
                  </label>
                  <Input
                    id="main-search"
                    type="text"
                    placeholder="e.g., Toyota Hilux, BMW X3..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onKeyPress={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter') {
                        handleMainSearch();
                      }
                    }}
                    className="w-full h-14 text-neutral-900 border-2 border-neutral-200 focus:border-[#1F3469] focus:ring-[#1F3469] rounded-xl text-base font-medium placeholder:text-neutral-400"
                  />
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="make-select" className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#1F3469]" aria-hidden="true" />
                    Make
                  </label>
                  <select
                    id="make-select"
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full h-14 text-neutral-900 border-2 border-neutral-200 focus:border-[#1F3469] focus:ring-[#1F3469] rounded-xl text-base font-medium bg-white"
                  >
                    <option value="">Any Make</option>
                    <option value="toyota">Toyota</option>
                    <option value="ford">Ford</option>
                    <option value="volkswagen">Volkswagen</option>
                    <option value="bmw">BMW</option>
                    <option value="mercedes">Mercedes-Benz</option>
                    <option value="nissan">Nissan</option>
                    <option value="isuzu">Isuzu</option>
                    <option value="hyundai">Hyundai</option>
                    <option value="kia">Kia</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label htmlFor="location-select-main" className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1F3469]" aria-hidden="true" />
                    Location
                  </label>
                  <select
                    id="location-select-main"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-14 text-neutral-900 border-2 border-neutral-200 focus:border-[#1F3469] focus:ring-[#1F3469] rounded-xl text-base font-medium bg-white"
                  >
                    <option value="">All Locations</option>
                    <option value="windhoek">Windhoek</option>
                    <option value="swakopmund">Swakopmund</option>
                    <option value="walvis-bay">Walvis Bay</option>
                    <option value="oshakati">Oshakati</option>
                    <option value="rundu">Rundu</option>
                    <option value="katima-mulilo">Katima Mulilo</option>
                    <option value="otjiwarongo">Otjiwarongo</option>
                    <option value="gobabis">Gobabis</option>
                  </select>
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-neutral-800">&nbsp;</label>
                  <Button 
                    className="w-full h-14 bg-gradient-to-r from-[#1F3469] to-[#3B4F86] hover:from-[#3B4F86] hover:to-[#1F3469] text-white font-bold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl" 
                    size="lg"
                    onClick={handleMainSearch}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search Cars
                  </Button>
                </div>
              </div>
              
              {/* Popular Searches & Quick Stats */}
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold text-neutral-700 mb-3">Popular in Namibia:</p>
                    <div className="flex flex-wrap gap-2">
                      {['Toyota Hilux', 'Ford Ranger', 'BMW X5', 'Toyota Fortuner', 'Mercedes E-Class', 'Toyota Corolla'].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleQuickSearch(tag)}
                          className="px-4 py-2 bg-gradient-to-r from-neutral-100 to-neutral-50 hover:from-[#1F3469]/10 hover:to-[#1F3469]/5 hover:text-[#1F3469] text-neutral-700 rounded-full text-sm font-medium transition-all duration-200 border border-neutral-200 hover:border-[#1F3469]/20 focus:outline-none focus:ring-2 focus:ring-[#1F3469] focus:ring-offset-2 cursor-pointer"
                          aria-label={`Search for ${tag}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-end gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#1F3469]">NAD 150K</div>
                      <div className="text-xs text-neutral-600">Avg. Price</div>
                    </div>
                    <div className="w-px h-8 bg-neutral-300"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#CB2030]">24hrs</div>
                      <div className="text-xs text-neutral-600">Avg. Response</div>
                    </div>
                    <div className="w-px h-8 bg-neutral-300"></div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#109B4A]">98%</div>
                      <div className="text-xs text-neutral-600">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

      </section> 

      {/* Home Showcase - Six Dynamic Rows */}
      <HomeShowcase />

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#1F3469] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 -right-10 w-96 h-96 bg-[#CB2030] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#109B4A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-6 py-2.5 mb-6 shadow-sm border border-neutral-100">
              <span className="w-2 h-2 bg-[#1F3469] rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-neutral-700">Simple & Transparent</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              How It <span className="text-[#1F3469]">Works</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Find your perfect vehicle in Namibia with our simple 3-step process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1F3469] to-[#3B4F86] rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200"></div>
              <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#1F3469] to-[#3B4F86]"></div>
                <CardContent className="pt-12 pb-10 px-8">
                  <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute w-24 h-24 bg-gradient-to-br from-[#1F3469]/10 to-transparent rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#1F3469] to-[#3B4F86] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Search className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#1F3469] text-white rounded-full flex items-center justify-center text-base font-bold shadow-md">
                      1
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-[#1F3469] transition-colors">Search & Browse</h3>
                  <p className="text-neutral-600 leading-relaxed mb-6">Use our advanced search filters to find vehicles that match your needs, budget, and location across Namibia.</p>
                  <button 
                    onClick={() => setSearchDialogOpen(true)}
                    className="text-sm text-[#1F3469] font-medium flex items-center justify-center gap-2 group-hover:gap-3 transition-all hover:underline"
                  >
                    <span>Start searching</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </CardContent>
              </Card>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1.5 bg-gradient-to-r from-[#1F3469]/30 to-[#3B4F86]/30 rounded-full transform -translate-y-1/2 group-hover:bg-gradient-to-r group-hover:from-[#1F3469] group-hover:to-[#3B4F86] transition-all duration-300">
                <div className="absolute top-1/2 right-0 w-3 h-3 rounded-full bg-[#1F3469] transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#CB2030] to-[#E04B56] rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200"></div>
              <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#CB2030] to-[#E04B56]"></div>
                <CardContent className="pt-12 pb-10 px-8">
                  <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute w-24 h-24 bg-gradient-to-br from-[#CB2030]/10 to-transparent rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#CB2030] to-[#E04B56] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#CB2030] text-white rounded-full flex items-center justify-center text-base font-bold shadow-md">
                      2
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-[#CB2030] transition-colors">View & Compare</h3>
                  <p className="text-neutral-600 leading-relaxed mb-6">View detailed listings with high-quality images, 360° views, and vehicle history reports. Compare different models side by side.</p>
                  <button 
                    onClick={() => router.push('/vehicles')}
                    className="text-sm text-[#CB2030] font-medium flex items-center justify-center gap-2 group-hover:gap-3 transition-all hover:underline"
                  >
                    <span>Explore vehicles</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </CardContent>
              </Card>
              {/* Connector Line */}
              <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-1.5 bg-gradient-to-r from-[#CB2030]/30 to-[#E04B56]/30 rounded-full transform -translate-y-1/2 group-hover:bg-gradient-to-r group-hover:from-[#CB2030] group-hover:to-[#E04B56] transition-all duration-300">
                <div className="absolute top-1/2 right-0 w-3 h-3 rounded-full bg-[#CB2030] transform translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#109B4A] to-[#2EBA6A] rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-500 group-hover:duration-200"></div>
              <Card className="relative h-full bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#109B4A] to-[#2EBA6A]"></div>
                <CardContent className="pt-12 pb-10 px-8">
                  <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute w-24 h-24 bg-gradient-to-br from-[#109B4A]/10 to-transparent rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="w-20 h-20 bg-gradient-to-br from-[#109B4A] to-[#2EBA6A] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#109B4A] text-white rounded-full flex items-center justify-center text-base font-bold shadow-md">
                      3
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4 group-hover:text-[#109B4A] transition-colors">Wide Range of Dealerships</h3>
                  <p className="text-neutral-600 leading-relaxed mb-6">Browse through our network of trusted dealerships across Namibia, each offering quality vehicles and professional service.</p>
                  <button 
                    onClick={() => router.push('/dealers')}
                    className="text-sm text-[#109B4A] font-medium flex items-center justify-center gap-2 group-hover:gap-3 transition-all hover:underline"
                  >
                    <span>View dealerships</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-[#1F3469] to-[#3B4F86] rounded-2xl p-8 shadow-xl">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Ready to find your perfect car?</h3>
                <p className="text-neutral-200 max-w-2xl">Join thousands of satisfied customers who found their dream car through our platform.</p>
              </div>
              <Button 
                size="lg" 
                onClick={() => router.push('/vehicles')}
                className="bg-white text-[#1F3469] hover:bg-neutral-100 font-semibold text-base px-8 py-6 whitespace-nowrap"
              >
                Browse All Vehicles
              </Button>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <style jsx global>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </section> 


 

      {/* Wide Selection of Brands */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Wide Selection of Brands
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover vehicles from the most trusted automotive brands available in Namibia
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center justify-items-center">
            {/* BMW Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=BMW')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <Image src="/brands/bmw.png" alt="BMW" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Mercedes Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Mercedes-Benz')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <img src="/brands/merc.png" alt="Mercedes-Benz" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Toyota Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Toyota')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <img src="/brands/toyota.png" alt="Toyota" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Ford Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Ford')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <Image src="/brands/ford.png" alt="Ford" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Volkswagen Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Volkswagen')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <Image src="/brands/vw.png" alt="Volkswagen" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Audi Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Audi')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <Image src="/brands/audi.png" alt="Audi" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Nissan Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Nissan')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <Image src="/brands/nissan.png" alt="Nissan" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Jeep Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Jeep')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <Image src="/brands/jeep.png" alt="Jeep" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Hyundai Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Hyundai')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <Image src="/brands/hyundai.png" alt="Hyundai" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Kia Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Kia')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <Image src="/brands/kia.png" alt="Kia" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Mazda Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Mazda')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <Image src="/brands/mazda.png" alt="Mazda" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
            
            {/* Subaru Logo */}
            <button 
              onClick={() => router.push('/vehicles?make=Subaru')}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 w-full h-28 flex items-center justify-center group hover:scale-105 cursor-pointer"
            >
              <Image src="/brands/subaru.png" alt="Subaru" width={64} height={64} className="group-hover:scale-110 transition-transform duration-200 object-contain" />
            </button>
          </div>
          
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/vehicles')}
            >
              Browse All Brands
            </Button>
          </div>
        </div>
      </section> 



      {/* Banner Advertisement Space */}
      <section className="py-8 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="rounded-lg overflow-hidden shadow-sm border border-neutral-200">
            <div className="relative min-h-[200px] bg-gradient-to-r from-[#1F3469] to-[#3B4F86]">
              <img 
                src="/cars-na-logo.png" 
                alt="Cars.na - Namibia's Leading Car Marketplace" 
                className="w-full h-full object-contain absolute inset-0 p-8"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-[#1F3469]/10">
                <div className="text-center bg-white/95 p-8 rounded-lg backdrop-blur-sm max-w-md shadow-lg">
                  <h3 className="text-2xl font-bold mb-3 text-[#1F3469]">Partner with Cars.na</h3>
                  <p className="text-neutral-700 mb-6 leading-relaxed">
                    Reach thousands of car buyers across Namibia with our premium advertising solutions
                  </p>
                  <Button size="sm" className="bg-[#1F3469] text-white hover:bg-[#3B4F86]">
                    Advertise With Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> 

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1F3469] to-[#3B4F86] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-xl mb-8 text-neutral-200">
            Join thousands of satisfied customers who found their dream car through Cars.na
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#1F3469] hover:bg-neutral-100 font-semibold">
              Browse All Vehicles
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white hover:bg-white hover:text-[#1F3469]"
              onClick={() => router.push('/sell')}
            >
              Sell Your Car
            </Button>
          </div>
        </div>
      </section> 

      <CarFilterSearch open={searchDialogOpen} onClose={() => setSearchDialogOpen(false)} />
      
      {/* Dealer Contact Modal */}
      <DealerContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        dealership={featuredDealership}
      />
    </MainLayout>
  );
}
