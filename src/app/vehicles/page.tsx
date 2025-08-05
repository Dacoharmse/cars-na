'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { VehicleCard } from '@/components/examples/VehicleCard';
import { api } from '@/lib/api';

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    make: '',
    priceMin: '',
    priceMax: '',
    year: '',
    mileage: '',
    transmission: '',
    fuelType: '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Use tRPC query to fetch vehicles
  const { data: vehicleData, isLoading, error, refetch } = api.vehicle.getAll.useQuery({
    limit: 20,
    filters: {
      make: filters.make || undefined,
      minPrice: filters.priceMin ? parseInt(filters.priceMin) : undefined,
      maxPrice: filters.priceMax ? parseInt(filters.priceMax) : undefined,
      minYear: filters.year ? parseInt(filters.year) : undefined,
      maxYear: filters.year ? parseInt(filters.year) : undefined,
      maxMileage: filters.mileage ? parseInt(filters.mileage) : undefined,
    },
  });

  const vehicles = vehicleData?.items || [];

  // Handle filter changes to refetch data
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      make: '',
      priceMin: '',
      priceMax: '',
      year: '',
      mileage: '',
      transmission: '',
      fuelType: '',
    });
    setSearchQuery('');
  };

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Vehicles</h1>
            <p className="text-gray-600 mb-6">{error.message}</p>
            <Button onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Browse Vehicles</h1>
          <p className="text-neutral-600">Find your perfect car from our extensive inventory</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                
                <div className="space-y-4">
                  <Input
                    label="Search"
                    placeholder="Make, model, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  <Select
                    label="Make"
                    options={[
                      { value: '', label: 'Any Make' },
                      { value: 'toyota', label: 'Toyota' },
                      { value: 'honda', label: 'Honda' },
                      { value: 'ford', label: 'Ford' },
                      { value: 'bmw', label: 'BMW' },
                      { value: 'tesla', label: 'Tesla' },
                      { value: 'chevrolet', label: 'Chevrolet' },
                    ]}
                    value={filters.make}
                    onChange={(e) => handleFilterChange('make', e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Min Price"
                      placeholder="$0"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    />
                    <Input
                      label="Max Price"
                      placeholder="$100,000"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    />
                  </div>
                  
                  <Select
                    label="Year"
                    options={[
                      { value: '', label: 'Any Year' },
                      { value: '2024', label: '2024' },
                      { value: '2023', label: '2023' },
                      { value: '2022', label: '2022' },
                      { value: '2021', label: '2021' },
                      { value: '2020', label: '2020' },
                    ]}
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                  />
                  
                  <Select
                    label="Max Mileage"
                    options={[
                      { value: '', label: 'Any Mileage' },
                      { value: '10000', label: 'Under 10,000 mi' },
                      { value: '25000', label: 'Under 25,000 mi' },
                      { value: '50000', label: 'Under 50,000 mi' },
                      { value: '100000', label: 'Under 100,000 mi' },
                    ]}
                    value={filters.mileage}
                    onChange={(e) => handleFilterChange('mileage', e.target.value)}
                  />
                  
                  <Select
                    label="Transmission"
                    options={[
                      { value: '', label: 'Any Transmission' },
                      { value: 'automatic', label: 'Automatic' },
                      { value: 'manual', label: 'Manual' },
                    ]}
                    value={filters.transmission}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                  />
                  
                  <Select
                    label="Fuel Type"
                    options={[
                      { value: '', label: 'Any Fuel Type' },
                      { value: 'gasoline', label: 'Gasoline' },
                      { value: 'hybrid', label: 'Hybrid' },
                      { value: 'electric', label: 'Electric' },
                      { value: 'diesel', label: 'Diesel' },
                    ]}
                    value={filters.fuelType}
                    onChange={(e) => handleFilterChange('fuelType', e.target.value)}
                  />
                  
                  <div className="pt-4 border-t">
                    <Button variant="outline" fullWidth onClick={clearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="text-sm text-neutral-600">
                {isLoading ? (
                  'Loading vehicles...'
                ) : (
                  `Showing ${vehicles.length} ${vehicles.length === 1 ? 'vehicle' : 'vehicles'}`
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <Select
                  options={[
                    { value: 'newest', label: 'Newest First' },
                    { value: 'price-low', label: 'Price: Low to High' },
                    { value: 'price-high', label: 'Price: High to Low' },
                    { value: 'mileage', label: 'Lowest Mileage' },
                    { value: 'year', label: 'Newest Year' },
                  ]}
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                />
                
                <div className="flex border border-neutral-300 rounded-md">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading vehicles...</span>
              </div>
            )}

            {/* No Results */}
            {!isLoading && vehicles.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Vehicle Grid */}
            {!isLoading && vehicles.length > 0 && (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {vehicles.map((vehicle) => (
                  <VehicleCard 
                    key={vehicle.id} 
                    id={vehicle.id}
                    make={vehicle.make}
                    model={vehicle.model}
                    year={vehicle.year}
                    price={vehicle.price}
                    mileage={vehicle.mileage}
                    imageUrl={vehicle.images?.[0]?.url || '/placeholder-car.jpg'}
                    exteriorColor={vehicle.color}
                    transmission={vehicle.transmission}
                    fuelType={vehicle.fuelType}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center mt-12 gap-2">
              <Button variant="outline" disabled>Previous</Button>
              <Button variant="outline">1</Button>
              <Button>2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
