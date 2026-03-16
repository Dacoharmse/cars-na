import { z } from "zod";
import { adminProcedure, router } from "../trpc";

const createTRPCRouter = router;

const dateRangeInput = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  period: z.enum(['7d', '30d', '90d', '1y', 'all']).default('30d'),
});

const metricsFilterInput = z.object({
  region: z.string().optional(),
  dealerType: z.enum(['PREMIUM', 'STANDARD', 'BASIC']).optional(),
  vehicleCategory: z.enum(['NEW', 'USED', 'CERTIFIED']).optional(),
}).merge(dateRangeInput);

const exportInput = z.object({
  format: z.enum(['CSV', 'PDF', 'EXCEL']),
  reportType: z.enum(['USERS', 'DEALERS', 'VEHICLES', 'REVENUE', 'TRAFFIC']),
}).merge(metricsFilterInput);

const getDateRange = (period: string) => {
  const now = new Date();
  const endDate = new Date(now);
  let startDate = new Date(now);

  switch (period) {
    case '7d': startDate.setDate(now.getDate() - 7); break;
    case '30d': startDate.setDate(now.getDate() - 30); break;
    case '90d': startDate.setDate(now.getDate() - 90); break;
    case '1y': startDate.setFullYear(now.getFullYear() - 1); break;
    default: startDate = new Date('2024-01-01');
  }

  return { startDate, endDate };
};

export const analyticsRouter = createTRPCRouter({
  getUserAnalytics: adminProcedure
    .input(metricsFilterInput)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = getDateRange(input.period);

      const [totalUsers, newUsers, activeUsers] = await Promise.all([
        ctx.prisma.user.count(),
        ctx.prisma.user.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
        ctx.prisma.user.count({
          where: { isActive: true },
        }),
      ]);

      return {
        overview: {
          totalUsers,
          totalActiveUsers: activeUsers,
          newUsersThisPeriod: newUsers,
          userGrowthRate: totalUsers > 0 ? newUsers / totalUsers : 0,
          averageRetentionRate: totalUsers > 0 ? activeUsers / totalUsers : 0,
          churnRate: totalUsers > 0 ? (totalUsers - activeUsers) / totalUsers : 0,
        },
        timeSeries: [],
        demographics: { ageGroups: [], regions: [] },
      };
    }),

  getDealerAnalytics: adminProcedure
    .input(metricsFilterInput)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = getDateRange(input.period);

      const [totalDealers, activeDealers, newDealers, topDealers] = await Promise.all([
        ctx.prisma.dealership.count(),
        ctx.prisma.dealership.count({ where: { status: 'APPROVED' } }),
        ctx.prisma.dealership.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
        ctx.prisma.dealership.findMany({
          take: 10,
          where: { status: 'APPROVED' },
          include: {
            _count: { select: { vehicles: true, leads: true } },
            subscription: { include: { plan: true } },
          },
          orderBy: { profileViews: 'desc' },
        }),
      ]);

      const totalVehicles = await ctx.prisma.vehicle.count({
        where: { status: 'AVAILABLE' },
      });

      return {
        overview: {
          totalDealers,
          activeDealers,
          newDealersThisPeriod: newDealers,
          averageListingsPerDealer: activeDealers > 0 ? Math.round((totalVehicles / activeDealers) * 10) / 10 : 0,
          churnRate: totalDealers > 0 ? (totalDealers - activeDealers) / totalDealers : 0,
        },
        timeSeries: [],
        performance: topDealers.map(d => ({
          dealerId: d.id,
          name: d.name,
          plan: d.subscription?.plan?.name || 'None',
          totalListings: d._count.vehicles,
          totalLeads: d._count.leads,
          profileViews: d.profileViews,
          region: d.region || 'Unknown',
        })),
      };
    }),

  getVehicleAnalytics: adminProcedure
    .input(metricsFilterInput)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = getDateRange(input.period);

      const [totalListings, activeListings, newListings, soldListings, makeBreakdown] = await Promise.all([
        ctx.prisma.vehicle.count(),
        ctx.prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
        ctx.prisma.vehicle.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
        ctx.prisma.vehicle.count({
          where: { status: 'SOLD', updatedAt: { gte: startDate, lte: endDate } },
        }),
        ctx.prisma.vehicle.groupBy({
          by: ['make'],
          _count: true,
          _avg: { price: true },
          orderBy: { _count: { make: 'desc' } },
          take: 10,
        }),
      ]);

      const priceStats = await ctx.prisma.vehicle.aggregate({
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true },
        where: { status: 'AVAILABLE' },
      });

      return {
        overview: {
          totalListings,
          activeListings,
          newListingsThisPeriod: newListings,
          soldThisPeriod: soldListings,
          averagePrice: priceStats._avg.price || 0,
        },
        timeSeries: [],
        brandPerformance: makeBreakdown.map(m => ({
          brand: m.make,
          listings: m._count,
          avgPrice: m._avg.price || 0,
        })),
        priceAnalysis: {
          averagePrice: priceStats._avg.price || 0,
          minPrice: priceStats._min.price || 0,
          maxPrice: priceStats._max.price || 0,
        },
      };
    }),

  getRevenueAnalytics: adminProcedure
    .input(metricsFilterInput)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = getDateRange(input.period);

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);

      const [periodRevenue, monthlyRevenue, annualRevenue, paymentCount, activeSubs] = await Promise.all([
        ctx.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'COMPLETED', createdAt: { gte: startDate, lte: endDate } },
        }),
        ctx.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'COMPLETED', createdAt: { gte: monthStart } },
        }),
        ctx.prisma.payment.aggregate({
          _sum: { amount: true },
          where: { status: 'COMPLETED', createdAt: { gte: yearStart } },
        }),
        ctx.prisma.payment.count({
          where: { status: 'COMPLETED', createdAt: { gte: startDate, lte: endDate } },
        }),
        ctx.prisma.dealershipSubscription.count({ where: { status: 'ACTIVE' } }),
      ]);

      return {
        overview: {
          totalRevenue: periodRevenue._sum.amount || 0,
          monthlyRecurringRevenue: monthlyRevenue._sum.amount || 0,
          annualRevenue: annualRevenue._sum.amount || 0,
          totalPayments: paymentCount,
          activeSubscriptions: activeSubs,
        },
        timeSeries: [],
      };
    }),

  getTrafficAnalytics: adminProcedure
    .input(metricsFilterInput)
    .query(async ({ ctx }) => {
      const [dealerViews, vehicleViews] = await Promise.all([
        ctx.prisma.dealership.aggregate({ _sum: { profileViews: true } }),
        ctx.prisma.vehicle.aggregate({ _sum: { viewCount: true } }),
      ]);

      return {
        overview: {
          totalDealershipViews: dealerViews._sum.profileViews || 0,
          totalVehicleViews: vehicleViews._sum.viewCount || 0,
        },
        timeSeries: [],
      };
    }),

  getDashboardOverview: adminProcedure
    .input(dateRangeInput)
    .query(async ({ ctx, input }) => {
      const { startDate, endDate } = getDateRange(input.period);

      const [
        totalUsers, totalDealers, totalListings, activeListings,
        monthlyRevenue, totalLeads, newUsersCount, newDealersCount,
      ] = await Promise.all([
        ctx.prisma.user.count(),
        ctx.prisma.dealership.count({ where: { status: 'APPROVED' } }),
        ctx.prisma.vehicle.count(),
        ctx.prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
        ctx.prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: 'COMPLETED',
            createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
          },
        }),
        ctx.prisma.lead.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
        ctx.prisma.user.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
        ctx.prisma.dealership.count({
          where: { createdAt: { gte: startDate, lte: endDate } },
        }),
      ]);

      return {
        kpis: {
          totalUsers,
          totalDealers,
          totalListings,
          activeListings,
          totalRevenue: monthlyRevenue._sum.amount || 0,
          totalLeads,
        },
        trends: {
          newUsers: newUsersCount,
          newDealers: newDealersCount,
        },
        alerts: [],
        recentActivity: [],
      };
    }),

  exportAnalytics: adminProcedure
    .input(exportInput)
    .mutation(async ({ input }) => {
      const filename = `${input.reportType.toLowerCase()}_analytics_${new Date().toISOString().split('T')[0]}.${input.format.toLowerCase()}`;
      return {
        success: true,
        downloadUrl: `/api/admin/generate-report`,
        filename,
        generatedAt: new Date(),
      };
    }),

  getRealTimeMetrics: adminProcedure
    .query(async ({ ctx }) => {
      const [activeListings, activeUsers] = await Promise.all([
        ctx.prisma.vehicle.count({ where: { status: 'AVAILABLE' } }),
        ctx.prisma.user.count({ where: { isActive: true } }),
      ]);

      return {
        activeUsers,
        activeListings,
        lastUpdated: new Date(),
      };
    }),
});
