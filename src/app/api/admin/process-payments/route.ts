import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { paystack, convertNADToNGN, formatAmountForPaystack, generatePaymentReference } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dealershipIds } = body;

    if (!dealershipIds || !Array.isArray(dealershipIds) || dealershipIds.length === 0) {
      return NextResponse.json(
        { error: 'dealershipIds array is required.' },
        { status: 400 }
      );
    }

    // Get dealerships with their active subscriptions and plans
    const dealerships = await prisma.dealership.findMany({
      where: { id: { in: dealershipIds } },
      include: {
        subscription: {
          include: { plan: true },
        },
      },
    });

    if (dealerships.length === 0) {
      return NextResponse.json(
        { error: 'No valid dealerships found.' },
        { status: 400 }
      );
    }

    const processedPayments = [];
    const failedPayments = [];

    for (const dealership of dealerships) {
      try {
        const subscription = dealership.subscription;
        if (!subscription || !subscription.plan) {
          failedPayments.push({
            dealershipId: dealership.id,
            dealershipName: dealership.name,
            error: 'No active subscription found',
          });
          continue;
        }

        const amountNAD = subscription.plan.price;
        const amountNGN = convertNADToNGN(amountNAD);
        const amountKobo = formatAmountForPaystack(amountNGN, 'NGN');
        const reference = generatePaymentReference();

        // Initialize Paystack transaction
        const response = await paystack.transaction.initialize({
          email: dealership.email || '',
          amount: amountKobo,
          currency: 'NGN',
          reference,
          callback_url: `${process.env.NEXTAUTH_URL}/api/paystack/verify`,
          metadata: {
            dealershipId: dealership.id,
            planId: subscription.planId,
            currency: 'NAD',
            originalAmount: amountNAD,
          },
        });

        processedPayments.push({
          dealershipId: dealership.id,
          dealershipName: dealership.name,
          amount: amountNAD,
          reference,
          status: 'initiated',
          authorizationUrl: response?.data?.authorization_url || null,
        });

      } catch (error) {
        console.error(`Failed to process payment for ${dealership.name}:`, error);
        failedPayments.push({
          dealershipId: dealership.id,
          dealershipName: dealership.name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const totalAmount = processedPayments.reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({
      success: true,
      processed: processedPayments.length,
      failed: failedPayments.length,
      totalAmount,
      currency: 'NAD',
      details: { processedPayments, failedPayments },
      message: `Successfully initiated ${processedPayments.length} payment(s).${
        failedPayments.length > 0 ? ` ${failedPayments.length} failed.` : ''
      }`,
    });
  } catch (error) {
    console.error('Error processing payments:', error);
    return NextResponse.json(
      { error: 'Failed to process payments' },
      { status: 500 }
    );
  }
}
