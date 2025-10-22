/**
 * Simplified API client for Cars.na (Development Mode)
 * This is a mock implementation to avoid tRPC setup issues during development
 */

import React from 'react';
import {
  getVehiclesWithDealership,
  filterVehicles,
  getVehicleById as getMockVehicleById,
  getVehiclesByDealership,
  getFeaturedVehicles,
  getDealerPickVehicles,
  getMostViewedVehicles,
  getNewListings
} from './mockData';

// Use our comprehensive mock data
const mockVehicles = getVehiclesWithDealership();

// Transform our mock data to the format expected by HomeShowcase
const transformVehicleForShowcase = (vehicle: any) => ({
  id: parseInt(vehicle.id.replace('vehicle-', '')) || 1,
  make: vehicle.make,
  model: vehicle.model,
  year: vehicle.year,
  price: vehicle.price,
  originalPrice: vehicle.originalPrice,
  mileage: vehicle.mileage,
  transmission: vehicle.transmission,
  fuelType: vehicle.fuelType,
  color: vehicle.color,
  image: vehicle.images?.find((img: any) => img.isPrimary)?.url || vehicle.images?.[0]?.url || 'https://placehold.co/800x600/e5e7eb/6b7280?text=Car+Image',
  dealer: vehicle.dealership?.name || 'Unknown Dealer',
  location: vehicle.dealership?.city || 'Namibia',
  isNew: vehicle.isNew,
  viewsLast30Days: vehicle.viewCount,
  createdAt: vehicle.createdAt?.toISOString(),
  popularityRank: vehicle.viewCount
});

// Mock API client that fetches from real database via API routes
export const api = {
  vehicle: {
    getAll: {
      useQuery: (params: any, options?: any) => {
        const [data, setData] = React.useState<any>(null);
        const [isLoading, setIsLoading] = React.useState(true);
        const [error, setError] = React.useState<Error | null>(null);

        const fetchVehicles = React.useCallback(async () => {
          try {
            setIsLoading(true);
            const { limit = 20, filters = {} } = params || {};

            // Build query string
            const queryParams = new URLSearchParams();
            queryParams.set('limit', limit.toString());

            if (filters.make) queryParams.set('make', filters.make);
            if (filters.minPrice) queryParams.set('minPrice', filters.minPrice.toString());
            if (filters.maxPrice) queryParams.set('maxPrice', filters.maxPrice.toString());
            if (filters.minYear) queryParams.set('minYear', filters.minYear.toString());
            if (filters.maxYear) queryParams.set('maxYear', filters.maxYear.toString());
            if (filters.maxMileage) queryParams.set('maxMileage', filters.maxMileage.toString());
            if (filters.dealershipId) queryParams.set('dealershipId', filters.dealershipId);
            if (filters.search) queryParams.set('search', filters.search);
            if (filters.location) queryParams.set('location', filters.location);
            if (filters.featured) queryParams.set('featured', 'true');
            if (filters.dealerPick) queryParams.set('dealerPick', 'true');
            if (filters.hasDiscount) queryParams.set('hasDiscount', 'true');
            if (filters.isNew !== undefined) queryParams.set('isNew', filters.isNew.toString());
            if (filters.sortBy) queryParams.set('sortBy', filters.sortBy);

            const response = await fetch(`/api/vehicles?${queryParams.toString()}`);

            if (!response.ok) {
              throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
            }

            const result = await response.json();
            setData(result);
            setError(null);
          } catch (err) {
            console.error('Error fetching vehicles:', err);
            setError(err instanceof Error ? err : new Error('Unknown error'));
            setData(null);
          } finally {
            setIsLoading(false);
          }
        }, [JSON.stringify(params)]);

        React.useEffect(() => {
          fetchVehicles();
        }, [fetchVehicles]);

        return {
          data,
          isLoading,
          error,
          refetch: fetchVehicles
        };
      }
    },
    getById: {
      useQuery: (params: any, options?: any) => ({
        data: getMockVehicleById(params.id) || null,
        isLoading: false,
        error: null
      })
    },
    getByDealership: {
      useQuery: (params: any, options?: any) => {
        const { dealershipId } = params || {};
        const dealerVehicles = dealershipId ? getVehiclesByDealership(dealershipId) : mockVehicles;
        
        return {
          data: { items: dealerVehicles },
          isLoading: false,
          error: null
        };
      }
    },
    create: {
      useMutation: (options?: any) => ({
        mutate: (data: any) => {
          console.log('Mock vehicle creation:', data);
          if (options?.onSuccess) {
            setTimeout(() => options.onSuccess(data), 100);
          }
        },
        isLoading: false
      })
    }
  },
  lead: {
    create: {
      useMutation: (options?: any) => ({
        mutate: (data: any) => {
          console.log('Mock lead creation:', data);
          if (options?.onSuccess) {
            setTimeout(() => options.onSuccess(data), 100);
          }
        },
        isLoading: false
      })
    },
    getByDealership: {
      useQuery: (params: any, options?: any) => ({
        data: { leads: [] },
        isLoading: false,
        error: null
      })
    },
    getStats: {
      useQuery: (params: any, options?: any) => ({
        data: { total: 0, new: 0 },
        isLoading: false,
        error: null
      })
    }
  },
  showcase: {
    getFeatured: {
      useQuery: (params: any, options?: any) => {
        const { limit = 4 } = params || {};
        const vehicles = getFeaturedVehicles(limit).map(transformVehicleForShowcase);
        return {
          data: { vehicles, nextCursor: null },
          isLoading: false,
          error: null
        };
      }
    },
    getTopDealerPicks: {
      useQuery: (params: any, options?: any) => {
        const { limit = 4 } = params || {};
        const vehicles = getDealerPickVehicles(limit).map(transformVehicleForShowcase);
        return {
          data: { vehicles, nextCursor: null },
          isLoading: false,
          error: null
        };
      }
    },
    getFeaturedVehicles: {
      useQuery: (params: any, options?: any) => {
        const { limit = 4 } = params || {};
        const vehicles = getFeaturedVehicles(limit).map(transformVehicleForShowcase);
        return {
          data: { vehicles, nextCursor: null },
          isLoading: false,
          error: null
        };
      }
    },
    getTopDeals: {
      useQuery: (params: any, options?: any) => {
        const { limit = 4 } = params || {};
        // Get vehicles with original prices for deals
        const dealsVehicles = getVehiclesWithDealership()
          .filter(v => v.originalPrice && v.originalPrice > v.price)
          .sort((a, b) => {
            const aDiscount = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) : 0;
            const bDiscount = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) : 0;
            return bDiscount - aDiscount;
          })
          .slice(0, limit)
          .map(transformVehicleForShowcase);
        
        return {
          data: { vehicles: dealsVehicles, nextCursor: null },
          isLoading: false,
          error: null
        };
      }
    },
    getMostViewed: {
      useQuery: (params: any, options?: any) => {
        const { limit = 4 } = params || {};
        const vehicles = getMostViewedVehicles(limit).map(transformVehicleForShowcase);
        return {
          data: { vehicles, nextCursor: null },
          isLoading: false,
          error: null
        };
      }
    },
    getNewListings: {
      useQuery: (params: any, options?: any) => {
        const { limit = 4 } = params || {};
        const vehicles = getNewListings(limit).map(transformVehicleForShowcase);
        return {
          data: { vehicles, nextCursor: null },
          isLoading: false,
          error: null
        };
      }
    },
    getTopNewCars: {
      useQuery: (params: any, options?: any) => {
        const { limit = 4 } = params || {};
        const vehicles = getVehiclesWithDealership()
          .filter(v => v.isNew)
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, limit)
          .map(transformVehicleForShowcase);
          
        return {
          data: { vehicles, nextCursor: null },
          isLoading: false,
          error: null
        };
      }
    },
    getTopUsedCars: {
      useQuery: (params: any, options?: any) => {
        const { limit = 4 } = params || {};
        const vehicles = getVehiclesWithDealership()
          .filter(v => !v.isNew)
          .sort((a, b) => b.viewCount - a.viewCount)
          .slice(0, limit)
          .map(transformVehicleForShowcase);
          
        return {
          data: { vehicles, nextCursor: null },
          isLoading: false,
          error: null
        };
      }
    }
  },
  Provider: ({ children }: { children: React.ReactNode }) => children
};

// Mock types for development
export type RouterInputs = any;
export type RouterOutputs = any;
