'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft,
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Car, 
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Eye,
  Heart,
  Share2,
  Filter,
  Search,
  Grid3X3,
  List
} from 'lucide-react';

// Mock dealer data - in real app this would come from API
const DEALERS = {
  '1': {
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
  '2': {
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
  }
};

// Mock inventory data
const MOCK_VEHICLES = [
  {
    id: 1,
    make: 'BMW',
    model: 'X5',
    year: 2022,
    price: 850000,
    mileage: 15000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'Alpine White',
    description: 'Luxury SUV in excellent condition with full service history.',
    images: ['https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Car+Image'],
    featured: true,
    status: 'available'
  },
  {
    id: 2,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2021,
    price: 620000,
    mileage: 28000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'Obsidian Black',
    description: 'Executive sedan with premium features and leather interior.',
    images: ['https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Car+Image'],
    featured: false,
    status: 'available'
  },
  {
    id: 3,
    make: 'Audi',
    model: 'A4',
    year: 2020,
    price: 520000,
    mileage: 45000,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    color: 'Glacier White',
    description: 'Well-maintained sedan perfect for business and leisure.',
    images: ['https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Car+Image'],
    featured: true,
    status: 'available'
  },
  {
    id: 4,
    make: 'BMW',
    model: '3 Series',
    year: 2023,
    price: 750000,
    mileage: 8000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'Mineral Grey',
    description: 'Latest model with cutting-edge technology and performance.',
    images: ['https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Car+Image'],
    featured: true,
    status: 'available'
  }
];

export default function DealerInventoryPage() {
  const params = useParams();
  const router = useRouter();
  const dealerId = params?.dealerId as string;
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredVehicles, setFilteredVehicles] = useState(MOCK_VEHICLES);
  
  const dealer = DEALERS[dealerId as keyof typeof DEALERS];

  useEffect(() => {
    // Filter vehicles based on search query
    const filtered = MOCK_VEHICLES.filter(vehicle => 
      `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.year.toString().includes(searchQuery)
    );
    setFilteredVehicles(filtered);
  }, [searchQuery]);

  if (!dealer) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Dealer Not Found</h1>
            <Button onClick={() => router.push('/dealers')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dealers
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Dealer Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Button>
              </div>
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{dealer.name}</h1>
                  {dealer.verified && (
                    <Badge className="bg-green-100 text-green-800">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{dealer.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
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
          </div>
        </section>

        {/* Inventory Controls */}
        <section className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Vehicle Inventory ({filteredVehicles.length})
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vehicle Inventory */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {filteredVehicles.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-600">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredVehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      {/* Vehicle Image */}
                      <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                        <img
                          src={vehicle.images[0] || 'https://via.placeholder.com/800x600/e5e7eb/6b7280?text=Car+Image'}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                        {vehicle.featured && (
                          <Badge className="absolute top-2 left-2 bg-blue-600">
                            Featured
                          </Badge>
                        )}
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button size="sm" variant="secondary" className="p-2 bg-white/90">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="p-2 bg-white/90">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Vehicle Details */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              {vehicle.make} {vehicle.model}
                            </h3>
                            <p className="text-gray-600">{vehicle.year}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                              {formatPrice(vehicle.price)}
                            </p>
                          </div>
                        </div>

                        {/* Vehicle Specs */}
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <Gauge className="w-4 h-4 mr-2" />
                            <span>{vehicle.mileage?.toLocaleString()} km</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Settings className="w-4 h-4 mr-2" />
                            <span>{vehicle.transmission}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Fuel className="w-4 h-4 mr-2" />
                            <span>{vehicle.fuelType}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <div className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: vehicle.color.toLowerCase().includes('white') ? '#fff' : vehicle.color.toLowerCase().includes('black') ? '#000' : '#666'}}></div>
                            <span>{vehicle.color}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {vehicle.description}
                        </p>

                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          <Button variant="outline">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}