'use client';

import React from 'react';
import Link from 'next/link';
import { VehicleCard } from '@/components/ui/VehicleCard';
import { Button } from '@/components/ui/Button';
import { Eye, Star, Zap, Clock, TrendingUp, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';

// Mock data structure - will be replaced with tRPC calls
interface Vehicle {
  id: number;
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

interface BadgeProps {
  variant: 'primary' | 'secondary' | 'success' | 'info' | 'warning';
  label: string;
  icon?: React.ReactNode;
  pulse?: boolean;
}

interface ShowcaseSection {
  id: string;
  title: string;
  description?: string;
  headerColor: string;
  vehicles: Vehicle[];
  badge: BadgeProps;
  ribbon?: {
    text: string;
    color: string;
  };
}

// Mock data for development
const mockVehicles: Vehicle[] = [
  {
    id: 1,
    make: 'Toyota',
    model: 'Hilux',
    year: 2023,
    price: 520000,
    originalPrice: 580000,
    mileage: 15000,
    transmission: 'Manual',
    fuelType: 'Diesel',
    color: 'White',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&auto=format',
    dealer: 'Windhoek Motors',
    location: 'Windhoek',
    isNew: false,
    viewsLast30Days: 1250,
    createdAt: '2024-01-20',
    popularityRank: 1,
  },
  {
    id: 2,
    make: 'Ford',
    model: 'Ranger',
    year: 2024,
    price: 650000,
    mileage: 5000,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    color: 'Blue',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop&auto=format',
    dealer: 'Swakopmund Auto',
    location: 'Swakopmund',
    isNew: true,
    viewsLast30Days: 980,
    createdAt: '2024-01-21',
    popularityRank: 2,
  },
  {
    id: 3,
    make: 'BMW',
    model: 'X3',
    year: 2023,
    price: 850000,
    originalPrice: 920000,
    mileage: 12000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'Black',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&auto=format',
    dealer: 'Premium Motors',
    location: 'Windhoek',
    isNew: false,
    viewsLast30Days: 750,
    createdAt: '2024-01-19',
    popularityRank: 3,
  },
  {
    id: 4,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2024,
    price: 780000,
    mileage: 2000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    color: 'Silver',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&auto=format',
    dealer: 'Luxury Cars Namibia',
    location: 'Windhoek',
    isNew: true,
    viewsLast30Days: 650,
    createdAt: '2024-01-22',
    popularityRank: 4,
  },
];

const showcaseSections: ShowcaseSection[] = [
  {
    id: 'top-dealer-picks',
    title: 'Top Dealer Picks',
    description: 'Hand-picked premium vehicles from our top dealers',
    headerColor: 'bg-[#1F3469]',
    vehicles: mockVehicles.slice(0, 4),
    badge: {
      variant: 'primary',
      label: 'Dealer Pick',
      icon: <Star className="w-3 h-3" />,
    },
  },
  {
    id: 'featured-vehicles',
    title: 'Featured Vehicles',
    description: 'Specially selected vehicles with premium features',
    headerColor: 'bg-white border-b-2 border-[#CB2030]',
    vehicles: mockVehicles.slice(0, 4),
    badge: {
      variant: 'secondary',
      label: 'Featured',
    },
  },
  {
    id: 'top-deals',
    title: 'Top Deals',
    description: 'Best discounts and savings available now',
    headerColor: 'bg-white border-b-4 border-[#109B4A]',
    vehicles: mockVehicles.filter(v => v.originalPrice).slice(0, 4),
    badge: {
      variant: 'success',
      label: 'Great Deal',
    },
    ribbon: {
      text: 'Save 10%',
      color: 'bg-[#109B4A]',
    },
  },
  {
    id: 'most-viewed',
    title: 'Most Viewed',
    description: 'Popular vehicles that buyers are interested in',
    headerColor: 'bg-white border-b-4 border-sky-400',
    vehicles: mockVehicles.sort((a, b) => (b.viewsLast30Days || 0) - (a.viewsLast30Days || 0)).slice(0, 4),
    badge: {
      variant: 'info',
      label: 'Popular',
      icon: <Eye className="w-3 h-3" />,
    },
  },
  {
    id: 'new-listings',
    title: 'New Listings',
    description: 'Fresh arrivals in the last 72 hours',
    headerColor: 'bg-white',
    vehicles: mockVehicles.slice(0, 4),
    badge: {
      variant: 'warning',
      label: 'New',
      pulse: true,
    },
  },
];

// Helper function to generate browse URL with filters
const getBrowseUrl = (sectionId: string) => {
  switch (sectionId) {
    case 'top-dealer-picks':
      return '/vehicles?dealerPick=true';
    case 'featured-vehicles':
      return '/vehicles?featured=true';
    case 'top-deals':
      return '/vehicles?hasDiscount=true';
    case 'most-viewed':
      return '/vehicles?sortBy=views';
    case 'new-listings':
      return '/vehicles?sortBy=newest';
    case 'top-new-cars':
      return '/vehicles?isNew=true&sortBy=popularity';
    case 'top-used-cars':
      return '/vehicles?isNew=false&sortBy=popularity';
    default:
      return '/vehicles';
  }
};

const BadgeComponent: React.FC<BadgeProps & { className?: string }> = ({ 
  variant, 
  label, 
  icon, 
  pulse, 
  className = '' 
}) => {
  const baseClasses = 'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold';
  const pulseClasses = pulse ? 'animate-pulse' : '';
  
  const variantClasses = {
    primary: 'bg-[#1F3469] text-white',
    secondary: 'bg-[#CB2030] text-white',
    success: 'bg-[#109B4A] text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-gray-500 text-white',
  };

  return (
    <span 
      className={`${baseClasses} ${variantClasses[variant]} ${pulseClasses} ${className}`}
      aria-label={label}
    >
      {icon}
      {label}
    </span>
  );
};

const SectionHeader: React.FC<{ 
  title: string; 
  description?: string; 
  headerColor: string;
  sectionId?: string;
}> = ({ title, description, headerColor, sectionId }) => {
  const isBlueHeader = headerColor.includes('bg-[#1F3469]');
  const textColor = isBlueHeader ? 'text-white' : 'text-neutral-900';
  const descriptionColor = isBlueHeader ? 'text-white/90' : 'text-neutral-600';
  
  return (
    <div className={`p-4 rounded-t-lg ${headerColor} flex items-center justify-between`}>
      <div>
        <h2 className={`text-xl font-bold ${textColor}`} role="heading" aria-level={2}>
          {title}
        </h2>
        {description && (
          <p className={`text-sm ${descriptionColor} mt-1`}>{description}</p>
        )}
      </div>
      {sectionId && (
        <Link href={getBrowseUrl(sectionId)}>
          <Button 
            variant={isBlueHeader ? "secondary" : "outline"} 
            size="sm" 
            className={`flex items-center gap-2 transition-colors ${
              isBlueHeader 
                ? 'bg-white text-[#1F3469] hover:bg-neutral-100' 
                : 'hover:bg-[#1F3469] hover:text-white'
            }`}
          >
            Browse All
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
};

const VehicleCarousel: React.FC<{ 
  vehicles: Vehicle[]; 
  badge: BadgeProps;
  ribbon?: { text: string; color: string };
  sectionId: string;
}> = ({ vehicles, badge, ribbon, sectionId }) => (
  <div className="vehicle-carousel flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible" data-testid={`${sectionId}-carousel`} style={{scrollSnapType: 'x mandatory'}}>
    {vehicles.map((vehicle) => (
      <div key={vehicle.id} className="vehicle-card relative flex-none w-72 snap-start md:w-auto" tabIndex={0}>
        <VehicleCard {...vehicle} />
        <div className="absolute top-3 left-3">
          <BadgeComponent {...badge} />
        </div>
        {ribbon && (
          <div 
            className={`absolute top-0 right-0 ${ribbon.color} text-white px-3 py-1 text-xs font-bold transform rotate-12 translate-x-2 -translate-y-1`}
            data-testid="discount-ribbon"
            aria-label={ribbon.text}
          >
            {ribbon.text}
          </div>
        )}
      </div>
    ))}
  </div>
);

const TopNewUsedSection: React.FC = () => {
  const [newCarsIndex, setNewCarsIndex] = React.useState(0);
  const [usedCarsIndex, setUsedCarsIndex] = React.useState(0);
  
  // Fetch top new cars using API
  const { data: newCarsData, isLoading: newCarsLoading } = api.showcase.getTopNewCars.useQuery({
    limit: 10,
  });
  
  // Fetch top used cars using API
  const { data: usedCarsData, isLoading: usedCarsLoading } = api.showcase.getTopUsedCars.useQuery({
    limit: 10,
  });

  const newCars = (newCarsData?.vehicles || []).map(transformVehicle);
  const usedCars = (usedCarsData?.vehicles || []).map(transformVehicle);
  
  // Navigation functions
  const nextNewCars = () => {
    if (newCarsIndex + 2 < newCars.length) {
      setNewCarsIndex(newCarsIndex + 2);
    }
  };
  
  const prevNewCars = () => {
    if (newCarsIndex > 0) {
      setNewCarsIndex(Math.max(0, newCarsIndex - 2));
    }
  };
  
  const nextUsedCars = () => {
    if (usedCarsIndex + 2 < usedCars.length) {
      setUsedCarsIndex(usedCarsIndex + 2);
    }
  };
  
  const prevUsedCars = () => {
    if (usedCarsIndex > 0) {
      setUsedCarsIndex(Math.max(0, usedCarsIndex - 2));
    }
  };
  
  // Get current visible cars
  const visibleNewCars = newCars.slice(newCarsIndex, newCarsIndex + 2);
  const visibleUsedCars = usedCars.slice(usedCarsIndex, usedCarsIndex + 2);

  if (newCarsLoading || usedCarsLoading) {
    return (
      <div className="space-y-8 xl:space-y-0 xl:grid xl:grid-cols-2 xl:gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 xl:space-y-0 xl:grid xl:grid-cols-2 xl:gap-8">
      {/* Top New Cars */}
      <div data-testid="top-new-cars" className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2" role="heading" aria-level={3}>
              <TrendingUp className="w-5 h-5 text-white" />
              Top New Cars
            </h3>
            <p className="text-sm text-blue-100 mt-1">Most popular brand-new vehicles</p>
          </div>
          <Link href={getBrowseUrl('top-new-cars')}>
            <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-2 transition-colors">
              Browse All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="p-4">
          {newCars.length > 0 ? (
            <div className="relative">
              {/* Navigation Controls */}
              {newCars.length > 2 && (
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevNewCars}
                      disabled={newCarsIndex === 0}
                      className="p-2 h-8 w-8"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {newCarsIndex + 1}-{Math.min(newCarsIndex + 2, newCars.length)} of {newCars.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextNewCars}
                      disabled={newCarsIndex + 2 >= newCars.length}
                      className="p-2 h-8 w-8"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Cars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleNewCars.map((vehicle, idx) => (
                  <div key={vehicle.id} className="relative">
                    <VehicleCard {...vehicle} />
                    <div className="absolute top-3 left-3">
                      <BadgeComponent 
                        variant="info" 
                        label={`#${newCarsIndex + idx + 1}`}
                        className="bg-blue-500 text-white shadow-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No new cars available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Used Cars */}
      <div data-testid="top-used-cars" className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2" role="heading" aria-level={3}>
              <TrendingUp className="w-5 h-5 text-white" />
              Top Used Cars
            </h3>
            <p className="text-sm text-orange-100 mt-1">Most popular pre-owned vehicles</p>
          </div>
          <Link href={getBrowseUrl('top-used-cars')}>
            <Button variant="secondary" size="sm" className="bg-white text-orange-600 hover:bg-orange-50 flex items-center gap-2 transition-colors">
              Browse All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="p-4">
          {usedCars.length > 0 ? (
            <div className="relative">
              {/* Navigation Controls */}
              {usedCars.length > 2 && (
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevUsedCars}
                      disabled={usedCarsIndex === 0}
                      className="p-2 h-8 w-8"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      {usedCarsIndex + 1}-{Math.min(usedCarsIndex + 2, usedCars.length)} of {usedCars.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextUsedCars}
                      disabled={usedCarsIndex + 2 >= usedCars.length}
                      className="p-2 h-8 w-8"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Cars Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleUsedCars.map((vehicle, idx) => (
                  <div key={vehicle.id} className="relative">
                    <VehicleCard {...vehicle} />
                    <div className="absolute top-3 left-3">
                      <BadgeComponent 
                        variant="warning" 
                        label={`#${usedCarsIndex + idx + 1}`}
                        className="bg-orange-500 text-white shadow-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No used cars available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Transform API vehicle data to component format
const transformVehicle = (apiVehicle: any): Vehicle => ({
  id: parseInt(apiVehicle.id),
  make: apiVehicle.make,
  model: apiVehicle.model,
  year: apiVehicle.year,
  price: apiVehicle.price,
  originalPrice: apiVehicle.originalPrice,
  mileage: apiVehicle.mileage,
  transmission: apiVehicle.transmission,
  fuelType: apiVehicle.fuelType,
  color: apiVehicle.color,
  image: apiVehicle.images?.[0]?.url || '/placeholder-car.jpg',
  dealer: apiVehicle.dealership?.name || 'Unknown Dealer',
  location: apiVehicle.dealership?.city || 'Unknown Location',
  isNew: apiVehicle.status === 'NEW',
  viewsLast30Days: apiVehicle.viewCount || 0,
  createdAt: apiVehicle.createdAt,
  popularityRank: apiVehicle.popularityRank || 1,
});

export const HomeShowcase: React.FC = () => {
  // Fetch featured vehicles using tRPC
  const { data: featuredData, isLoading: featuredLoading } = api.showcase.getFeatured.useQuery({
    limit: 4,
  });

  // Fetch top deals using tRPC  
  const { data: dealsData, isLoading: dealsLoading } = api.showcase.getTopDeals.useQuery({
    limit: 4,
  });

  // Fetch most viewed vehicles using tRPC
  const { data: viewedData, isLoading: viewedLoading } = api.showcase.getMostViewed.useQuery({
    limit: 4,
  });

  // Fetch new listings using tRPC
  const { data: newData, isLoading: newLoading } = api.showcase.getNewListings.useQuery({
    limit: 4,
  });

  // Create showcase sections with real data
  const showcaseSections: ShowcaseSection[] = [
    {
      id: 'featured-vehicles',
      title: 'Featured Vehicles',
      description: 'Specially selected vehicles with premium features',
      headerColor: 'bg-[#1F3469]',
      vehicles: (featuredData?.vehicles || []).map(transformVehicle),
      badge: {
        variant: 'primary',
        label: 'Featured',
        icon: <Star className="w-3 h-3" />,
      },
    },
    {
      id: 'top-deals',
      title: 'Top Deals',
      description: 'Best discounts and savings available now',
      headerColor: 'bg-white border-b-4 border-[#109B4A]',
      vehicles: (dealsData?.vehicles || []).map(transformVehicle),
      badge: {
        variant: 'success',
        label: 'Great Deal',
      },
      ribbon: {
        text: 'Save Up to 15%',
        color: 'bg-[#109B4A]',
      },
    },
    {
      id: 'most-viewed',
      title: 'Most Viewed',
      description: 'Popular vehicles that buyers are interested in',
      headerColor: 'bg-white border-b-4 border-sky-400',
      vehicles: (viewedData?.vehicles || []).map(transformVehicle),
      badge: {
        variant: 'info',
        label: 'Popular',
        icon: <Eye className="w-3 h-3" />,
      },
    },
    {
      id: 'new-listings',
      title: 'New Listings',
      description: 'Fresh arrivals in the last 72 hours',
      headerColor: 'bg-white',
      vehicles: (newData?.vehicles || []).map(transformVehicle),
      badge: {
        variant: 'warning',
        label: 'New',
        pulse: true,
      },
    },
  ];

  const isLoading = featuredLoading || dealsLoading || viewedLoading || newLoading;

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading showcase...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-neutral-50" data-testid="home-showcase">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          {showcaseSections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden" data-testid={`showcase-${section.id}`}>
              <SectionHeader 
                title={section.title}
                description={section.description}
                headerColor={section.headerColor}
                sectionId={section.id}
              />
              <div className="p-6">
                {section.vehicles.length > 0 ? (
                  <VehicleCarousel 
                    vehicles={section.vehicles}
                    badge={section.badge}
                    ribbon={section.ribbon}
                    sectionId={section.id}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No vehicles available in this category</p>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Top New Cars & Top Used Cars Section */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden" data-testid="showcase-top-new-used">
            <div className="bg-white p-4 rounded-t-lg">
              <h2 className="text-xl font-bold text-neutral-900" role="heading" aria-level={2}>Popular by Category</h2>
              <p className="text-sm text-neutral-600 mt-1">Top-ranked vehicles in new and used categories</p>
            </div>
            <div className="p-6">
              <TopNewUsedSection />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeShowcase;
