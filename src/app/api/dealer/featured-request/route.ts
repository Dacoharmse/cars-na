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

    const { duration, notes } = await request.json();

    // Pricing based on duration (in days) - in Namibian Dollars
    const pricing: { [key: number]: number } = {
      7: 50,    // N$50 for 7 days
      14: 90,   // N$90 for 14 days
      30: 150,  // N$150 for 30 days
      60: 250,  // N$250 for 60 days
    };

    const amount = pricing[duration as number];

    if (!amount) {
      return NextResponse.json(
        { success: false, error: 'Invalid duration' },
        { status: 400 }
      );
    }

    // Check if there's already an active or pending request
    const existingRequest = await prisma.featuredDealershipRequest.findFirst({
      where: {
        dealershipId: session.user.dealershipId,
        status: {
          in: ['PENDING', 'APPROVED', 'ACTIVE']
        }
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { success: false, error: 'You already have an active or pending featured request' },
        { status: 400 }
      );
    }

    // Create the featured request
    const featuredRequest = await prisma.featuredDealershipRequest.create({
      data: {
        dealershipId: session.user.dealershipId,
        duration,
        amount,
        notes: notes || null,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: {
        dealership: {
          select: {
            name: true,
            city: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      request: featuredRequest
    });
  } catch (error) {
    console.error('Error creating featured request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create featured request' },
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

    // Get all featured requests for this dealership
    const requests = await prisma.featuredDealershipRequest.findMany({
      where: {
        dealershipId: session.user.dealershipId
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
    console.error('Error fetching featured requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured requests' },
      { status: 500 }
    );
  }
}
