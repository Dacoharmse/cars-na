import { z } from "zod";
import { router, publicProcedure } from "../../trpc";

const createTRPCRouter = router;

// Input schemas
const paginationInput = z.object({
  take: z.number().min(1).max(50).default(12),
  cursor: z.string().optional(),
});

const dateRangeInput = z.object({
  sinceDate: z.date().optional(),
});

// Mock data for development - replace with actual database queries
const mockVehicles = [
  {
    id: "1",
    make: "Toyota",
    model: "Hilux",
    year: 2023,
    price: 520000,
    originalPrice: 580000,
    mileage: 15000,
    transmission: "Manual",
    fuelType: "Diesel",
    color: "White",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&auto=format",
    dealer: "Windhoek Motors",
    location: "Windhoek",
    isNew: false,
    viewsLast30Days: 1250,
    createdAt: new Date("2024-01-20"),
    popularityScore: 95,
    isDealerPick: true,
    isFeatured: true,
    discountPercentage: 10,
  },
  {
    id: "2",
    make: "Ford",
    model: "Ranger",
    year: 2024,
    price: 650000,
    mileage: 5000,
    transmission: "Automatic",
    fuelType: "Diesel",
    color: "Blue",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop&auto=format",
    dealer: "Swakopmund Auto",
    location: "Swakopmund",
    isNew: true,
    viewsLast30Days: 980,
    createdAt: new Date("2024-01-21"),
    popularityScore: 88,
    isDealerPick: true,
    isFeatured: false,
    discountPercentage: 0,
  },
  {
    id: "3",
    make: "BMW",
    model: "X3",
    year: 2023,
    price: 850000,
    originalPrice: 920000,
    mileage: 12000,
    transmission: "Automatic",
    fuelType: "Petrol",
    color: "Black",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop&auto=format",
    dealer: "Premium Motors",
    location: "Windhoek",
    isNew: false,
    viewsLast30Days: 750,
    createdAt: new Date("2024-01-19"),
    popularityScore: 82,
    isDealerPick: false,
    isFeatured: true,
    discountPercentage: 8,
  },
  {
    id: "4",
    make: "Mercedes-Benz",
    model: "C-Class",
    year: 2024,
    price: 780000,
    mileage: 2000,
    transmission: "Automatic",
    fuelType: "Petrol",
    color: "Silver",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop&auto=format",
    dealer: "Luxury Cars Namibia",
    location: "Windhoek",
    isNew: true,
    viewsLast30Days: 650,
    createdAt: new Date("2024-01-22"),
    popularityScore: 79,
    isDealerPick: false,
    isFeatured: true,
    discountPercentage: 0,
  },
  {
    id: "5",
    make: "Volkswagen",
    model: "Polo",
    year: 2023,
    price: 320000,
    originalPrice: 350000,
    mileage: 8000,
    transmission: "Manual",
    fuelType: "Petrol",
    color: "Red",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop&auto=format",
    dealer: "City Motors",
    location: "Windhoek",
    isNew: false,
    viewsLast30Days: 420,
    createdAt: new Date("2024-01-23"),
    popularityScore: 72,
    isDealerPick: false,
    isFeatured: false,
    discountPercentage: 9,
  },
  {
    id: "6",
    make: "Nissan",
    model: "Navara",
    year: 2024,
    price: 580000,
    mileage: 1000,
    transmission: "Automatic",
    fuelType: "Diesel",
    color: "Gray",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop&auto=format",
    dealer: "Coastal Motors",
    location: "Swakopmund",
    isNew: true,
    viewsLast30Days: 380,
    createdAt: new Date("2024-01-24"),
    popularityScore: 68,
    isDealerPick: true,
    isFeatured: false,
    discountPercentage: 0,
  },
];

export const showcaseRouter = createTRPCRouter({
  getTopDealerPicks: publicProcedure
    .input(paginationInput)
    .query(({ input }: { input: z.infer<typeof paginationInput> }) => {
      // In production: query database for vehicles where isDealerPick = true
      // ORDER BY dealerPaidTier DESC, createdAt DESC
      const filtered = mockVehicles
        .filter(v => v.isDealerPick)
        .slice(0, input.take);
      
      return {
        vehicles: filtered,
        nextCursor: filtered.length === input.take ? filtered[filtered.length - 1]?.id : null,
      };
    }),

  getFeaturedVehicles: publicProcedure
    .input(paginationInput)
    .query(({ input }: { input: z.infer<typeof paginationInput> }) => {
      // In production: query database for vehicles where isFeatured = true
      // ORDER BY featuredPaidTier DESC, createdAt DESC
      const filtered = mockVehicles
        .filter(v => v.isFeatured)
        .slice(0, input.take);
      
      return {
        vehicles: filtered,
        nextCursor: filtered.length === input.take ? filtered[filtered.length - 1]?.id : null,
      };
    }),

  getTopDeals: publicProcedure
    .input(paginationInput)
    .query(({ input }: { input: z.infer<typeof paginationInput> }) => {
      // In production: query database for vehicles with originalPrice > price
      // ORDER BY ((originalPrice - price) / originalPrice) DESC
      const filtered = mockVehicles
        .filter(v => v.originalPrice && v.originalPrice > v.price)
        .sort((a, b) => {
          const aDiscount = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) : 0;
          const bDiscount = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) : 0;
          return bDiscount - aDiscount;
        })
        .slice(0, input.take);
      
      return {
        vehicles: filtered,
        nextCursor: filtered.length === input.take ? filtered[filtered.length - 1]?.id : null,
      };
    }),

  getMostViewed: publicProcedure
    .input(paginationInput)
    .query(({ input }: { input: z.infer<typeof paginationInput> }) => {
      // In production: query database ORDER BY viewsLast30Days DESC
      const filtered = mockVehicles
        .sort((a, b) => (b.viewsLast30Days || 0) - (a.viewsLast30Days || 0))
        .slice(0, input.take);
      
      return {
        vehicles: filtered,
        nextCursor: filtered.length === input.take ? filtered[filtered.length - 1]?.id : null,
      };
    }),

  getNewListings: publicProcedure
    .input(paginationInput.merge(dateRangeInput))
    .query(({ input }: { input: z.infer<typeof paginationInput> & z.infer<typeof dateRangeInput> }) => {
      // In production: query database WHERE createdAt >= sinceDate ORDER BY createdAt DESC
      const sinceDate = input.sinceDate || new Date(Date.now() - 72 * 60 * 60 * 1000); // 72 hours ago
      
      const filtered = mockVehicles
        .filter(v => v.createdAt >= sinceDate)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, input.take);
      
      return {
        vehicles: filtered,
        nextCursor: filtered.length === input.take ? filtered[filtered.length - 1]?.id : null,
      };
    }),

  getTopNewCars: publicProcedure
    .input(paginationInput)
    .query(({ input }: { input: z.infer<typeof paginationInput> }) => {
      // In production: query database WHERE isNew = true ORDER BY popularityScore DESC
      const filtered = mockVehicles
        .filter(v => v.isNew)
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, input.take);
      
      return {
        vehicles: filtered,
        nextCursor: filtered.length === input.take ? filtered[filtered.length - 1]?.id : null,
      };
    }),

  getTopUsedCars: publicProcedure
    .input(paginationInput)
    .query(({ input }: { input: z.infer<typeof paginationInput> }) => {
      // In production: query database WHERE isNew = false ORDER BY popularityScore DESC
      const filtered = mockVehicles
        .filter(v => !v.isNew)
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, input.take);
      
      return {
        vehicles: filtered,
        nextCursor: filtered.length === input.take ? filtered[filtered.length - 1]?.id : null,
      };
    }),
});
