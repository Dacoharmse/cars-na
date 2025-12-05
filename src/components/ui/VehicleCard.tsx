import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from './Card';
import { Button } from './Button';
import { Heart, Star, Gauge, Settings, Fuel, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface VehicleCardProps {
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
  featured?: boolean;
  dealerBoost?: boolean;
  className?: string;
}

const VehicleCard = React.forwardRef<HTMLDivElement, VehicleCardProps>(
  ({
    id,
    make,
    model,
    year,
    price,
    originalPrice = undefined,
    mileage,
    transmission,
    fuelType,
    color,
    image,
    dealer,
    location,
    isNew,
    viewsLast30Days,
    createdAt,
    popularityRank,
    featured = false,
    dealerBoost = false,
    className,
    ...props
  }, ref) => {
    const router = useRouter();
    const formatPrice = (price: number) => {
      return `N$ ${price.toLocaleString()}`;
    };

    const formatMileage = (mileage: number) => {
      return `${mileage.toLocaleString()} km`;
    };

    const handleViewDetails = () => {
      router.push(`/vehicles/${id}`);
    };

    return (
      <Card 
        ref={ref} 
        className={cn(
          'overflow-hidden transition-all duration-200 hover:shadow-lg',
          dealerBoost && 'ring-2 ring-primary-500 shadow-md',
          className
        )}
        {...props}
      >
        <div className="relative">
          <img
            src={image}
            alt={`${year} ${make} ${model} - ${color} color, ${formatMileage(mileage)}`}
            className="w-full h-48 object-cover"
          />
          
          {/* Featured/Dealer Boost Badge */}
          {dealerBoost && (
            <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" aria-hidden="true" />
              Top Pick
            </div>
          )}
          
          {featured && !dealerBoost && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
              Featured
            </div>
          )}

          {/* Favorite Button */}
          <button 
            className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={`Add ${year} ${make} ${model} to favorites`}
          >
            <Heart className="w-4 h-4 text-neutral-600 hover:text-red-500" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4">
          {/* Vehicle Title */}
          <h3 className="font-semibold text-lg text-neutral-900 mb-2">
            <span className="sr-only">Vehicle:</span>
            {year} {make} {model}
          </h3>

          {/* Price */}
          <div className="mb-3">
            <div className="text-2xl font-bold text-primary-600">
              <span className="sr-only">Current price:</span>
              {formatPrice(price)}
            </div>
            {originalPrice && originalPrice > price && (
              <div className="text-sm text-neutral-500 line-through">
                <span className="sr-only">Original price:</span>
                {formatPrice(originalPrice)}
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-2 text-sm text-neutral-600 mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-neutral-500" aria-hidden="true" />
              <span className="sr-only">Mileage:</span>
              {formatMileage(mileage)}
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-neutral-500" aria-hidden="true" />
              <span className="sr-only">Transmission:</span>
              {transmission}
            </div>
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-neutral-500" aria-hidden="true" />
              <span className="sr-only">Fuel type:</span>
              {fuelType}
            </div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-neutral-500" aria-hidden="true" />
              <span className="sr-only">Color:</span>
              {color}
            </div>
          </div>

          {/* Dealer Info */}
          <div className="text-sm text-neutral-500 mb-4">
            <div className="font-medium">{dealer}</div>
            <div>{location}</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleViewDetails}
              aria-label={`View details for ${year} ${make} ${model}`}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              aria-label={`Contact dealer about ${year} ${make} ${model}`}
            >
              Contact Dealer
            </Button>
          </div>
        </div>
      </Card>
    );
  }
);

VehicleCard.displayName = 'VehicleCard';

export { VehicleCard };
