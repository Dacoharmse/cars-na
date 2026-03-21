import React from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MapPin } from 'lucide-react';
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
    originalPrice,
    mileage,
    transmission,
    fuelType,
    color,
    image,
    dealer,
    location,
    isNew,
    featured = false,
    dealerBoost = false,
    className,
    ...props
  }, ref) => {
    const router = useRouter();

    const formatPrice = (p: number) => `N$ ${p.toLocaleString()}`;
    const formatMileage = (m: number) => `${m.toLocaleString()} km`;

    return (
      <div
        ref={ref}
        onClick={() => router.push(`/vehicles/${id}`)}
        className={cn(
          'bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300 group',
          className
        )}
        role="article"
        {...props}
      >
        {/* Image */}
        <div className="relative">
          <img
            src={image}
            alt={`${year} ${make} ${model}`}
            className="w-full h-36 sm:h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />

          {/* Favorite */}
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
            aria-label={`Add ${year} ${make} ${model} to favorites`}
          >
            <Heart className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
          </button>

          {/* Badges */}
          {dealerBoost && (
            <span className="absolute top-2 left-2 bg-[#CB2030] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Top Pick
            </span>
          )}
          {featured && !dealerBoost && (
            <span className="absolute top-2 left-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Featured
            </span>
          )}
          {isNew && (
            <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              New
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Title */}
          <h3 className="font-semibold text-sm sm:text-base text-gray-900 leading-tight mb-1 line-clamp-1">
            {year} {make} {model}
          </h3>

          {/* Specs row */}
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-400 mb-2">
            <span>{formatMileage(mileage)}</span>
            <span className="text-gray-300">·</span>
            <span>{transmission}</span>
            <span className="text-gray-300">·</span>
            <span>{fuelType}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-400 mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#CB2030]">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
);

VehicleCard.displayName = 'VehicleCard';

export { VehicleCard };
