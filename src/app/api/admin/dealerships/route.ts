import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    // Fetch all dealerships from database with their user count and vehicle count
    const dealerships = await prisma.dealership.findMany({
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
          }
        },
        vehicles: {
          select: {
            id: true,
            status: true
          }
        },
        subscription: {
          include: {
            plan: true
          }
        },
        _count: {
          select: {
            users: true,
            vehicles: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match admin panel format
    const formattedDealerships = dealerships.map(dealership => {
      const activeListings = dealership.vehicles.filter(v => v.status === 'AVAILABLE').length;
      const totalListings = dealership._count.vehicles;
      const principalUser = dealership.users.find(u => u.role === 'DEALER_PRINCIPAL');

      return {
        id: dealership.id,
        name: dealership.name,
        email: dealership.email || principalUser?.email || '',
        phone: dealership.phone,
        address: dealership.streetAddress,
        city: dealership.city,
        region: dealership.region,
        status: dealership.status, // PENDING, APPROVED, SUSPENDED, REJECTED
        subscriptionPlan: dealership.subscription?.plan?.name || 'No Plan',
        subscriptionPlanId: dealership.subscription?.planId || null,
        subscriptionId: dealership.subscription?.id || null,
        subscriptionStatus: dealership.subscription?.status || 'NO_SUBSCRIPTION',
        monthlyFee: dealership.subscription?.plan?.price || 0,
        joinedAt: dealership.createdAt.toISOString(),
        lastLogin: null, // TODO: Track this
        activeListings,
        totalListings,
        maxListings: dealership.subscription?.plan?.maxListings || 0,
        totalSales: 0, // TODO: Track sales
        monthlyRevenue: 0, // TODO: Calculate revenue
        rating: 0, // TODO: Implement rating system
        verificationStatus: dealership.isVerified ? 'Verified' : dealership.status === 'PENDING' ? 'Pending' : 'Flagged',
        contactPerson: principalUser?.name || '',
        businessLicense: dealership.registrationNumber || '',
        taxNumber: dealership.taxNumber || '',
        website: dealership.website || '',
        businessType: dealership.businessType || '',
        postalCode: dealership.postalCode || '',
        alternatePhone: dealership.alternatePhone || '',
        googleMapsUrl: dealership.googleMapsUrl || ''
      };
    });

    return NextResponse.json({
      success: true,
      dealerships: formattedDealerships,
      total: dealerships.length,
      pending: dealerships.filter(d => d.status === 'PENDING').length,
      active: dealerships.filter(d => d.status === 'APPROVED').length,
      suspended: dealerships.filter(d => d.status === 'SUSPENDED').length
    });

  } catch (error) {
    console.error('Error fetching dealerships:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch dealerships'
      },
      { status: 500 }
    );
  }
}
