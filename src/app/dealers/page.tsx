'use client';

import React, { useState } from 'react';
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

// Mock dealer data
const FEATURED_DEALERS = [
  {
    id: '1',
    name: 'Premium Motors',
    location: 'Windhoek',
    address: '123 Independence Avenue, Windhoek',
    phone: '+264 61 123 4567',
    email: 'info@premiummotors.na',
    rating: 4.8,
    totalReviews: 156,
    totalVehicles: 45,
    yearsInBusiness: 15,
    specialties: ['Luxury Cars', 'SUVs', 'German Brands'],
    verified: true,
    image: '/dealers/premium-motors.jpg'
  },
  {
    id: '2',
    name: 'City Cars Namibia',
    location: 'Swakopmund',
    address: '456 Sam Nujoma Avenue, Swakopmund',
    phone: '+264 64 234 5678',
    email: 'sales@citycars.na',
    rating: 4.6,
    totalReviews: 89,
    totalVehicles: 32,
    yearsInBusiness: 8,
    specialties: ['Family Cars', 'Economy Vehicles', 'First Time Buyers'],
    verified: true,
    image: '/dealers/city-cars.jpg'
  },
  {
    id: '3',
    name: 'Auto Palace',
    location: 'Walvis Bay',
    address: '789 Theo-Ben Gurirab Street, Walvis Bay',
    phone: '+264 64 345 6789',
    email: 'contact@autopalace.na',
    rating: 4.7,
    totalReviews: 124,
    totalVehicles: 28,
    yearsInBusiness: 12,
    specialties: ['Trucks', 'Commercial Vehicles', 'Off-Road'],
    verified: true,
    image: '/dealers/auto-palace.jpg'
  },
  {
    id: '4',
    name: 'Elite Autos',
    location: 'Oshakati',
    address: '321 Oshakati Main Road, Oshakati',
    phone: '+264 65 456 7890',
    email: 'info@eliteautos.na',
    rating: 4.5,
    totalReviews: 67,
    totalVehicles: 22,
    yearsInBusiness: 6,
    specialties: ['Sports Cars', 'Performance Vehicles', 'Imports'],
    verified: true,
    image: '/dealers/elite-autos.jpg'
  }
];

export default function DealersPage() {
  const router = useRouter();
  const [filteredDealers, setFilteredDealers] = useState(FEATURED_DEALERS);
  const [filterType, setFilterType] = useState<string | null>(null);

  const handleBrowseAllDealers = () => {
    // Scroll to the dealers section or show all dealers
    const dealersSection = document.getElementById('all-dealers-section');
    if (dealersSection) {
      dealersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBecomeDealer = () => {
    router.push('/dealers/register');
  };

  const handleViewAllDealers = () => {
    // For now, just scroll to the dealers section. 
    // In a real app, this would navigate to a full dealers list page
    handleBrowseAllDealers();
  };

  const handleViewInventory = (dealerId: string, dealerName: string) => {
    // Navigate to dealer's inventory page
    router.push(`/dealers/${dealerId}/inventory`);
  };

  const handleMailDealer = (dealerEmail: string, dealerName: string) => {
    // Open mail client
    window.location.href = `mailto:${dealerEmail}?subject=Inquiry about vehicles at ${dealerName}`;
  };

  const handleViewRelated = (dealerId: string, specialties: string[]) => {
    // Filter dealers by similar specialties
    const targetSpecialty = specialties[0];
    if (targetSpecialty) {
      const related = FEATURED_DEALERS.filter(dealer => 
        dealer.id !== dealerId && 
        dealer.specialties.some(specialty => 
          specialty.toLowerCase().includes(targetSpecialty.toLowerCase()) ||
          targetSpecialty.toLowerCase().includes(specialty.toLowerCase())
        )
      );
      
      setFilteredDealers(related.length > 0 ? related : FEATURED_DEALERS);
      setFilterType(`Dealers with "${targetSpecialty}" specialty`);
    } else {
      setFilteredDealers(FEATURED_DEALERS);
      setFilterType(null);
    }
    
    // Scroll to dealers section
    const dealersSection = document.getElementById('all-dealers-section');
    if (dealersSection) {
      dealersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewSameTown = (location: string) => {
    // Filter dealers in same town
    const sameTownDealers = FEATURED_DEALERS.filter(dealer => 
      dealer.location.toLowerCase() === location.toLowerCase()
    );
    
    setFilteredDealers(sameTownDealers.length > 0 ? sameTownDealers : FEATURED_DEALERS);
    setFilterType(`Dealers in ${location}`);
    
    // Scroll to dealers section
    const dealersSection = document.getElementById('all-dealers-section');
    if (dealersSection) {
      dealersSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearFilter = () => {
    setFilteredDealers(FEATURED_DEALERS);
    setFilterType(null);
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

        {/* Featured Dealers */}
        <section id="all-dealers-section" className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {filterType ? 'Filtered Dealers' : 'Featured Dealers'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {filterType || 'Discover our top-rated dealers who consistently provide exceptional service and quality vehicles.'}
              </p>
              {filterType && (
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearFilter}
                    className="mx-auto"
                  >
                    Clear Filter - Show All Dealers
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredDealers.map((dealer) => (
                <Card key={dealer.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{dealer.name}</h3>
                          {dealer.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="text-sm">{dealer.address}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{dealer.rating}</span>
                            <span className="ml-1">({dealer.totalReviews} reviews)</span>
                          </div>
                          <div className="flex items-center">
                            <Car className="w-4 h-4 mr-1" />
                            <span>{dealer.totalVehicles} vehicles</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Specialties:</h4>
                      <div className="flex flex-wrap gap-2">
                        {dealer.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{dealer.yearsInBusiness} years in business</span>
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
                          onClick={() => handleMailDealer(dealer.email, dealer.name)}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Mail
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewRelated(dealer.id, dealer.specialties)}
                        >
                          <Building2 className="w-4 h-4 mr-1" />
                          View Related
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewSameTown(dealer.location)}
                        >
                          <MapPinned className="w-4 h-4 mr-1" />
                          Same Town
                        </Button>
                      </div>
                      
                      {/* Call button as primary action */}
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" variant="outline" onClick={handleViewAllDealers}>
                View All Dealers
              </Button>
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
