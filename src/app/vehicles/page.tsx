'use client';

import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { VehicleCard } from '@/components/examples/VehicleCard';

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

  const vehicles = [
    {
      id: 'v1',
      make: 'Toyota',
      model: 'Camry',
      year: 2023,
      price: 32000,
      mileage: 8500,
      imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
      exteriorColor: 'Silver',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
    },
    {
      id: 'v2',
      make: 'Honda',
      model: 'CR-V',
      year: 2022,
      price: 29500,
      mileage: 12000,
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
      exteriorColor: 'Blue',
      transmission: 'Automatic',
      fuelType: 'Hybrid',
    },
    {
      id: 'v3',
      make: 'Ford',
      model: 'F-150',
      year: 2023,
      price: 48000,
      mileage: 5200,
      imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d661c?w=800&q=80',
      exteriorColor: 'Red',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
    },
    {
      id: 'v4',
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      price: 42000,
      mileage: 18000,
      imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      exteriorColor: 'Black',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
    },
    {
      id: 'v5',
      make: 'Tesla',
      model: 'Model 3',
      year: 2022,
      price: 45000,
      mileage: 15000,
      imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
      exteriorColor: 'White',
      transmission: 'Automatic',
      fuelType: 'Electric',
    },
    {
      id: 'v6',
      make: 'Chevrolet',
      model: 'Silverado',
      year: 2023,
      price: 52000,
      mileage: 3000,
      imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
      exteriorColor: 'Gray',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
    },
  ];

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
                    onChange={(e) => setFilters({...filters, make: e.target.value})}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Min Price"
                      placeholder="$0"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                    />
                    <Input
                      label="Max Price"
                      placeholder="$100,000"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
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
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
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
                    onChange={(e) => setFilters({...filters, mileage: e.target.value})}
                  />
                  
                  <Select
                    label="Transmission"
                    options={[
                      { value: '', label: 'Any Transmission' },
                      { value: 'automatic', label: 'Automatic' },
                      { value: 'manual', label: 'Manual' },
                    ]}
                    value={filters.transmission}
                    onChange={(e) => setFilters({...filters, transmission: e.target.value})}
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
                    onChange={(e) => setFilters({...filters, fuelType: e.target.value})}
                  />
                  
                  <div className="pt-4 border-t">
                    <Button variant="outline" fullWidth>
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
                Showing {vehicles.length} of {vehicles.length} vehicles
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

            {/* Vehicle Grid */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} {...vehicle} />
              ))}
            </div>

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
