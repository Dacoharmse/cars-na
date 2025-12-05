import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 GET /api/dealer/vehicle-listings - Request received');
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'DEALER_PRINCIPAL' && session.user.role !== 'SALES_EXECUTIVE') {
      console.log('❌ Unauthorized:', session?.user?.role);
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Dealer access required.' },
        { status: 401 }
      );
    }

    console.log('👤 User:', session.user.email, 'Role:', session.user.role);

    // Get dealer's dealership
    const dealer = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        dealership: true,
      },
    });

    console.log('🏢 Dealership:', dealer?.dealership?.name, 'Region:', dealer?.dealership?.region);

    if (!dealer?.dealership) {
      return NextResponse.json(
        { success: false, error: 'No dealership associated with this account' },
        { status: 400 }
      );
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'APPROVED';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const region = searchParams.get('region');

    // Build filter conditions
    const where: any = {
      status: status,
    };

    // Only show listings in dealer's region OR listings with no region set
    if (dealer.dealership.region) {
      where.OR = [
        { region: dealer.dealership.region },
        { region: null },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (region) {
      where.region = region;
    }

    console.log('🔍 WHERE clause:', JSON.stringify(where, null, 2));

    // Fetch listings with dealer's interest status
    const listings = await prisma.userVehicleListing.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        interests: {
          where: {
            dealershipId: dealer.dealership.id,
          },
          select: {
            id: true,
            status: true,
            offerPrice: true,
            contacted: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            interests: true,
          },
        },
      },
    });

    console.log(`✅ Found ${listings.length} listing(s)`);

    return NextResponse.json({
      success: true,
      listings: listings.map(listing => ({
        ...listing,
        hasExpressedInterest: listing.interests.length > 0,
        dealerInterest: listing.interests[0] || null,
        totalInterests: listing._count.interests,
      })),
    });
  } catch (error) {
    console.error('Error fetching vehicle listings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
