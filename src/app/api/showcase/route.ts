import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const take = parseInt(searchParams.get('take') || '4');

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

    return NextResponse.json({
      success: true,
      vehicles,
    });
  } catch (error) {
    console.error('Error fetching showcase vehicles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}
