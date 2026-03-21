'use client';

import React from 'react';
import Link from 'next/link';
import { VehicleCard } from '@/components/ui/VehicleCard';
import { ArrowRight, Star, TrendingUp, Clock, Percent } from 'lucide-react';
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

const getBrowseUrl = (sectionId: string) => {
  switch (sectionId) {
    case 'featured': return '/vehicles?featured=true';
    case 'deals': return '/vehicles?hasDiscount=true';
    case 'popular': return '/vehicles?sortBy=views';
    case 'new': return '/vehicles?sortBy=newest';
    default: return '/vehicles';
  }
};

interface SectionProps {
  title: string;
  sectionId: string;
  icon: React.ReactNode;
  vehicles: Vehicle[];
}

const VehicleSection: React.FC<SectionProps> = ({ title, sectionId, icon, vehicles }) => {
  if (vehicles.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <Link
          href={getBrowseUrl(sectionId)}
          className="text-sm font-semibold text-[#CB2030] hover:text-[#b81c2a] flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} {...vehicle} />
        ))}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200" />
        <div className="p-4 space-y-3">
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
  const { data: featuredData, isLoading: featuredLoading } = api.showcase.getFeaturedVehicles.useQuery({ take: 4 });
  const { data: dealsData, isLoading: dealsLoading } = api.showcase.getTopDeals.useQuery({ take: 4 });
  const { data: viewedData, isLoading: viewedLoading } = api.showcase.getMostViewed.useQuery({ take: 4 });
  const { data: newData, isLoading: newLoading } = api.showcase.getNewListings.useQuery({ take: 4 });

  const featured = (featuredData?.vehicles || []).map(transformVehicle);
  const deals = (dealsData?.vehicles || []).map(transformVehicle);
  const popular = (viewedData?.vehicles || []).map(transformVehicle);
  const newest = (newData?.vehicles || []).map(transformVehicle);

  const isLoading = featuredLoading || dealsLoading || viewedLoading || newLoading;

  return (
    <section className="bg-white py-10 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {isLoading ? (
          <>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <LoadingSkeleton />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
              <LoadingSkeleton />
            </div>
          </>
        ) : (
          <>
            <VehicleSection
              title="Featured"
              sectionId="featured"
              icon={<Star className="w-5 h-5 text-[#CB2030]" />}
              vehicles={featured}
            />
            <VehicleSection
              title="Top Deals"
              sectionId="deals"
              icon={<Percent className="w-5 h-5 text-green-600" />}
              vehicles={deals}
            />
            <VehicleSection
              title="Most Popular"
              sectionId="popular"
              icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
              vehicles={popular}
            />
            <VehicleSection
              title="Just Listed"
              sectionId="new"
              icon={<Clock className="w-5 h-5 text-orange-500" />}
              vehicles={newest}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default HomeShowcase;
