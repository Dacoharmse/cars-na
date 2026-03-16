import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { subDays, subMonths, format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and their dealership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { dealership: true },
    });

    if (!user || !user.dealershipId) {
      return NextResponse.json({ error: 'No dealership associated with user' }, { status: 403 });
    }

    if (user.role !== 'DEALER_PRINCIPAL' && user.role !== 'SALES_EXECUTIVE' && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const dealershipId = user.dealershipId;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;

    switch (period) {
      case '7d':
        startDate = subDays(now, 7);
        previousStartDate = subDays(now, 14);
        break;
      case '30d':
        startDate = subDays(now, 30);
        previousStartDate = subDays(now, 60);
        break;
      case '90d':
        startDate = subDays(now, 90);
        previousStartDate = subDays(now, 180);
        break;
      case '12m':
        startDate = subMonths(now, 12);
        previousStartDate = subMonths(now, 24);
        break;
      default:
        startDate = subDays(now, 7);
        previousStartDate = subDays(now, 14);
    }

    // Run all queries in parallel
    const [
      totalViews,
      activeListings,
      totalLeads,
      previousLeads,
      totalInquiries,
      previousInquiries,
      soldVehicles,
      previousSoldVehicles,
      vehiclesByMake,
      leadsBySource,
      recentLeads,
      recentVehicles,
    ] = await Promise.all([
      // Total views across all vehicles for this dealership
      prisma.vehicle.aggregate({
        where: { dealershipId },
        _sum: { viewCount: true },
      }),

      // Active listings count
      prisma.vehicle.count({
        where: { dealershipId, status: 'AVAILABLE' },
      }),

      // Total leads in period
      prisma.lead.count({
        where: {
          dealershipId,
          createdAt: { gte: startDate },
        },
      }),

      // Previous period leads (for comparison)
      prisma.lead.count({
        where: {
          dealershipId,
          createdAt: { gte: previousStartDate, lt: startDate },
        },
      }),

      // Total inquiries in period
      prisma.dealershipInquiry.count({
        where: {
          dealershipId,
          createdAt: { gte: startDate },
        },
      }),

      // Previous period inquiries
      prisma.dealershipInquiry.count({
        where: {
          dealershipId,
          createdAt: { gte: previousStartDate, lt: startDate },
        },
      }),

      // Sold vehicles in period
      prisma.vehicle.count({
        where: {
          dealershipId,
          status: 'SOLD',
          updatedAt: { gte: startDate },
        },
      }),

      // Previous period sold
      prisma.vehicle.count({
        where: {
          dealershipId,
          status: 'SOLD',
          updatedAt: { gte: previousStartDate, lt: startDate },
        },
      }),

      // Vehicle performance grouped by make
      prisma.vehicle.groupBy({
        by: ['make', 'model'],
        where: { dealershipId },
        _sum: { viewCount: true },
        _count: true,
        orderBy: { _sum: { viewCount: 'desc' } },
        take: 10,
      }),

      // Leads by source
      prisma.lead.groupBy({
        by: ['source'],
        where: {
          dealershipId,
          createdAt: { gte: startDate },
        },
        _count: true,
      }),

      // Recent leads with dates for time series
      prisma.lead.findMany({
        where: {
          dealershipId,
          createdAt: { gte: startDate },
        },
        select: {
          createdAt: true,
          source: true,
          status: true,
        },
        orderBy: { createdAt: 'asc' },
      }),

      // Recent vehicles for time series (views, sold)
      prisma.vehicle.findMany({
        where: {
          dealershipId,
          createdAt: { gte: startDate },
        },
        select: {
          createdAt: true,
          viewCount: true,
          status: true,
          price: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    // Also get leads per vehicle make for the performance table
    const leadsPerMake = await prisma.lead.groupBy({
      by: ['vehicleId'],
      where: {
        dealershipId,
        vehicleId: { not: null },
      },
      _count: true,
    });

    // Get vehicle info for leads
    const vehicleIdsWithLeads = leadsPerMake
      .filter(l => l.vehicleId !== null)
      .map(l => l.vehicleId as string);

    const vehiclesWithLeads = vehicleIdsWithLeads.length > 0
      ? await prisma.vehicle.findMany({
          where: { id: { in: vehicleIdsWithLeads } },
          select: { id: true, make: true, model: true },
        })
      : [];

    // Build lead counts by make
    const leadCountByMake: Record<string, number> = {};
    for (const leadGroup of leadsPerMake) {
      const vehicle = vehiclesWithLeads.find(v => v.id === leadGroup.vehicleId);
      if (vehicle) {
        const key = `${vehicle.make}_${vehicle.model}`;
        leadCountByMake[key] = (leadCountByMake[key] || 0) + leadGroup._count;
      }
    }

    // Calculate percentage changes
    const calcChange = (current: number, previous: number): { change: number; changeType: 'increase' | 'decrease' | 'neutral' } => {
      if (previous === 0) return { change: current > 0 ? 100 : 0, changeType: current > 0 ? 'increase' : 'neutral' };
      const change = ((current - previous) / previous) * 100;
      return {
        change: Math.round(Math.abs(change) * 10) / 10,
        changeType: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral',
      };
    };

    const totalViewCount = totalViews._sum.viewCount || 0;
    const leadsChange = calcChange(totalLeads, previousLeads);
    const inquiriesChange = calcChange(totalInquiries, previousInquiries);
    const salesChange = calcChange(soldVehicles, previousSoldVehicles);

    // Conversion rate: leads / views
    const conversionRate = totalViewCount > 0
      ? Math.round((totalLeads / totalViewCount) * 1000) / 10
      : 0;

    // Build time series data
    const timeSeriesData = buildTimeSeries(startDate, now, period, recentLeads, recentVehicles);

    // Build vehicle performance data
    const vehiclePerformance = vehiclesByMake.map(group => {
      const key = `${group.make}_${group.model}`;
      const leads = leadCountByMake[key] || 0;
      const views = group._sum.viewCount || 0;
      const convRate = views > 0 ? Math.round((leads / views) * 1000) / 10 : 0;

      return {
        make: group.make,
        model: group.model,
        views,
        inquiries: 0, // We don't track inquiries per vehicle currently
        leads,
        conversionRate: convRate,
        avgTimeToSale: 0, // No soldAt field to calculate this
      };
    });

    // Build traffic sources from lead sources
    const totalLeadsBySource = leadsBySource.reduce((sum, s) => sum + s._count, 0);
    const sourceColors: Record<string, string> = {
      CONTACT_FORM: '#8884d8',
      WHATSAPP: '#82ca9d',
      PHONE_CALL: '#ffc658',
      EMAIL: '#ff7c7c',
      WALK_IN: '#8dd1e1',
      WEBSITE: '#d884d8',
    };
    const sourceLabels: Record<string, string> = {
      CONTACT_FORM: 'Contact Form',
      WHATSAPP: 'WhatsApp',
      PHONE_CALL: 'Phone Call',
      EMAIL: 'Email',
      WALK_IN: 'Walk-in',
      WEBSITE: 'Website',
    };

    const trafficSources = leadsBySource.map(s => ({
      source: sourceLabels[s.source] || s.source,
      visitors: s._count,
      percentage: totalLeadsBySource > 0 ? Math.round((s._count / totalLeadsBySource) * 100) : 0,
      color: sourceColors[s.source] || '#999999',
    }));

    // Build funnel data
    const convertedLeads = await prisma.lead.count({
      where: {
        dealershipId,
        status: 'CONVERTED',
        createdAt: { gte: startDate },
      },
    });

    const funnelData = {
      views: totalViewCount,
      inquiries: totalInquiries,
      leads: totalLeads,
      sales: soldVehicles,
      convertedLeads,
    };

    // Build metrics
    const metrics = {
      totalViews: totalViewCount,
      totalLeads,
      leadsChange,
      totalInquiries,
      inquiriesChange,
      activeListings,
      soldVehicles,
      salesChange,
      conversionRate,
    };

    return NextResponse.json({
      metrics,
      timeSeries: timeSeriesData,
      vehiclePerformance,
      trafficSources,
      funnel: funnelData,
    });
  } catch (error) {
    console.error('Dealer analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

function buildTimeSeries(
  startDate: Date,
  endDate: Date,
  period: string,
  leads: { createdAt: Date; source: string; status: string }[],
  vehicles: { createdAt: Date; viewCount: number; status: string; price: number }[]
) {
  // Generate date buckets
  let intervals: Date[];
  let formatStr: string;

  if (period === '12m') {
    intervals = eachMonthOfInterval({ start: startDate, end: endDate });
    formatStr = 'yyyy-MM';
  } else if (period === '90d') {
    intervals = eachWeekOfInterval({ start: startDate, end: endDate });
    formatStr = 'yyyy-MM-dd';
  } else {
    intervals = eachDayOfInterval({ start: startDate, end: endDate });
    formatStr = 'yyyy-MM-dd';
  }

  return intervals.map((date, i) => {
    const nextDate = i < intervals.length - 1 ? intervals[i + 1] : endDate;
    const dateStr = format(date, formatStr);

    const periodLeads = leads.filter(l => l.createdAt >= date && l.createdAt < nextDate);
    const periodVehicles = vehicles.filter(v => v.createdAt >= date && v.createdAt < nextDate);
    const periodSales = periodVehicles.filter(v => v.status === 'SOLD');

    return {
      date: dateStr,
      views: periodVehicles.reduce((sum, v) => sum + v.viewCount, 0),
      leads: periodLeads.length,
      inquiries: 0, // DealershipInquiry not loaded per-date for performance
      sales: periodSales.length,
      revenue: periodSales.reduce((sum, v) => sum + v.price, 0),
    };
  });
}
