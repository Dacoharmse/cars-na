import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatPrice } from '@/lib/utils';
import { Heart, Calendar, Gauge, Settings, Fuel, MapPin } from 'lucide-react';

interface VehicleCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  imageUrl: string;
  exteriorColor?: string;
  transmission?: string;
  fuelType?: string;
  status?: string;
  dealership?: {
    name: string;
    city?: string;
  };
  onSaveClick?: (id: string) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  id,
  make,
  model,
  year,
  price,
  mileage,
  imageUrl,
  exteriorColor,
  transmission,
  fuelType,
  status,
  dealership,
  onSaveClick,
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onSaveClick) {
      onSaveClick(id);
    }
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-NA').format(mileage);
  };

  const formatVehiclePrice = (price: number) => {
    return new Intl.NumberFormat('en-NA', {
      style: 'currency',
      currency: 'NAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/vehicles/${id}`} className="block group">
      <Card className="h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        {/* Image */}
        <div className="relative h-48 bg-gray-100">
          <Image
            src={imageUrl}
            alt={`${year} ${make} ${model}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Save Button */}
          <button
            onClick={handleSaveClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isSaved 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 hover:bg-white text-gray-700'
            }`}
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Status Badge */}
          {status && status !== 'AVAILABLE' && (
            <div className="absolute top-3 left-3">
              <Badge variant={status === 'SOLD' ? 'destructive' : 'warning'}>
                {status}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title and Price */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-[#1F3469] transition-colors">
              {year} {make} {model}
            </h3>
            <div className="text-2xl font-bold text-[#1F3469] mt-1">
              {formatVehiclePrice(price)}
            </div>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{year}</span>
            </div>
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{formatMileage(mileage)} km</span>
            </div>
            {transmission && (
              <div className="flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span>{transmission}</span>
              </div>
            )}
            {fuelType && (
              <div className="flex items-center gap-1">
                <Fuel className="h-4 w-4" />
                <span>{fuelType}</span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="space-y-1 text-sm text-gray-600">
            {exteriorColor && (
              <div>Color: <span className="font-medium">{exteriorColor}</span></div>
            )}
            {dealership && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{dealership.name}</span>
                {dealership.city && <span>, {dealership.city}</span>}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-[#CB2030] hover:bg-[#CB2030]/90"
            onClick={(e) => e.preventDefault()}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default VehicleCard;

/**
 * Example usage:
 * 
 * <VehicleCard
 *   id="v123"
 *   make="Toyota"
 *   model="Camry"
 *   year={2020}
 *   price={25000}
 *   mileage={15000}
 *   imageUrl="/images/toyota-camry.jpg"
 *   exteriorColor="Silver"
 *   transmission="Automatic"
 *   fuelType="Gasoline"
 *   onSaveClick={(id) => console.log(`Saved vehicle ${id}`)}
 *   onDetailsClick={(id) => console.log(`View details for ${id}`)}
 * />
 */
