import { NextRequest, NextResponse } from 'next/server';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { dealershipId, planId, priceId } = await req.json();

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

    // Create or get Stripe customer
    let customerId = dealership.subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        name: dealership.name,
        email: dealership.users[0]?.email,
        metadata: {
          dealershipId: dealership.id,
        },
      });
      customerId = customer.id;
    }

    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
        },
      ],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        dealershipId: dealership.id,
        planId: plan.id,
      },
    });

    // Calculate end date
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    // Create or update dealership subscription
    await prisma.dealershipSubscription.upsert({
      where: { dealershipId },
      update: {
        planId: plan.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        endDate,
        status: 'PENDING_PAYMENT',
        autoRenew: true,
      },
      create: {
        dealershipId,
        planId: plan.id,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        endDate,
        status: 'PENDING_PAYMENT',
        autoRenew: true,
      },
    });

    const invoice = subscription.latest_invoice as any;
    const paymentIntent = invoice.payment_intent;

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}