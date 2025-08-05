/**
 * Simplified API client for Cars.na (Development Mode)
 * This is a mock implementation to avoid tRPC setup issues during development
 */

// Mock API client that returns empty data to prevent errors
export const api = {
  vehicle: {
    getById: {
      useQuery: (params: any, options?: any) => ({
        data: null,
        isLoading: false,
        error: null
      })
    },
    getByDealership: {
      useQuery: (params: any, options?: any) => ({
        data: { items: [] },
        isLoading: false,
        error: null
      })
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
