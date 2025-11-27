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

// Mock data removed for production - all showcase data will come from real database entries
// When dealers add vehicles and mark them as featured/dealer picks, they will appear here
// Updated: All mock vehicles removed
const mockVehicles: any[] = [];
console.log('[SHOWCASE] mockVehicles length:', mockVehicles.length);

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
