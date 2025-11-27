import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Payment Webhook API Route
 * NOTE: Stripe integration temporarily disabled
 * This endpoint will be updated when payment provider (DPO) is integrated
 *
 * For now, this endpoint returns a placeholder response
 * When DPO is integrated, update this to handle DPO webhooks
 */
export async function POST(req: NextRequest) {
  try {
    // TODO: Implement DPO webhook handling here
    // For now, return a success response

    return NextResponse.json({
      received: true,
      message: 'Payment provider not configured. This endpoint will be activated when DPO is integrated.'
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to create subscription notifications
 * Kept for when payment provider is integrated
 */
async function createNotification(
  dealershipId: string,
  type: 'PLAN_UPGRADED' | 'PLAN_DOWNGRADED' | 'PAYMENT_DUE' | 'PAYMENT_FAILED',
  message: string
) {
  const notificationTitles = {
    PLAN_UPGRADED: 'Subscription Activated',
    PLAN_DOWNGRADED: 'Subscription Cancelled',
    PAYMENT_DUE: 'Payment Received',
    PAYMENT_FAILED: 'Payment Failed',
  };

  await prisma.subscriptionNotification.create({
    data: {
      dealershipId,
      type,
      title: notificationTitles[type],
      message,
    },
  });
}
