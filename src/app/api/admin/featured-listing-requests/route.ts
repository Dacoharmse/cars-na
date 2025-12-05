import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all featured listing requests with vehicle and dealership info
    const requests = await prisma.featuredListingRequest.findMany({
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
            status: true,
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        },
        dealership: {
          select: {
            id: true,
            name: true,
            city: true,
            email: true,
            phone: true,
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

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { requestId, action, rejectionReason } = await request.json();

    if (!requestId || !action) {
      return NextResponse.json(
        { success: false, error: 'Request ID and action are required' },
        { status: 400 }
      );
    }

    const featuredRequest = await prisma.featuredListingRequest.findUnique({
      where: { id: requestId },
      include: { vehicle: true }
    });

    if (!featuredRequest) {
      return NextResponse.json(
        { success: false, error: 'Request not found' },
        { status: 404 }
      );
    }

    if (action === 'approve') {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + featuredRequest.duration);

      // Update the request and set the vehicle as featured
      const [updated, _] = await prisma.$transaction([
        prisma.featuredListingRequest.update({
          where: { id: requestId },
          data: {
            status: 'ACTIVE',
            approvedAt: new Date(),
            approvedBy: session.user.id,
            startDate,
            endDate,
            paymentStatus: 'PAID' // In a real app, this would be handled by payment processing
          }
        }),
        prisma.vehicle.update({
          where: { id: featuredRequest.vehicleId },
          data: {
            featured: true
          }
        })
      ]);

      return NextResponse.json({
        success: true,
        request: updated
      });
    } else if (action === 'reject') {
      const updated = await prisma.featuredListingRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          rejectedAt: new Date(),
          rejectedBy: session.user.id,
          rejectionReason: rejectionReason || null
        }
      });

      return NextResponse.json({
        success: true,
        request: updated
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating featured listing request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update featured listing request' },
      { status: 500 }
    );
  }
}
