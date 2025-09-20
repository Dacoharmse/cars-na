import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdate(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancellation(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSuccess(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailure(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const dealershipId = subscription.metadata.dealershipId;

  if (!dealershipId) {
    console.error('No dealershipId in subscription metadata');
    return;
  }

  const status = mapStripeStatusToOurs(subscription.status);

  await prisma.dealershipSubscription.update({
    where: { dealershipId },
    data: {
      status,
      nextPaymentDate: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    },
  });

  // Create notification
  await createNotification(dealershipId, 'PLAN_UPGRADED', subscription);
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const dealershipId = subscription.metadata.dealershipId;

  if (!dealershipId) {
    console.error('No dealershipId in subscription metadata');
    return;
  }

  await prisma.dealershipSubscription.update({
    where: { dealershipId },
    data: {
      status: 'CANCELLED',
      autoRenew: false,
    },
  });

  // Create notification
  await createNotification(dealershipId, 'PLAN_DOWNGRADED', subscription);
}

async function handlePaymentSuccess(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const dealershipId = subscription.metadata.dealershipId;

  if (!dealershipId) return;

  // Update subscription status
  await prisma.dealershipSubscription.update({
    where: { dealershipId },
    data: {
      status: 'ACTIVE',
      lastPaymentDate: new Date(),
      nextPaymentDate: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    },
  });

  // Create payment record
  await prisma.payment.create({
    data: {
      subscriptionId: dealershipId,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency.toUpperCase(),
      status: 'COMPLETED',
      paymentMethod: 'STRIPE',
      stripePaymentIntentId: invoice.payment_intent as string,
      description: `Payment for subscription`,
      paidAt: new Date(),
    },
  });

  // Create notification
  await createNotification(dealershipId, 'PAYMENT_DUE', subscription);
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const dealershipId = subscription.metadata.dealershipId;

  if (!dealershipId) return;

  // Update subscription status
  await prisma.dealershipSubscription.update({
    where: { dealershipId },
    data: {
      status: 'PAST_DUE',
    },
  });

  // Create payment record
  await prisma.payment.create({
    data: {
      subscriptionId: dealershipId,
      amount: invoice.amount_due / 100,
      currency: invoice.currency.toUpperCase(),
      status: 'FAILED',
      paymentMethod: 'STRIPE',
      stripePaymentIntentId: invoice.payment_intent as string,
      description: `Failed payment for subscription`,
      failedAt: new Date(),
    },
  });

  // Create notification
  await createNotification(dealershipId, 'PAYMENT_FAILED', subscription);
}

function mapStripeStatusToOurs(stripeStatus: string) {
  switch (stripeStatus) {
    case 'active':
      return 'ACTIVE';
    case 'canceled':
    case 'cancelled':
      return 'CANCELLED';
    case 'past_due':
      return 'PAST_DUE';
    case 'unpaid':
      return 'PENDING_PAYMENT';
    default:
      return 'SUSPENDED';
  }
}

async function createNotification(
  dealershipId: string,
  type: string,
  subscription: Stripe.Subscription
) {
  const notificationMessages = {
    PLAN_UPGRADED: 'Your subscription has been activated successfully!',
    PLAN_DOWNGRADED: 'Your subscription has been cancelled.',
    PAYMENT_DUE: 'Payment received successfully.',
    PAYMENT_FAILED: 'Payment failed. Please update your payment method.',
  };

  await prisma.subscriptionNotification.create({
    data: {
      dealershipId,
      type: type as any,
      title: `Subscription Update`,
      message: notificationMessages[type as keyof typeof notificationMessages] || 'Subscription updated',
    },
  });
}