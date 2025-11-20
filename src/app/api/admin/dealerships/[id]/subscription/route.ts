import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// UPDATE dealership subscription plan
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
    const { planId } = body;

    if (!planId) {
      return NextResponse.json(
        { success: false, error: 'Subscription plan ID is required' },
        { status: 400 }
      );
    }

    // Verify the subscription plan exists
    const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });

    if (!subscriptionPlan) {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription plan' },
        { status: 400 }
      );
    }

    // Check if dealership exists
    const dealership = await prisma.dealership.findUnique({
      where: { id },
      include: {
        subscription: true
      }
    });

    if (!dealership) {
      return NextResponse.json(
        { success: false, error: 'Dealership not found' },
        { status: 404 }
      );
    }

    console.log(`Admin ${session.user.email} updating subscription for dealership ${id} to plan ${subscriptionPlan.name}`);

    // Calculate new subscription dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + subscriptionPlan.duration);

    let updatedSubscription;

    if (dealership.subscription) {
      // Update existing subscription
      updatedSubscription = await prisma.dealershipSubscription.update({
        where: { id: dealership.subscription.id },
        data: {
          planId,
          startDate,
          endDate,
          nextPaymentDate: startDate,
          updatedAt: new Date()
        },
        include: {
          plan: true
        }
      });
    } else {
      // Create new subscription if none exists
      updatedSubscription = await prisma.dealershipSubscription.create({
        data: {
          dealershipId: id,
          planId,
          status: 'ACTIVE',
          startDate,
          endDate,
          nextPaymentDate: startDate,
          autoRenew: true,
          currentListings: 0,
          listingsUsed: 0,
          featuredListingsUsed: 0
        },
        include: {
          plan: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Subscription updated to ${subscriptionPlan.name} plan successfully`,
      subscription: updatedSubscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update subscription'
      },
      { status: 500 }
    );
  }
}
