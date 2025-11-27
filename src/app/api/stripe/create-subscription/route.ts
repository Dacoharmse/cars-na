import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Create Subscription API Route
 * NOTE: Stripe integration temporarily disabled
 * This endpoint will be updated when payment provider (DPO) is integrated
 */
export async function POST(req: NextRequest) {
  try {
    const { dealershipId, planId } = await req.json();

    if (!dealershipId || !planId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get dealership and plan details
    const [dealership, plan] = await Promise.all([
      prisma.dealership.findUnique({
        where: { id: dealershipId },
        include: { users: true }
      }),
      prisma.subscriptionPlan.findUnique({
        where: { id: planId }
      })
    ]);

    if (!dealership || !plan) {
      return NextResponse.json(
        { error: 'Dealership or plan not found' },
        { status: 404 }
      );
    }

    // Calculate end date
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    // Create or update dealership subscription
    // Payments will be handled manually until payment provider is integrated
    const subscription = await prisma.dealershipSubscription.upsert({
      where: { dealershipId },
      update: {
        planId: plan.id,
        endDate,
        status: 'PENDING_PAYMENT', // Admin will activate manually after payment
        autoRenew: false, // Disabled until payment provider is integrated
      },
      create: {
        dealershipId,
        planId: plan.id,
        endDate,
        status: 'PENDING_PAYMENT',
        autoRenew: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Subscription created. Please contact admin for payment details.',
      subscription: {
        id: subscription.id,
        planId: subscription.planId,
        status: subscription.status,
        endDate: subscription.endDate,
      }
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
