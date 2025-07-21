/**
 * Dealership router for Cars.na
 */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure, dealerProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const dealershipRouter = router({
  // Get all dealerships (public)
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.dealership.findMany();
  }),

  // Get dealership by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const dealership = await ctx.prisma.dealership.findUnique({
        where: { id: input.id },
        include: {
          vehicles: {
            where: { isPrivate: false },
            include: {
              images: true,
            },
          },
        },
      });

      if (!dealership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dealership not found",
        });
      }

      return dealership;
    }),

  // Create dealership (admin only)
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional(),
        logo: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.dealership.create({
        data: {
          name: input.name,
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          phone: input.phone,
          email: input.email,
          website: input.website,
          logo: input.logo,
          description: input.description,
        },
      });
    }),

  // Update dealership (admin or dealer principal)
  update: dealerProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional(),
        logo: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if dealership exists
      const dealership = await ctx.prisma.dealership.findUnique({
        where: { id: input.id },
      });

      if (!dealership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dealership not found",
        });
      }

      // If user is a dealer principal, check if they belong to this dealership
      if (ctx.session.user.role === "DEALER_PRINCIPAL") {
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.session.user.id },
        });

        if (!user || user.dealershipId !== input.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only update your own dealership",
          });
        }
      }

      return await ctx.prisma.dealership.update({
        where: { id: input.id },
        data: {
          name: input.name,
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          phone: input.phone,
          email: input.email,
          website: input.website,
          logo: input.logo,
          description: input.description,
        },
      });
    }),

  // Delete dealership (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if dealership exists
      const dealership = await ctx.prisma.dealership.findUnique({
        where: { id: input.id },
      });

      if (!dealership) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Dealership not found",
        });
      }

      return await ctx.prisma.dealership.delete({
        where: { id: input.id },
      });
    }),

  // Get dealership staff (admin or dealer principal)
  getStaff: dealerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // If user is a dealer principal, check if they belong to this dealership
      if (ctx.session.user.role === "DEALER_PRINCIPAL") {
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.session.user.id },
        });

        if (!user || user.dealershipId !== input.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You can only view staff from your own dealership",
          });
        }
      }

      return await ctx.prisma.user.findMany({
        where: { dealershipId: input.id },
      });
    }),
});
