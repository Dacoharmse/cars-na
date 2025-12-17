'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { MapPin, ChevronDown } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Windhoek');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  const namibianCities = [
    'Windhoek',
    'Swakopmund',
    'Walvis Bay',
    'Oshakati',
    'Rundu',
    'Katima Mulilo',
    'Otjiwarongo',
    'Gobabis'
  ];

  return (
    <>
      {/* Top Banner for Promotions */}
      <div className="bg-gradient-to-r from-[#CB2030] to-[#E04B56] text-white text-center py-2 text-sm">
        <div className="container mx-auto px-4">
          <span className="font-medium">🇳🇦 Namibia's Leading Car Marketplace</span>
          <span className="mx-2">•</span>
          <span>Over 5,000+ Verified Listings</span>
          <span className="mx-2">•</span>
          <span>Trusted by 200+ Dealers</span>
        </div>
      </div>

      <header className="bg-[#1F3469] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-[#1F3469] font-bold text-xl">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">Cars.na</span>
                <span className="text-xs text-neutral-200 leading-tight">Namibia's Marketplace</span>
              </div>
            </Link>

            {/* Location Selector - Desktop */}
            <div className="hidden lg:flex items-center relative">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center space-x-2 text-white hover:text-neutral-200 transition-colors bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">{selectedLocation}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isLocationDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50">
                  {namibianCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedLocation(city);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                        selectedLocation === city ? 'text-[#1F3469] font-medium bg-blue-50' : 'text-neutral-700'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/vehicles" className="text-white hover:text-neutral-200 transition-colors font-medium">
                Buy Cars
              </Link>
              <Link href="/sell" className="text-white hover:text-neutral-200 transition-colors font-medium">
                Sell Your Car
              </Link>
              <Link href="/financing" className="text-white hover:text-neutral-200 transition-colors font-medium">
                Financing
              </Link>
              <Link href="/about" className="text-white hover:text-neutral-200 transition-colors font-medium">
                About
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-white border-white/20 hover:bg-white/10 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-white text-[#1F3469] hover:bg-neutral-100 font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-white hover:text-neutral-200 hover:bg-white/10"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              {/* Mobile Location Selector */}
              <div className="px-4 mb-4">
                <button
                  onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                  className="flex items-center space-x-2 text-white hover:text-neutral-200 transition-colors bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm w-full"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">{selectedLocation}</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </button>
                
                {isLocationDropdownOpen && (
                  <div className="mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 py-2">
                    {namibianCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedLocation(city);
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                          selectedLocation === city ? 'text-[#1F3469] font-medium bg-blue-50' : 'text-neutral-700'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <nav className="flex flex-col space-y-4 px-4">
                <Link
                  href="/vehicles"
                  className="text-white hover:text-neutral-200 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Buy Cars
                </Link>
                <Link
                  href="/sell"
                  className="text-white hover:text-neutral-200 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sell Your Car
                </Link>
                <Link
                  href="/financing"
                  className="text-white hover:text-neutral-200 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Financing
                </Link>
                <Link 
                  href="/about" 
                  className="text-white hover:text-neutral-200 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="text-white border-white/20 hover:bg-white/10 hover:text-white w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="bg-white text-[#1F3469] hover:bg-neutral-100 font-semibold w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
