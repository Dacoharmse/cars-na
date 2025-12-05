'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  MapPin,
  Phone,
  Mail,
  Star,
  Car,
  Users,
  Award,
  Clock,
  CheckCircle,
  Eye,
  Building2,
  MapPinned
} from 'lucide-react';

export default function DealersPage() {
  const router = useRouter();
  const [dealers, setDealers] = useState<any[]>([]);
  const [filteredDealers, setFilteredDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      const response = await fetch('/api/dealerships');
      if (response.ok) {
        const data = await response.json();
        // Ensure data is an array
        const dealersArray = Array.isArray(data) ? data : [];
        setDealers(dealersArray);
        setFilteredDealers(dealersArray);
      }
    } catch (error) {
      console.error('Error fetching dealers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [selectedRegion, selectedCity, selectedSpecialty, verifiedOnly, featuredOnly, dealers]);

  const applyFilters = () => {
    let filtered = [...dealers];

    // Filter by region
    if (selectedRegion) {
      filtered = filtered.filter(dealer => dealer.region === selectedRegion);
    }

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter(dealer => dealer.city === selectedCity);
    }

    // Filter by specialty
    if (selectedSpecialty) {
      filtered = filtered.filter(dealer =>
        dealer.specializations &&
        dealer.specializations.toLowerCase().includes(selectedSpecialty.toLowerCase())
      );
    }

    // Filter verified only
    if (verifiedOnly) {
      filtered = filtered.filter(dealer => dealer.isVerified);
    }

    // Filter featured only
    if (featuredOnly) {
      filtered = filtered.filter(dealer => dealer.isFeatured);
    }

    setFilteredDealers(filtered);
  };

  const clearFilters = () => {
    setSelectedRegion('');
    setSelectedCity('');
    setSelectedSpecialty('');
    setVerifiedOnly(false);
    setFeaturedOnly(false);
  };

  // Get unique regions and cities for filter dropdowns
  const regions = Array.from(new Set(dealers.map(d => d.region).filter(Boolean))).sort();
  const cities = Array.from(new Set(dealers.map(d => d.city).filter(Boolean))).sort();
  const specialties = Array.from(
    new Set(
      dealers
        .filter(d => d.specializations)
        .flatMap(d => d.specializations.split(',').map((s: string) => s.trim()))
    )
  ).sort();

  const handleBrowseAllDealers = () => {
    // Scroll to the dealers section
    const dealersSection = document.getElementById('all-dealers-section');
    if (dealersSection) {
      dealersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBecomeDealer = () => {
    router.push('/dealers/register');
  };

  const handleViewInventory = (dealerId: string, dealerName: string) => {
    // Navigate to dealer's inventory page
    router.push(`/dealers/${dealerId}/inventory`);
  };

  const handleMailDealer = (dealerEmail: string, dealerName: string) => {
    // Open mail client
    window.location.href = `mailto:${dealerEmail}?subject=Inquiry about vehicles at ${dealerName}`;
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#1F3469] to-[#3B4F86] text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Trusted Car Dealers in Namibia
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Connect with verified, professional car dealers across Namibia. 
                Find quality vehicles with confidence and peace of mind.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-[#1F3469] hover:bg-gray-100"
                  onClick={handleBrowseAllDealers}
                >
                  Browse All Dealers
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-white border-white hover:bg-white hover:text-[#1F3469]"
                  onClick={handleBecomeDealer}
                >
                  Become a Dealer
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(#1F346908_1px,transparent_1px)] [background-size:32px_32px]" />
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 relative">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Join Namibia's leading automotive marketplace with verified dealers and quality vehicles
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Verified Dealers */}
              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 relative overflow-hidden">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50" />
                  
                  <div className="relative text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3">
                      200+
                    </h3>
                    <p className="text-slate-600 font-semibold text-lg">Verified Dealers</p>
                    <p className="text-slate-500 text-sm mt-2">Professional & Trusted</p>
                  </div>
                </div>
              </div>

              {/* Quality Vehicles */}
              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 relative overflow-hidden">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-50" />
                  
                  <div className="relative text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Car className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-3">
                      5,000+
                    </h3>
                    <p className="text-slate-600 font-semibold text-lg">Quality Vehicles</p>
                    <p className="text-slate-500 text-sm mt-2">Inspected & Verified</p>
                  </div>
                </div>
              </div>

              {/* Average Rating */}
              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 relative overflow-hidden">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-transparent opacity-50" />
                  
                  <div className="relative text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Star className="w-10 h-10 text-white fill-current" />
                    </div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-700 bg-clip-text text-transparent mb-3">
                      4.7
                    </h3>
                    <p className="text-slate-600 font-semibold text-lg">Average Rating</p>
                    <p className="text-slate-500 text-sm mt-2">Customer Satisfaction</p>
                  </div>
                </div>
              </div>

              {/* Years Experience */}
              <div className="group">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 relative overflow-hidden">
                  {/* Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-50" />
                  
                  <div className="relative text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-3">
                      15
                    </h3>
                    <p className="text-slate-600 font-semibold text-lg">Years Experience</p>
                    <p className="text-slate-500 text-sm mt-2">Industry Leadership</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-slate-200">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700 font-medium">Verified Platform</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700 font-medium">Secure Transactions</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700 font-medium">Quality Assured</span>
              </div>
            </div>
          </div>
        </section>

        {/* All Dealers with Filters */}
        <section id="all-dealers-section" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                All Dealerships
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Browse through {dealers.length} verified dealerships across Namibia
              </p>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filter Dealerships</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Regions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City/Town
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Specialty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialty
                  </label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                </div>

                {/* Verified Only Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Verified Only</span>
                  </label>
                </div>

                {/* Featured Only Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured
                  </label>
                  <label className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={featuredOnly}
                      onChange={(e) => setFeaturedOnly(e.target.checked)}
                      className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Featured Only</span>
                  </label>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredDealers.length}</span> of <span className="font-semibold text-gray-900">{dealers.length}</span> dealerships
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {loading ? (
                <div className="col-span-2 text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading dealerships...</p>
                </div>
              ) : filteredDealers.length === 0 ? (
                <div className="col-span-2 text-center py-12">
                  <p className="text-gray-600">No dealerships found</p>
                </div>
              ) : (
                filteredDealers.map((dealer) => (
                  <Card key={dealer.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{dealer.name}</h3>
                            {dealer.isVerified && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{dealer.streetAddress || dealer.city || 'Location not specified'}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center">
                              <Car className="w-4 h-4 mr-1" />
                              <span>{dealer._count?.vehicles || 0} vehicles</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {dealer.specializations && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 mb-2">Specialties:</h4>
                          <div className="flex flex-wrap gap-2">
                            {dealer.specializations.split(',').map((specialty: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {specialty.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{Math.floor((new Date().getTime() - new Date(dealer.createdAt).getTime()) / (365 * 24 * 60 * 60 * 1000))} years in business</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewInventory(dealer.id, dealer.name)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Inventory
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMailDealer(dealer.email || '', dealer.name)}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Contact Dealer
                          </Button>
                        </div>

                        {/* Call button as primary action */}
                        {dealer.phone && (
                          <div className="mt-3">
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() => window.location.href = `tel:${dealer.phone}`}
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Call {dealer.phone}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Become a Dealer CTA */}
        <section className="py-16 bg-gradient-to-r from-[#1F3469] to-[#3B4F86] text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Our Network?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Partner with Cars.na and reach thousands of potential customers across Namibia. 
              Grow your business with our comprehensive dealer platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#1F3469] hover:bg-gray-100"
                onClick={handleBecomeDealer}
              >
                Apply to Become a Dealer
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white hover:bg-white hover:text-[#1F3469]"
                onClick={() => router.push('/help')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
