/**
 * Simplified API client for Cars.na (Development Mode)
 * This is a mock implementation to avoid tRPC setup issues during development
 */

import { 
  getVehiclesWithDealership, 
  filterVehicles, 
  getVehicleById as getMockVehicleById,
  getVehiclesByDealership
} from './mockData';

// Use our comprehensive mock data
const mockVehicles = getVehiclesWithDealership();

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
        }) : mockVehicles;

        // Sort by newest first
        const sortedVehicles = filteredVehicles.sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );

        // Limit results
        const limitedVehicles = sortedVehicles.slice(0, limit);

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
      useQuery: (params: any, options?: any) => ({
        data: { vehicles: [], nextCursor: null },
        isLoading: false,
        error: null
      })
    },
    getTopDealerPicks: {
      useQuery: (params: any, options?: any) => ({
        data: { vehicles: [], nextCursor: null },
        isLoading: false,
        error: null
      })
    },
    getFeaturedVehicles: {
      useQuery: (params: any, options?: any) => ({
        data: { vehicles: [], nextCursor: null },
        isLoading: false,
        error: null
      })
    },
    getTopDeals: {
      useQuery: (params: any, options?: any) => ({
        data: { vehicles: [], nextCursor: null },
        isLoading: false,
        error: null
      })
    },
    getMostViewed: {
      useQuery: (params: any, options?: any) => ({
        data: { vehicles: [], nextCursor: null },
        isLoading: false,
        error: null
      })
    },
    getNewListings: {
      useQuery: (params: any, options?: any) => ({
        data: { vehicles: [], nextCursor: null },
        isLoading: false,
        error: null
      })
    },
    getTopNewCars: {
      useQuery: (params: any, options?: any) => ({
        data: { vehicles: [], nextCursor: null },
        isLoading: false,
        error: null
      })
    },
    getTopUsedCars: {
      useQuery: (params: any, options?: any) => ({
        data: { vehicles: [], nextCursor: null },
        isLoading: false,
        error: null
      })
    }
  },
  Provider: ({ children }: { children: React.ReactNode }) => children
};

// Mock types for development
export type RouterInputs = any;
export type RouterOutputs = any;
