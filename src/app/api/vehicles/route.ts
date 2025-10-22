import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/vehicles - Get all vehicles with filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;

    // Parse query parameters
    const limit = parseInt(searchParams.get('limit') || '20');
    const make = searchParams.get('make');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minYear = searchParams.get('minYear');
    const maxYear = searchParams.get('maxYear');
    const maxMileage = searchParams.get('maxMileage');
    const dealershipId = searchParams.get('dealershipId');
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const featured = searchParams.get('featured');
    const dealerPick = searchParams.get('dealerPick');
    const hasDiscount = searchParams.get('hasDiscount');
    const isNew = searchParams.get('isNew');
    const sortBy = searchParams.get('sortBy') || 'newest';

    // Build where clause
    const where: any = {};

    if (make) {
      where.make = { contains: make, mode: 'insensitive' };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minYear || maxYear) {
      where.year = {};
      if (minYear) where.year.gte = parseInt(minYear);
      if (maxYear) where.year.lte = parseInt(maxYear);
    }

    if (maxMileage) {
      where.mileage = { lte: parseInt(maxMileage) };
    }

    if (dealershipId) {
      where.dealershipId = dealershipId;
    }

    if (search) {
      where.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (location) {
      where.dealership = {
        OR: [
          { city: { contains: location, mode: 'insensitive' } },
          { region: { contains: location, mode: 'insensitive' } },
        ],
      };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (dealerPick === 'true') {
      where.dealerPick = true;
    }

    if (hasDiscount === 'true') {
      where.originalPrice = { gt: 0 };
    }

    if (isNew === 'true') {
      where.isNew = true;
    } else if (isNew === 'false') {
      where.isNew = false;
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    switch (sortBy) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'mileage':
        orderBy = { mileage: 'asc' };
        break;
      case 'year':
        orderBy = { year: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Query database
    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          dealership: true,
          images: {
            orderBy: { isPrimary: 'desc' },
          },
        },
        orderBy,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);

    return NextResponse.json({
      items: vehicles,
      total,
      nextCursor: vehicles.length === limit ? vehicles[vehicles.length - 1]?.id : undefined,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
