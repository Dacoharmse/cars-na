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

// Helper to create async showcase query hook
const createShowcaseQuery = (type: string) => {
  return (params: any, options?: any) => {
    const [data, setData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<Error | null>(null);

    React.useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/showcase?type=${type}&take=${params?.take || 4}`);
          const result = await response.json();

          if (result.success) {
            setData({ vehicles: result.vehicles });
          } else {
            // Fallback to mock data if API fails
            setData({ vehicles: [] });
          }
          setError(null);
        } catch (err) {
          console.error(`Error fetching ${type}:`, err);
          // Fallback to mock data on error
          setData({ vehicles: [] });
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, [params?.take]);

    return { data, isLoading, error };
  };
};

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
      useQuery: (params: any, options?: any) => {
        const [data, setData] = React.useState<any>(null);
        const [isLoading, setIsLoading] = React.useState(true);
        const [error, setError] = React.useState<Error | null>(null);

        React.useEffect(() => {
          const fetchLeads = async () => {
            try {
              setIsLoading(true);
              const queryParams = new URLSearchParams();
              if (params?.limit) queryParams.set('limit', params.limit.toString());
              if (params?.status) queryParams.set('status', params.status);

              const response = await fetch(`/api/dealer/leads?${queryParams.toString()}`);

              if (!response.ok) {
                throw new Error(`Failed to fetch leads: ${response.statusText}`);
              }

              const result = await response.json();
              setData({ leads: result.leads || [] });
              setError(null);
            } catch (err) {
              console.error('Error fetching leads:', err);
              setError(err as Error);
              setData({ leads: [] });
            } finally {
              setIsLoading(false);
            }
          };

          fetchLeads();
        }, [JSON.stringify(params)]);

        return { data, isLoading, error };
      }
    },
    getStats: {
      useQuery: (params: any, options?: any) => {
        const [data, setData] = React.useState<any>(null);
        const [isLoading, setIsLoading] = React.useState(true);
        const [error, setError] = React.useState<Error | null>(null);

        React.useEffect(() => {
          const fetchStats = async () => {
            try {
              setIsLoading(true);
              const response = await fetch('/api/dealer/leads?limit=1');

              if (!response.ok) {
                throw new Error(`Failed to fetch lead stats: ${response.statusText}`);
              }

              const result = await response.json();
              setData(result.stats || { total: 0, new: 0, contacted: 0, converted: 0, conversionRate: 0 });
              setError(null);
            } catch (err) {
              console.error('Error fetching lead stats:', err);
              setError(err as Error);
              setData({ total: 0, new: 0, contacted: 0, converted: 0, conversionRate: 0 });
            } finally {
              setIsLoading(false);
            }
          };

          fetchStats();
        }, [JSON.stringify(params)]);

        return { data, isLoading, error };
      }
    },
    updateStatus: {
      useMutation: (options?: any) => {
        const [isLoading, setIsLoading] = React.useState(false);

        return {
          mutate: async (data: any) => {
            try {
              setIsLoading(true);
              const response = await fetch('/api/dealer/leads', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });

              if (!response.ok) {
                throw new Error(`Failed to update lead: ${response.statusText}`);
              }

              const result = await response.json();

              if (options?.onSuccess) {
                options.onSuccess(result.lead);
              }
            } catch (err) {
              console.error('Error updating lead status:', err);
              if (options?.onError) {
                options.onError(err);
              }
            } finally {
              setIsLoading(false);
            }
          },
          isLoading
        };
      }
    }
  },
  showcase: {
    getFeatured: {
      useQuery: createShowcaseQuery('featured')
    },
    getTopDealerPicks: {
      useQuery: createShowcaseQuery('dealerPicks')
    },
    getFeaturedVehicles: {
      useQuery: createShowcaseQuery('featured')
    },
    getTopDeals: {
      useQuery: createShowcaseQuery('topDeals')
    },
    getMostViewed: {
      useQuery: createShowcaseQuery('mostViewed')
    },
    getNewListings: {
      useQuery: createShowcaseQuery('newListings')
    },
    getTopNewCars: {
      useQuery: createShowcaseQuery('topNewCars')
    },
    getTopUsedCars: {
      useQuery: createShowcaseQuery('topUsedCars')
    }
  },
  Provider: ({ children }: { children: React.ReactNode }) => children
};

// Mock types for development
export type RouterInputs = any;
export type RouterOutputs = any;
