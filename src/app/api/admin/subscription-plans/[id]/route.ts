import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, price, duration, features, maxListings, maxPhotos, isActive } = body;

    // Update the subscription plan
    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: Math.round(price * 100) }), // Convert to cents
        ...(duration !== undefined && { duration }),
        ...(features && { features }),
        ...(maxListings !== undefined && { maxListings }),
        ...(maxPhotos !== undefined && { maxPhotos }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({
      success: true,
      plan: updatedPlan,
    });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update subscription plan' },
      { status: 500 }
    );
  }
}
