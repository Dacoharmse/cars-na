import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Cache for 2 minutes (120 seconds)
const CACHE_DURATION = 120;
let showcaseCache: {
  data: any;
  timestamp: number;
} | null = null;

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (showcaseCache && (now - showcaseCache.timestamp) < CACHE_DURATION * 1000) {
      return NextResponse.json(showcaseCache.data, {
        headers: {
          'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=60`,
        },
      });
    }

    const { searchParams } = new URL(request.url);
    const take = parseInt(searchParams.get('take') || '4');

    // Common select for dealership and images
    const commonInclude = {
      dealership: {
        select: {
          name: true,
          city: true,
        },
      },
      images: {
        orderBy: {
          isPrimary: 'desc' as const,
        },
        take: 1,
      },
    };

    const commonWhere = {
      status: 'AVAILABLE' as const,
    };

    // Get date for new listings (last 72 hours)
    const sinceDate = new Date();
    sinceDate.setHours(sinceDate.getHours() - 72);

    // Execute all queries in parallel for maximum performance
    const [
      featured,
      topDeals,
      mostViewed,
      newListings,
      topNewCars,
      topUsedCars,
    ] = await Promise.all([
      // Featured vehicles
      prisma.vehicle.findMany({
        where: {
          ...commonWhere,
          featured: true,
        },
        include: commonInclude,
        orderBy: { createdAt: 'desc' },
        take,
      }),

      // Top deals (vehicles with discounts)
      prisma.vehicle.findMany({
        where: {
          ...commonWhere,
          originalPrice: { not: null },
        },
        include: commonInclude,
        orderBy: { createdAt: 'desc' },
        take,
      }),

      // Most viewed
      prisma.vehicle.findMany({
        where: commonWhere,
        include: commonInclude,
        orderBy: { viewCount: 'desc' },
        take,
      }),

      // New listings (last 72 hours)
      prisma.vehicle.findMany({
        where: {
          ...commonWhere,
          createdAt: { gte: sinceDate },
        },
        include: commonInclude,
        orderBy: { createdAt: 'desc' },
        take,
      }),

      // Top new cars
      prisma.vehicle.findMany({
        where: {
          ...commonWhere,
          isNew: true,
        },
        include: commonInclude,
        orderBy: { viewCount: 'desc' },
        take: 10,
      }),

      // Top used cars
      prisma.vehicle.findMany({
        where: {
          ...commonWhere,
          isNew: false,
        },
        include: commonInclude,
        orderBy: { viewCount: 'desc' },
        take: 10,
      }),
    ]);

    const responseData = {
      success: true,
      data: {
        featured,
        topDeals,
        mostViewed,
        newListings,
        topNewCars,
        topUsedCars,
      },
    };

    // Update cache
    showcaseCache = {
      data: responseData,
      timestamp: now,
    };

    return NextResponse.json(responseData, {
      headers: {
        'Cache-Control': `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=60`,
      },
    });
  } catch (error) {
    console.error('Error fetching all showcase vehicles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch showcase data' },
      { status: 500 }
    );
  }
}
