import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.dealershipId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { vehicleId, duration, notes } = await request.json();

    if (!vehicleId) {
      return NextResponse.json(
        { success: false, error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    // Verify the vehicle belongs to the dealership
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    });

    if (!vehicle || vehicle.dealershipId !== session.user.dealershipId) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found or access denied' },
        { status: 404 }
      );
    }

    // Pricing based on duration (in days) - in Namibian Dollars
    const pricing: { [key: number]: number } = {
      7: 25,    // N$25 for 7 days
      14: 45,   // N$45 for 14 days
      30: 75,   // N$75 for 30 days
      60: 125,  // N$125 for 60 days
    };

    const amount = pricing[duration as number];

    if (!amount) {
      return NextResponse.json(
        { success: false, error: 'Invalid duration' },
        { status: 400 }
      );
    }

    // Check if there's already an active or pending request for this vehicle
    const existingRequest = await prisma.featuredListingRequest.findFirst({
      where: {
        vehicleId,
        status: {
          in: ['PENDING', 'APPROVED', 'ACTIVE']
        }
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: 'This vehicle already has an active or pending featured request' },
        { status: 400 }
      );
    }

    // Create the featured listing request
    const featuredRequest = await prisma.featuredListingRequest.create({
      data: {
        vehicleId,
        dealershipId: session.user.dealershipId,
        duration,
        amount,
        notes: notes || null,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
            price: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      request: featuredRequest
    });
  } catch (error) {
    console.error('Error creating featured listing request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create featured listing request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.dealershipId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all featured listing requests for this dealership
    const requests = await prisma.featuredListingRequest.findMany({
      where: {
        dealershipId: session.user.dealershipId
      },
      include: {
        vehicle: {
          select: {
            make: true,
            model: true,
            year: true,
            price: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      requests
    });
  } catch (error) {
    console.error('Error fetching featured listing requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured listing requests' },
      { status: 500 }
    );
  }
}
