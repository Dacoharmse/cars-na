import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Enable edge runtime for faster cold starts
export const runtime = 'nodejs';
// Cache for 60 seconds, revalidate in background
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const take = parseInt(searchParams.get('take') || '4');

    // If type is 'all', return all showcase data in one request
    if (type === 'all') {
      const [featured, dealerPicks, topDeals, mostViewed, newListings, topNewCars, topUsedCars] = await Promise.all([
        // Featured vehicles
        prisma.vehicle.findMany({
          where: { featured: true, status: 'AVAILABLE' },
          include: {
            dealership: { select: { name: true, city: true } },
            images: { orderBy: { isPrimary: 'desc' }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
          take,
        }),
        // Dealer picks
        prisma.vehicle.findMany({
          where: { dealerPick: true, status: 'AVAILABLE' },
          include: {
            dealership: { select: { name: true, city: true } },
            images: { orderBy: { isPrimary: 'desc' }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
          take,
        }),
        // Top deals
        prisma.vehicle.findMany({
          where: { originalPrice: { not: null }, status: 'AVAILABLE' },
          include: {
            dealership: { select: { name: true, city: true } },
            images: { orderBy: { isPrimary: 'desc' }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
          take,
        }),
        // Most viewed
        prisma.vehicle.findMany({
          where: { status: 'AVAILABLE' },
          include: {
            dealership: { select: { name: true, city: true } },
            images: { orderBy: { isPrimary: 'desc' }, take: 1 },
          },
          orderBy: { viewCount: 'desc' },
          take,
        }),
        // New listings (last 72 hours)
        prisma.vehicle.findMany({
          where: {
            createdAt: { gte: new Date(Date.now() - 72 * 60 * 60 * 1000) },
            status: 'AVAILABLE',
          },
          include: {
            dealership: { select: { name: true, city: true } },
            images: { orderBy: { isPrimary: 'desc' }, take: 1 },
          },
          orderBy: { createdAt: 'desc' },
          take,
        }),
        // Top new cars
        prisma.vehicle.findMany({
          where: { isNew: true, status: 'AVAILABLE' },
          include: {
            dealership: { select: { name: true, city: true } },
            images: { orderBy: { isPrimary: 'desc' }, take: 1 },
          },
          orderBy: { viewCount: 'desc' },
          take: 10,
        }),
        // Top used cars
        prisma.vehicle.findMany({
          where: { isNew: false, status: 'AVAILABLE' },
          include: {
            dealership: { select: { name: true, city: true } },
            images: { orderBy: { isPrimary: 'desc' }, take: 1 },
          },
          orderBy: { viewCount: 'desc' },
          take: 10,
        }),
      ]);

      const response = NextResponse.json({
        success: true,
        data: {
          featured: { vehicles: featured },
          dealerPicks: { vehicles: dealerPicks },
          topDeals: { vehicles: topDeals },
          mostViewed: { vehicles: mostViewed },
          newListings: { vehicles: newListings },
          topNewCars: { vehicles: topNewCars },
          topUsedCars: { vehicles: topUsedCars },
        },
      });

      response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
      return response;
    }

    let vehicles;

    switch (type) {
      case 'featured':
        vehicles = await prisma.vehicle.findMany({
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
          take,
        });
        break;

      case 'dealerPicks':
        vehicles = await prisma.vehicle.findMany({
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
          take,
        });
        break;

      case 'topDeals':
        vehicles = await prisma.vehicle.findMany({
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
          take,
        });
        break;

      case 'mostViewed':
        vehicles = await prisma.vehicle.findMany({
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
          take,
        });
        break;

      case 'newListings':
        const sinceDate = new Date();
        sinceDate.setHours(sinceDate.getHours() - 72); // Last 72 hours

        vehicles = await prisma.vehicle.findMany({
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
          take,
        });
        break;

      case 'topNewCars':
        vehicles = await prisma.vehicle.findMany({
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
          take,
        });
        break;

      case 'topUsedCars':
        vehicles = await prisma.vehicle.findMany({
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
          take,
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    const response = NextResponse.json({
      success: true,
      vehicles,
    });

    // Add cache control headers
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    return response;
  } catch (error) {
    console.error('Error fetching showcase vehicles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}
