/**
 * Vehicle router for Cars.na
 */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure, dealerProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import type { inferAsyncReturnType } from "@trpc/server";
import { createTRPCContext } from "../trpc";

type Context = inferAsyncReturnType<typeof createTRPCContext>;

// Input schema for getAll vehicles query
const getAllVehiclesInput = z.object({
  limit: z.number().min(1).max(100).default(10),
  cursor: z.string().nullish(),
  filters: z
    .object({
      make: z.string().optional(),
      model: z.string().optional(),
      minYear: z.number().optional(),
      maxYear: z.number().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      minMileage: z.number().optional(),
      maxMileage: z.number().optional(),
      dealershipId: z.string().optional(),
    })
    .optional(),
});

// Input schema for creating a vehicle
const createVehicleInput = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive(),
  mileage: z.number().int().min(0),
  color: z.string().optional(),
  vin: z.string().optional(),
  description: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  isPrivate: z.boolean().default(false),
  status: z.enum(["AVAILABLE", "SOLD", "PENDING", "RESERVED"]).default("AVAILABLE"),
  images: z
    .array(
      z.object({
        url: z.string(),
        isPrimary: z.boolean().default(false),
      })
    )
    .optional(),
});

// Input schema for updating a vehicle
const updateVehicleInput = z.object({
  id: z.string(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  price: z.number().positive().optional(),
  mileage: z.number().int().min(0).optional(),
  color: z.string().optional(),
  vin: z.string().optional(),
  description: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  bodyType: z.string().optional(),
  isPrivate: z.boolean().optional(),
  status: z.enum(["AVAILABLE", "SOLD", "PENDING", "RESERVED"]).optional(),
});

// Input schema for private vehicle submission
const submitPrivateVehicleInput = z.object({
  make: z.string(),
  model: z.string(),
  year: z.number().int().min(1900).max(new Date().getFullYear()),
  mileage: z.number().int().min(0),
  color: z.string().optional(),
  vin: z.string().optional(),
  description: z.string().optional(),
  sellerName: z.string(),
  sellerEmail: z.string().email(),
  sellerPhone: z.string(),
  dealershipId: z.string(),
  images: z.array(z.string()).optional(),
});

// Input schema for showcase pagination
const showcasePaginationInput = z.object({
  limit: z.number().min(1).max(20).default(4), // Default to 4 items per showcase
  cursor: z.string().nullish(),
});

export const vehicleRouter = router({
  // SHOWCASE ENDPOINTS
  
  // Get top dealer picks (premium vehicles selected by dealers)
  getTopDealerPicks: publicProcedure
    .input(showcasePaginationInput)
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      const items = await ctx.prisma.vehicle.findMany({
        take: limit + 1,
        where: {
          isPrivate: false,
          status: "AVAILABLE",
          dealerPick: true, // Assuming we have this field in the schema
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          { dealerPick: "desc" },
          { createdAt: "desc" }
        ],
        include: {
          dealership: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get featured vehicles
  getFeaturedVehicles: publicProcedure
    .input(showcasePaginationInput)
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      const items = await ctx.prisma.vehicle.findMany({
        take: limit + 1,
        where: {
          isPrivate: false,
          status: "AVAILABLE",
          featured: true, // Assuming we have this field in the schema
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          { featured: "desc" },
          { createdAt: "desc" }
        ],
        include: {
          dealership: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get top deals (vehicles with discounts)
  getTopDeals: publicProcedure
    .input(showcasePaginationInput)
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      const items = await ctx.prisma.vehicle.findMany({
        take: limit + 1,
        where: {
          isPrivate: false,
          status: "AVAILABLE",
          originalPrice: { not: null }, // Vehicles with original price set (indicating a discount)
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          // Order by discount percentage (original - current) / original
          { originalPrice: "desc" }, // Higher original price first
          { price: "asc" }, // Lower current price first (for similar original prices)
          { createdAt: "desc" }
        ],
        include: {
          dealership: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get most viewed vehicles
  getMostViewed: publicProcedure
    .input(showcasePaginationInput)
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      const items = await ctx.prisma.vehicle.findMany({
        take: limit + 1,
        where: {
          isPrivate: false,
          status: "AVAILABLE",
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          { viewCount: "desc" }, // Assuming we have this field in the schema
          { createdAt: "desc" }
        ],
        include: {
          dealership: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get new listings (recently added vehicles)
  getNewListings: publicProcedure
    .input(showcasePaginationInput)
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      // Get vehicles added in the last 72 hours
      const threeDaysAgo = new Date();
      threeDaysAgo.setHours(threeDaysAgo.getHours() - 72);
      
      const items = await ctx.prisma.vehicle.findMany({
        take: limit + 1,
        where: {
          isPrivate: false,
          status: "AVAILABLE",
          createdAt: { gte: threeDaysAgo }
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc" // Newest first
        },
        include: {
          dealership: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get top new cars (brand new vehicles)
  getTopNewCars: publicProcedure
    .input(showcasePaginationInput)
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      const items = await ctx.prisma.vehicle.findMany({
        take: limit + 1,
        where: {
          isPrivate: false,
          status: "AVAILABLE",
          isNew: true, // Assuming we have this field in the schema
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          { viewCount: "desc" }, // Most viewed first
          { createdAt: "desc" } // Then by newest
        ],
        include: {
          dealership: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get top used cars (pre-owned vehicles)
  getTopUsedCars: publicProcedure
    .input(showcasePaginationInput)
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      
      const items = await ctx.prisma.vehicle.findMany({
        take: limit + 1,
        where: {
          isPrivate: false,
          status: "AVAILABLE",
          isNew: false, // Assuming we have this field in the schema
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          { viewCount: "desc" }, // Most viewed first
          { createdAt: "desc" } // Then by newest
        ],
        include: {
          dealership: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get all public vehicles (public)
  // Get all public vehicles (public)
  getAll: publicProcedure
    .input(getAllVehiclesInput)
    .query(async ({ ctx, input }: { ctx: Context; input: z.infer<typeof getAllVehiclesInput> }) => {
      const { limit, cursor, filters } = input;

      const items = await ctx.prisma.vehicle.findMany({
        take: limit + 1,
        where: {
          isPrivate: false,
          ...(filters?.make && { make: filters.make }),
          ...(filters?.model && { model: filters.model }),
          ...(filters?.minYear && { year: { gte: filters.minYear } }),
          ...(filters?.maxYear && { year: { lte: filters.maxYear } }),
          ...(filters?.minPrice && { price: { gte: filters.minPrice } }),
          ...(filters?.maxPrice && { price: { lte: filters.maxPrice } }),
          ...(filters?.minMileage && { mileage: { gte: filters.minMileage } }),
          ...(filters?.maxMileage && { mileage: { lte: filters.maxMileage } }),
          ...(filters?.dealershipId && { dealershipId: filters.dealershipId }),
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          dealership: true,
          images: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
        },
      });

      let nextCursor: typeof cursor = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get vehicles by dealership (dealer only)
  getByDealership: dealerProcedure
    .input(
      z.object({
        dealershipId: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
        status: z.enum(["AVAILABLE", "SOLD", "PENDING", "RESERVED"]).optional(),
      })
    )
    .query(async ({ ctx, input }: { ctx: Context; input: any }) => {
      // Get user's dealership ID if not provided
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      const dealershipId = input.dealershipId || user?.dealershipId;

      if (!dealershipId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Dealership ID is required",
        });
      }

      const items = await ctx.prisma.vehicle.findMany({
        take: input.limit + 1,
        where: {
          dealershipId,
          ...(input.status && { status: input.status }),
        },
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          dealership: true,
          images: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
        },
      });

      let nextCursor: typeof input.cursor = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  // Get vehicle by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }: { ctx: Context; input: { id: string } }) => {
      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: { id: input.id },
        include: {
          dealership: true,
          images: true,
        },
      });

      if (!vehicle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehicle not found",
        });
      }

      // If vehicle is private, only allow access to dealer staff or admin
      if (vehicle.isPrivate) {
        if (!ctx.session?.user) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to view this vehicle",
          });
        }

        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.session.user.id },
        });

        if (
          !user ||
          (user.role !== "ADMIN" &&
            user.dealershipId !== vehicle.dealershipId)
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You don't have permission to view this vehicle",
          });
        }
      }

      return vehicle;
    }),

  // Create vehicle (dealer only)
  create: dealerProcedure
    .input(createVehicleInput)
    .mutation(async ({ ctx, input }: { ctx: Context; input: z.infer<typeof createVehicleInput> }) => {
      // Get the user's dealership
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { dealershipId: true },
      });

      if (!user?.dealershipId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You must be associated with a dealership to create vehicles",
        });
      }

      // Create the vehicle
      return await ctx.prisma.vehicle.create({
        data: {
          make: input.make,
          model: input.model,
          year: input.year,
          price: input.price,
          mileage: input.mileage,
          color: input.color,
          vin: input.vin,
          description: input.description,
          transmission: input.transmission,
          fuelType: input.fuelType,
          bodyType: input.bodyType,
          isPrivate: input.isPrivate,
          status: input.status,
          dealership: {
            connect: { id: user.dealershipId },
          },
          images: input.images
            ? {
                create: input.images.map((image: { url: string; isPrimary: boolean }) => ({
                  url: image.url,
                  isPrimary: image.isPrimary,
                })),
              }
            : undefined,
        },
        include: {
          images: true,
        },
      });
    }),

  // Update vehicle (dealer only)
  update: dealerProcedure
    .input(updateVehicleInput)
    .mutation(async ({ ctx, input }: { ctx: Context; input: z.infer<typeof updateVehicleInput> }) => {
      // Check if vehicle exists
      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: { id: input.id },
      });

      if (!vehicle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehicle not found",
        });
      }

      // Check if user belongs to the dealership that owns this vehicle
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user || user.dealershipId !== vehicle.dealershipId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update vehicles from your own dealership",
        });
      }

      // Update the vehicle
      return await ctx.prisma.vehicle.update({
        where: { id: input.id },
        data: {
          make: input.make,
          model: input.model,
          year: input.year,
          price: input.price,
          mileage: input.mileage,
          color: input.color,
          vin: input.vin,
          description: input.description,
          transmission: input.transmission,
          fuelType: input.fuelType,
          bodyType: input.bodyType,
          isPrivate: input.isPrivate,
          status: input.status,
        },
      });
    }),

  // Delete vehicle (dealer only)
  delete: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }: { ctx: Context; input: { id: string } }) => {
      // Check if vehicle exists
      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: { id: input.id },
      });

      if (!vehicle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehicle not found",
        });
      }

      // Check if user belongs to the dealership that owns this vehicle
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user || user.dealershipId !== vehicle.dealershipId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete vehicles from your own dealership",
        });
      }

      // Delete the vehicle
      return await ctx.prisma.vehicle.delete({
        where: { id: input.id },
      });
    }),

  // Add vehicle image (dealer only)
  addImage: dealerProcedure
    .input(
      z.object({
        vehicleId: z.string(),
        url: z.string(),
        isPrimary: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: Context; input: { vehicleId: string; url: string; isPrimary: boolean } }) => {
      // Check if vehicle exists and belongs to user's dealership
      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: { id: input.vehicleId },
      });

      if (!vehicle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehicle not found",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user || user.dealershipId !== vehicle.dealershipId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only add images to vehicles from your own dealership",
        });
      }

      // If this is a primary image, update all other images to not be primary
      if (input.isPrimary) {
        await ctx.prisma.vehicleImage.updateMany({
          where: { vehicleId: input.vehicleId },
          data: { isPrimary: false },
        });
      }

      // Add the new image
      return await ctx.prisma.vehicleImage.create({
        data: {
          url: input.url,
          isPrimary: input.isPrimary,
          vehicle: {
            connect: { id: input.vehicleId },
          },
        },
      });
    }),

  // Delete vehicle image (dealer only)
  deleteImage: dealerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }: { ctx: Context; input: { id: string } }) => {
      // Check if image exists
      const image = await ctx.prisma.vehicleImage.findUnique({
        where: { id: input.id },
        include: { vehicle: true },
      });

      if (!image) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Image not found",
        });
      }

      // Check if user belongs to the dealership that owns this vehicle
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user || user.dealershipId !== image.vehicle.dealershipId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete images from your own dealership's vehicles",
        });
      }

      // Delete the image
      return await ctx.prisma.vehicleImage.delete({
        where: { id: input.id },
      });
    }),

  // Submit private vehicle (public)
  submitPrivate: publicProcedure
    .input(submitPrivateVehicleInput)
    .mutation(async ({ ctx, input }: { ctx: Context; input: z.infer<typeof submitPrivateVehicleInput> }) => {
      // Check if dealership exists
      const dealership = await ctx.prisma.dealership.findUnique({
        where: { id: input.dealershipId },
      });

      if (!dealership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dealership not found",
        });
      }

      // Create the private vehicle submission
      const vehicle = await ctx.prisma.vehicle.create({
        data: {
          make: input.make,
          model: input.model,
          year: input.year,
          price: 0, // Price will be determined by dealership
          mileage: input.mileage,
          color: input.color,
          vin: input.vin,
          description: `Seller: ${input.sellerName} (${input.sellerEmail}, ${input.sellerPhone})\n\n${input.description || ""}`,
          isPrivate: true,
          status: "PENDING",
          dealership: {
            connect: { id: input.dealershipId },
          },
          images: input.images
            ? {
                create: input.images.map((url: string, index: number) => ({
                  url,
                  isPrimary: index === 0, // First image is primary
                })),
              }
            : undefined,
        },
      });

      return { success: true, vehicleId: vehicle.id };
    }),
});
