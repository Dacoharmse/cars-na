'use client';

import React from 'react';
import Link from 'next/link';
import { VehicleCard } from '@/components/ui/VehicleCard';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  image: string;
  dealer: string;
  location: string;
  isNew?: boolean;
  viewsLast30Days?: number;
  createdAt?: string;
  popularityRank?: number;
}

const transformVehicle = (apiVehicle: any): Vehicle => ({
  id: apiVehicle.id,
  make: apiVehicle.make,
  model: apiVehicle.model,
  year: apiVehicle.year,
  price: apiVehicle.price,
  originalPrice: apiVehicle.originalPrice,
  mileage: apiVehicle.mileage,
  transmission: apiVehicle.transmission,
  fuelType: apiVehicle.fuelType,
  color: apiVehicle.color,
  image: apiVehicle.images?.[0]?.url || 'https://placehold.co/800x600/e5e7eb/6b7280?text=Car+Image',
  dealer: apiVehicle.dealership?.name || 'Unknown Dealer',
  location: apiVehicle.dealership?.city || 'Unknown Location',
  isNew: apiVehicle.isNew || false,
  viewsLast30Days: apiVehicle.viewCount || 0,
  createdAt: apiVehicle.createdAt,
  popularityRank: apiVehicle.popularityRank || 1,
});

const LoadingSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
        <div className="h-36 sm:h-48 bg-gray-200" />
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-5 bg-gray-200 rounded w-1/2" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-3 bg-gray-100 rounded" />
            <div className="h-3 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const HomeShowcase: React.FC = () => {
  // Fetch all categories
  const { data: featuredData, isLoading: featuredLoading } = api.showcase.getFeaturedVehicles.useQuery({ take: 8 });
  const { data: dealsData, isLoading: dealsLoading } = api.showcase.getTopDeals.useQuery({ take: 8 });
  const { data: viewedData, isLoading: viewedLoading } = api.showcase.getMostViewed.useQuery({ take: 8 });
  const { data: newData, isLoading: newLoading } = api.showcase.getNewListings.useQuery({ take: 8 });

  const featured = (featuredData?.vehicles || []).map(transformVehicle);
  const deals = (dealsData?.vehicles || []).map(transformVehicle);
  const popular = (viewedData?.vehicles || []).map(transformVehicle);
  const newest = (newData?.vehicles || []).map(transformVehicle);

  // Merge all vehicles into one list, deduplicated by id
  const allVehiclesMap = new Map<string, Vehicle>();
  // Priority order: featured first, then deals, popular, newest
  [...featured, ...deals, ...popular, ...newest].forEach((v) => {
    if (!allVehiclesMap.has(v.id)) {
      allVehiclesMap.set(v.id, v);
    }
  });
  const allVehicles = Array.from(allVehiclesMap.values());

  const isLoading = featuredLoading || dealsLoading || viewedLoading || newLoading;

  return (
    <section className="bg-white py-8 sm:py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Cars for Sale
            </h2>
            {!isLoading && allVehicles.length > 0 && (
              <p className="text-sm text-gray-400 mt-0.5">
                Showing {allVehicles.length} vehicles
              </p>
            )}
          </div>
          <Link
            href="/vehicles"
            className="h-9 px-4 bg-[#CB2030] hover:bg-[#b81c2a] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : allVehicles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No vehicles available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {allVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} {...vehicle} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!isLoading && allVehicles.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 h-11 px-8 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
            >
              Browse All Cars <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeShowcase;
