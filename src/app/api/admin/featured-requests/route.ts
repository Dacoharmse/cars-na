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

    // Get all featured requests with dealership info
    const requests = await prisma.featuredDealershipRequest.findMany({
      include: {
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
    console.error('Error fetching featured requests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured requests' },
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

    const featuredRequest = await prisma.featuredDealershipRequest.findUnique({
      where: { id: requestId }
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

      const updated = await prisma.featuredDealershipRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          approvedAt: new Date(),
          approvedBy: (session.user as any).id || session.user.email,
          startDate,
          endDate,
          paymentStatus: 'COMPLETED' // In a real app, this would be handled by payment processing
        }
      });

      // Update dealership to featured status
      await prisma.dealership.update({
        where: { id: featuredRequest.dealershipId },
        data: { isFeatured: true }
      });

      return NextResponse.json({
        success: true,
        request: updated
      });
    } else if (action === 'reject') {
      const updated = await prisma.featuredDealershipRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          rejectedAt: new Date(),
          rejectedBy: (session.user as any).id || session.user.email,
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
    console.error('Error updating featured request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update featured request' },
      { status: 500 }
    );
  }
}
