/**
 * Lead router for Cars.na
 */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure, dealerProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const leadRouter = router({
  // Create a new lead (public procedure for contact forms)
  create: publicProcedure
    .input(
      z.object({
        vehicleId: z.string(),
        customerName: z.string().min(1),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        message: z.string().optional(),
        source: z.enum(["CONTACT_FORM", "WHATSAPP", "PHONE_CALL", "EMAIL", "WALK_IN", "WEBSITE"]).default("CONTACT_FORM"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get vehicle and dealership info
      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: { id: input.vehicleId },
        include: { dealership: true },
      });

      if (!vehicle) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vehicle not found",
        });
      }

      // Create the lead
      const lead = await ctx.prisma.lead.create({
        data: {
          vehicleId: input.vehicleId,
          dealershipId: vehicle.dealershipId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          message: input.message,
          source: input.source,
          status: "NEW",
        },
        include: {
          vehicle: {
            select: {
              make: true,
              model: true,
              year: true,
              price: true,
            },
          },
          dealership: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return lead;
    }),

  // Get leads for a specific dealership (dealer access only)
  getByDealership: dealerProcedure
    .input(
      z.object({
        dealershipId: z.string().optional(),
        status: z.enum(["NEW", "CONTACTED", "INTERESTED", "QUALIFIED", "CONVERTED", "CLOSED"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
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

      const leads = await ctx.prisma.lead.findMany({
        where: {
          dealershipId,
          ...(input.status && { status: input.status }),
        },
        include: {
          vehicle: {
            select: {
              make: true,
              model: true,
              year: true,
              price: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: {
            id: input.cursor,
          },
          skip: 1,
        }),
      });

      let nextCursor: typeof input.cursor = undefined;
      if (leads.length > input.limit) {
        const nextItem = leads.pop();
        nextCursor = nextItem!.id;
      }

      return {
        leads,
        nextCursor,
      };
    }),

  // Update lead status (dealer access only)
  updateStatus: dealerProcedure
    .input(
      z.object({
        leadId: z.string(),
        status: z.enum(["NEW", "CONTACTED", "INTERESTED", "QUALIFIED", "CONVERTED", "CLOSED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get user's dealership to ensure they can only update their own leads
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      const lead = await ctx.prisma.lead.findUnique({
        where: { id: input.leadId },
      });

      if (!lead) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead not found",
        });
      }

      // Ensure the lead belongs to the user's dealership
      if (lead.dealershipId !== user?.dealershipId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only update leads for your dealership",
        });
      }

      return await ctx.prisma.lead.update({
        where: { id: input.leadId },
        data: {
          status: input.status,
          updatedAt: new Date(),
        },
        include: {
          vehicle: {
            select: {
              make: true,
              model: true,
              year: true,
              price: true,
            },
          },
        },
      });
    }),

  // Get lead statistics for dashboard
  getStats: dealerProcedure
    .input(
      z.object({
        dealershipId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
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

      const [total, new_, contacted, converted] = await Promise.all([
        ctx.prisma.lead.count({
          where: { dealershipId },
        }),
        ctx.prisma.lead.count({
          where: { dealershipId, status: "NEW" },
        }),
        ctx.prisma.lead.count({
          where: { dealershipId, status: "CONTACTED" },
        }),
        ctx.prisma.lead.count({
          where: { dealershipId, status: "CONVERTED" },
        }),
      ]);

      const conversionRate = total > 0 ? (converted / total) * 100 : 0;

      return {
        total,
        new: new_,
        contacted,
        converted,
        conversionRate: Math.round(conversionRate * 100) / 100,
      };
    }),
});