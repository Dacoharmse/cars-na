import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Calculate date ranges
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Fetch data in parallel for better performance
    const [
      totalVehicles,
      totalUsers,
      totalDealerships,
      totalLeads,
      recentLeads,
      completedPayments,
      previousCompletedPayments,
      vehiclesByMake,
      vehiclesByBodyType,
      usersByRegion,
      revenueByRegion,
      dailyVehicleViews,
      activeSubscriptions,
    ] = await Promise.all([
      // Total vehicles
      prisma.vehicle.count(),

      // Total users
      prisma.user.count(),

      // Total dealerships
      prisma.dealership.count(),

      // Total leads (all time)
      prisma.lead.count(),

      // Recent leads (last 30 days)
      prisma.lead.count({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      // Completed payments (last 30 days)
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Previous period payments (for growth calculation)
      prisma.payment.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: sixtyDaysAgo,
            lt: thirtyDaysAgo,
          },
        },
        _sum: {
          amount: true,
        },
      }),

      // Top performing vehicle makes
      prisma.vehicle.groupBy({
        by: ['make'],
        _count: {
          id: true,
        },
        _sum: {
          viewCount: true,
          price: true,
        },
        orderBy: {
          _sum: {
            viewCount: 'desc',
          },
        },
        take: 5,
      }),

      // Vehicles by body type
      prisma.vehicle.groupBy({
        by: ['bodyType'],
        _count: {
          id: true,
        },
        _sum: {
          viewCount: true,
        },
        where: {
          bodyType: {
            not: null,
          },
        },
      }),

      // Users by region
      prisma.user.groupBy({
        by: ['region'],
        _count: {
          id: true,
        },
        where: {
          region: {
            not: null,
          },
        },
      }),

      // Revenue by dealership region
      prisma.payment.groupBy({
        by: ['subscriptionId'],
        _sum: {
          amount: true,
        },
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      // Daily vehicle views (last 7 days)
      prisma.vehicle.aggregate({
        _sum: {
          viewCount: true,
        },
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),

      // Active subscriptions
      prisma.dealershipSubscription.count({
        where: {
          status: 'ACTIVE',
        },
      }),
    ]);

    // Get leads by vehicle to calculate inquiries
    const leadsGroupedByVehicle = await prisma.lead.groupBy({
      by: ['vehicleId'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get vehicles with their dealerships for geographic data
    const dealershipsWithRevenue = await prisma.dealership.findMany({
      where: {
        region: {
          not: null,
        },
      },
      select: {
        region: true,
        users: {
          select: {
            id: true,
          },
        },
        subscription: {
          select: {
            payments: {
              where: {
                status: 'COMPLETED',
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
              select: {
                amount: true,
              },
            },
          },
        },
      },
    });

    // Calculate overview metrics
    const currentRevenue = completedPayments._sum.amount || 0;
    const previousRevenue = previousCompletedPayments._sum.amount || 0;
    const growthRate = previousRevenue > 0
      ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
      : 0;

    const totalPageViews = dailyVehicleViews._sum.viewCount || 0;
    const conversionRate = totalVehicles > 0 ? (recentLeads / totalVehicles) * 100 : 0;

    // Process vehicle performance by make — single batch query instead of N+1
    const topMakes = vehiclesByMake.map(m => m.make);
    const [leadsByMake, avgPriceByMake] = await Promise.all([
      prisma.lead.groupBy({
        by: ['vehicleId'],
        where: {
          createdAt: { gte: thirtyDaysAgo },
          vehicle: { make: { in: topMakes } },
        },
        _count: { id: true },
      }).then(async (leadGroups) => {
        // Map vehicle IDs to makes
        const vehicleIds = leadGroups.map(l => l.vehicleId).filter(Boolean) as string[];
        const vehicles = vehicleIds.length > 0 ? await prisma.vehicle.findMany({
          where: { id: { in: vehicleIds } },
          select: { id: true, make: true },
        }) : [];
        const vehicleMakeMap = new Map(vehicles.map(v => [v.id, v.make]));
        const makeLeadCounts = new Map<string, number>();
        for (const lg of leadGroups) {
          if (!lg.vehicleId) continue;
          const make = vehicleMakeMap.get(lg.vehicleId);
          if (make) makeLeadCounts.set(make, (makeLeadCounts.get(make) || 0) + lg._count.id);
        }
        return makeLeadCounts;
      }),
      prisma.vehicle.groupBy({
        by: ['make'],
        where: { make: { in: topMakes } },
        _avg: { price: true },
      }),
    ]);

    const avgPriceMap = new Map(avgPriceByMake.map(a => [a.make, a._avg.price || 0]));

    const makePerformance = vehiclesByMake.map(make => ({
      make: make.make,
      views: make._sum.viewCount || 0,
      inquiries: leadsByMake.get(make.make) || 0,
      conversions: 0,
      avgPrice: Math.round(avgPriceMap.get(make.make) || 0),
    }));

    // Process geographic data
    const regionMap = new Map<string, { users: number; revenue: number }>();

    dealershipsWithRevenue.forEach((dealership) => {
      const region = dealership.region || 'Other';
      const existing = regionMap.get(region) || { users: 0, revenue: 0 };

      existing.users += dealership.users.length;

      if (dealership.subscription) {
        const dealerRevenue = dealership.subscription.payments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );
        existing.revenue += dealerRevenue;
      }

      regionMap.set(region, existing);
    });

    const totalRevenueForPercentage = Array.from(regionMap.values()).reduce(
      (sum, r) => sum + r.revenue,
      0
    );

    const geographic = Array.from(regionMap.entries())
      .map(([region, data]) => ({
        region,
        users: data.users,
        revenue: data.revenue,
        percentage: totalRevenueForPercentage > 0
          ? (data.revenue / totalRevenueForPercentage) * 100
          : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Traffic sources (mock data - would need tracking implementation)
    const sources = [
      { name: 'Direct Traffic', visitors: Math.round(totalUsers * 0.35), percentage: 35, growth: 0 },
      { name: 'Organic Search', visitors: Math.round(totalUsers * 0.30), percentage: 30, growth: 0 },
      { name: 'Social Media', visitors: Math.round(totalUsers * 0.20), percentage: 20, growth: 0 },
      { name: 'Referral Sites', visitors: Math.round(totalUsers * 0.10), percentage: 10, growth: 0 },
      { name: 'Email Marketing', visitors: Math.round(totalUsers * 0.05), percentage: 5, growth: 0 },
    ];

    // Build analytics response
    const analytics = {
      overview: {
        totalPageViews,
        uniqueVisitors: totalUsers,
        bounceRate: 32.4, // Would need session tracking
        avgSessionDuration: '4:32', // Would need session tracking
        conversionRate: Number(conversionRate.toFixed(2)),
        totalRevenue: currentRevenue,
        growthRate: Number(growthRate.toFixed(2)),
      },
      traffic: {
        daily: [], // Would need daily tracking
        sources,
      },
      listings: {
        performance: makePerformance,
        categories: vehiclesByBodyType.map((type) => ({
          type: type.bodyType || 'Unknown',
          listings: type._count.id,
          views: type._sum.viewCount || 0,
          inquiries: 0, // Would need to join with leads
          sales: 0, // Would need sales tracking
        })),
      },
      revenue: {
        monthly: [], // Would need monthly aggregation
        breakdown: {
          subscriptionRevenue: currentRevenue,
          commissionRevenue: 0, // Would need commission tracking
          featuredListings: 0, // Would need featured listing payments
          premiumServices: 0, // Would need premium service tracking
          totalRevenue: currentRevenue,
        },
      },
      users: {
        registration: [], // Would need daily registration tracking
        engagement: {
          activeUsers: totalUsers,
          returningUsers: 0, // Would need session tracking
          newUsers: 0, // Would need registration date filtering
          avgSessionDuration: 0, // Would need session tracking
          pagesPerSession: 0, // Would need page view tracking
          messagesSent: totalLeads,
          listingsViewed: totalPageViews,
        },
      },
      geographic,
    };

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
