import { z } from "zod";
import { router, publicProcedure } from "../../trpc";
import { prisma } from "@/lib/prisma";

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
    .query(async ({ input }: { input: z.infer<typeof paginationInput> }) => {
      // Query database for vehicles where dealerPick = true
      const vehicles = await prisma.vehicle.findMany({
        where: {
          dealerPick: true,
          status: 'AVAILABLE',
        },
        include: {
          dealership: {
            select: {
              name: true,
              city: true,
            },
          },
          images: {
            orderBy: {
              isPrimary: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input.take,
      });

      return {
        vehicles,
        nextCursor: vehicles.length === input.take ? vehicles[vehicles.length - 1]?.id : null,
      };
    }),

  getFeaturedVehicles: publicProcedure
    .input(paginationInput)
    .query(async ({ input }: { input: z.infer<typeof paginationInput> }) => {
      // Query database for vehicles where featured = true
      const vehicles = await prisma.vehicle.findMany({
        where: {
          featured: true,
          status: 'AVAILABLE',
        },
        include: {
          dealership: {
            select: {
              name: true,
              city: true,
            },
          },
          images: {
            orderBy: {
              isPrimary: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input.take,
      });

      return {
        vehicles,
        nextCursor: vehicles.length === input.take ? vehicles[vehicles.length - 1]?.id : null,
      };
    }),

  getTopDeals: publicProcedure
    .input(paginationInput)
    .query(async ({ input }: { input: z.infer<typeof paginationInput> }) => {
      // Query database for vehicles with originalPrice > price (discounted vehicles)
      const vehicles = await prisma.vehicle.findMany({
        where: {
          originalPrice: {
            not: null,
          },
          status: 'AVAILABLE',
        },
        include: {
          dealership: {
            select: {
              name: true,
              city: true,
            },
          },
          images: {
            orderBy: {
              isPrimary: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input.take * 2, // Get more to filter client-side for discount calculation
      });

      // Filter and sort by discount percentage
      const filtered = vehicles
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
    .query(async ({ input }: { input: z.infer<typeof paginationInput> }) => {
      // Query database ORDER BY viewCount DESC
      const vehicles = await prisma.vehicle.findMany({
        where: {
          status: 'AVAILABLE',
        },
        include: {
          dealership: {
            select: {
              name: true,
              city: true,
            },
          },
          images: {
            orderBy: {
              isPrimary: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          viewCount: 'desc',
        },
        take: input.take,
      });

      return {
        vehicles,
        nextCursor: vehicles.length === input.take ? vehicles[vehicles.length - 1]?.id : null,
      };
    }),

  getNewListings: publicProcedure
    .input(paginationInput.merge(dateRangeInput))
    .query(async ({ input }: { input: z.infer<typeof paginationInput> & z.infer<typeof dateRangeInput> }) => {
      // Query database WHERE createdAt >= sinceDate ORDER BY createdAt DESC
      const sinceDate = input.sinceDate || new Date(Date.now() - 72 * 60 * 60 * 1000); // 72 hours ago

      const vehicles = await prisma.vehicle.findMany({
        where: {
          createdAt: {
            gte: sinceDate,
          },
          status: 'AVAILABLE',
        },
        include: {
          dealership: {
            select: {
              name: true,
              city: true,
            },
          },
          images: {
            orderBy: {
              isPrimary: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: input.take,
      });

      return {
        vehicles,
        nextCursor: vehicles.length === input.take ? vehicles[vehicles.length - 1]?.id : null,
      };
    }),

  getTopNewCars: publicProcedure
    .input(paginationInput)
    .query(async ({ input }: { input: z.infer<typeof paginationInput> }) => {
      // Query database WHERE isNew = true ORDER BY viewCount DESC
      const vehicles = await prisma.vehicle.findMany({
        where: {
          isNew: true,
          status: 'AVAILABLE',
        },
        include: {
          dealership: {
            select: {
              name: true,
              city: true,
            },
          },
          images: {
            orderBy: {
              isPrimary: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          viewCount: 'desc',
        },
        take: input.take,
      });

      return {
        vehicles,
        nextCursor: vehicles.length === input.take ? vehicles[vehicles.length - 1]?.id : null,
      };
    }),

  getTopUsedCars: publicProcedure
    .input(paginationInput)
    .query(async ({ input }: { input: z.infer<typeof paginationInput> }) => {
      // Query database WHERE isNew = false ORDER BY viewCount DESC
      const vehicles = await prisma.vehicle.findMany({
        where: {
          isNew: false,
          status: 'AVAILABLE',
        },
        include: {
          dealership: {
            select: {
              name: true,
              city: true,
            },
          },
          images: {
            orderBy: {
              isPrimary: 'desc',
            },
            take: 1,
          },
        },
        orderBy: {
          viewCount: 'desc',
        },
        take: input.take,
      });

      return {
        vehicles,
        nextCursor: vehicles.length === input.take ? vehicles[vehicles.length - 1]?.id : null,
      };
    }),
});
