import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get one random featured dealership that is approved
    const featuredDealerships = await prisma.dealership.findMany({
      where: {
        isFeatured: true,
        status: 'APPROVED',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        region: true,
        phone: true,
        email: true,
        streetAddress: true,
        description: true,
        logo: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            vehicles: true,
            users: true,
          },
        },
        subscription: {
          select: {
            currentListings: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // If no featured dealerships, return empty
    if (featuredDealerships.length === 0) {
      return NextResponse.json({
        success: true,
        dealership: null,
      });
    }

    // Pick a random one from the featured dealerships
    const randomIndex = Math.floor(Math.random() * featuredDealerships.length);
    const dealership = featuredDealerships[randomIndex];

    // Calculate stats
    const vehiclesCount = dealership._count.vehicles;
    const rating = 4.9; // You can calculate this based on actual reviews later
    const yearsInBusiness = Math.floor(
      (new Date().getTime() - new Date(dealership.createdAt).getTime()) /
      (1000 * 60 * 60 * 24 * 365)
    );

    return NextResponse.json({
      success: true,
      dealership: {
        id: dealership.id,
        name: dealership.name,
        slug: dealership.slug,
        city: dealership.city,
        region: dealership.region,
        phone: dealership.phone,
        email: dealership.email,
        streetAddress: dealership.streetAddress,
        description: dealership.description,
        logo: dealership.logo,
        isVerified: dealership.isVerified,
        stats: {
          vehiclesCount: vehiclesCount > 0 ? `${vehiclesCount}+` : '0',
          rating: rating.toFixed(1),
          yearsInBusiness: yearsInBusiness > 0 ? `${yearsInBusiness}yrs` : 'New',
        },
      },
    });
  } catch (error) {
    console.error('Error fetching featured dealership:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured dealership',
        dealership: null,
      },
      { status: 500 }
    );
  }
}
