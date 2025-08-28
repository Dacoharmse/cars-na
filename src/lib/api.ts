/**
 * Simplified API client for Cars.na (Development Mode)
 * This is a mock implementation to avoid tRPC setup issues during development
 */

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
  image: vehicle.images?.find(img => img.isPrimary)?.url || vehicle.images?.[0]?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Q2FyIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
  dealer: vehicle.dealership?.name || 'Unknown Dealer',
  location: vehicle.dealership?.city || 'Namibia',
  isNew: vehicle.isNew,
  viewsLast30Days: vehicle.viewCount,
  createdAt: vehicle.createdAt?.toISOString(),
  popularityRank: vehicle.viewCount
});

// Mock API client that returns comprehensive demo data
export const api = {
  vehicle: {
    getAll: {
      useQuery: (params: any, options?: any) => {
        const { limit = 20, filters } = params || {};
        
        // Apply filters if provided
        const filteredVehicles = filters ? filterVehicles({
          make: filters.make,
          model: filters.model,
          minYear: filters.minYear,
          maxYear: filters.maxYear,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minMileage: filters.minMileage,
          maxMileage: filters.maxMileage,
          dealershipId: filters.dealershipId,
          search: filters.search,
          location: filters.location,
          featured: filters.featured,
          dealerPick: filters.dealerPick,
          hasDiscount: filters.hasDiscount,
          isNew: filters.isNew,
          sortBy: filters.sortBy,
        }) : mockVehicles;

        // Limit results (filtering function already handles sorting)
        const limitedVehicles = filteredVehicles.slice(0, limit);

        return {
          data: { 
            items: limitedVehicles, 
            nextCursor: limitedVehicles.length === limit ? limitedVehicles[limitedVehicles.length - 1]?.id : undefined,
            total: filteredVehicles.length 
          },
          isLoading: false,
          error: null,
          refetch: () => Promise.resolve()
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
