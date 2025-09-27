import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../trpc';
import { prisma } from '@/lib/prisma';
import { paystack } from '@/lib/paystack';
import { TRPCError } from '@trpc/server';

export const subscriptionRouter = router({
  // Get all subscription plans
  getPlans: protectedProcedure.query(async () => {
    return await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { priority: 'asc' },
    });
  }),

  // Get plan by ID
  getPlan: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: input.id },
      });

      if (!plan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Subscription plan not found',
        });
      }

      return plan;
    }),

  // Get dealership subscription
  getDealershipSubscription: protectedProcedure
    .input(z.object({ dealershipId: z.string() }))
    .query(async ({ input, ctx }) => {
      // Check if user has access to this dealership
      if (ctx.user.role !== 'ADMIN' && ctx.user.dealershipId !== input.dealershipId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      return await prisma.dealershipSubscription.findUnique({
        where: { dealershipId: input.dealershipId },
        include: {
          plan: true,
          dealership: true,
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          usageAnalytics: {
            orderBy: { date: 'desc' },
            take: 30,
          },
        },
      });
    }),

  // Create subscription checkout
  createCheckout: protectedProcedure
    .input(z.object({
      dealershipId: z.string(),
      planId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      // Check if user has access to this dealership
      if (ctx.user.role !== 'ADMIN' && ctx.user.dealershipId !== input.dealershipId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: input.planId },
      });

      if (!plan) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Subscription plan not found',
        });
      }

      const dealership = await prisma.dealership.findUnique({
        where: { id: input.dealershipId },
        include: { users: true },
      });

      if (!dealership) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Dealership not found',
        });
      }

      try {
        // Create or get Paystack customer
        let customerId = dealership.subscription?.paystackCustomerId;

        if (!customerId) {
          const customer = await paystack.customer.create({
            email: dealership.users[0]?.email || '',
            first_name: dealership.name.split(' ')[0] || 'Dealership',
            last_name: dealership.name.split(' ').slice(1).join(' ') || 'Owner',
            metadata: {
              dealershipId: dealership.id,
            },
          });
          customerId = customer.data.customer_code;
        }

        // Return checkout data for frontend
        return {
          customerId,
          planId: plan.id,
          amount: plan.price,
          currency: plan.currency,
          dealershipId: dealership.id,
        };
      } catch (error) {
        console.error('Paystack error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create checkout session',
        });
      }
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure
    .input(z.object({ dealershipId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Check if user has access to this dealership
      if (ctx.user.role !== 'ADMIN' && ctx.user.dealershipId !== input.dealershipId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      const subscription = await prisma.dealershipSubscription.findUnique({
        where: { dealershipId: input.dealershipId },
      });

      if (!subscription) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Subscription not found',
        });
      }

      // Cancel in Paystack if exists
      if (subscription.paystackSubscriptionId) {
        try {
          await paystack.subscription.disable({
            code: subscription.paystackSubscriptionId,
            token: subscription.paystackSubscriptionId,
          });
        } catch (error) {
          console.error('Paystack cancellation error:', error);
        }
      }

      // Update in database
      await prisma.dealershipSubscription.update({
        where: { dealershipId: input.dealershipId },
        data: {
          status: 'CANCELLED',
          autoRenew: false,
        },
      });

      return { success: true };
    }),

  // Get subscription analytics
  getAnalytics: protectedProcedure
    .input(z.object({
      dealershipId: z.string(),
      days: z.number().default(30),
    }))
    .query(async ({ input, ctx }) => {
      // Check if user has access to this dealership
      if (ctx.user.role !== 'ADMIN' && ctx.user.dealershipId !== input.dealershipId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Access denied',
        });
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const analytics = await prisma.usageAnalytics.findMany({
        where: {
          subscription: {
            dealershipId: input.dealershipId,
          },
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: 'asc' },
      });

      return analytics;
    }),

  // Admin: Get all subscriptions
  getAllSubscriptions: adminProcedure
    .input(z.object({
      page: z.number().default(1),
      limit: z.number().default(10),
      status: z.enum(['ACTIVE', 'CANCELLED', 'EXPIRED', 'SUSPENDED', 'PENDING_PAYMENT', 'PAST_DUE']).optional(),
    }))
    .query(async ({ input }) => {
      const { page, limit, status } = input;
      const skip = (page - 1) * limit;

      const where = status ? { status } : {};

      const [subscriptions, total] = await Promise.all([
        prisma.dealershipSubscription.findMany({
          where,
          include: {
            dealership: true,
            plan: true,
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.dealershipSubscription.count({ where }),
      ]);

      return {
        subscriptions,
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    }),

  // Admin: Create subscription plan
  createPlan: adminProcedure
    .input(z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
      price: z.number(),
      currency: z.string().default('NAD'),
      duration: z.number(),
      features: z.array(z.string()),
      maxListings: z.number().default(0),
      maxPhotos: z.number().default(5),
      priority: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      return await prisma.subscriptionPlan.create({
        data: {
          ...input,
          features: input.features,
        },
      });
    }),

  // Admin: Update subscription plan
  updatePlan: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      price: z.number().optional(),
      duration: z.number().optional(),
      features: z.array(z.string()).optional(),
      maxListings: z.number().optional(),
      maxPhotos: z.number().optional(),
      priority: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;

      return await prisma.subscriptionPlan.update({
        where: { id },
        data,
      });
    }),

  // Admin: Delete subscription plan
  deletePlan: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.subscriptionPlan.delete({
        where: { id: input.id },
      });
    }),
});