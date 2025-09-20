import { NextRequest, NextResponse } from 'next/server';
import { paystack } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const webhookSecret = process.env.PAYSTACK_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature');

    // Verify webhook signature
    if (!signature || !verifyPaystackSignature(body, signature, webhookSecret)) {
      console.error('Paystack webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case 'subscription.create':
      case 'subscription.enable': {
        await handleSubscriptionActivation(event.data);
        break;
      }

      case 'subscription.disable': {
        await handleSubscriptionCancellation(event.data);
        break;
      }

      case 'charge.success': {
        await handlePaymentSuccess(event.data);
        break;
      }

      case 'charge.failed': {
        await handlePaymentFailure(event.data);
        break;
      }

      case 'invoice.create':
      case 'invoice.update': {
        await handleInvoiceUpdate(event.data);
        break;
      }

      case 'invoice.payment_failed': {
        await handleInvoicePaymentFailure(event.data);
        break;
      }

      default:
        console.log(`Unhandled Paystack event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

function verifyPaystackSignature(body: string, signature: string, secret: string): boolean {
  const hash = crypto
    .createHmac('sha512', secret)
    .update(body, 'utf8')
    .digest('hex');
  return hash === signature;
}

async function handleSubscriptionActivation(subscriptionData: any) {
  const { customer, subscription_code, plan, metadata } = subscriptionData;
  const dealershipId = metadata?.dealershipId;

  if (!dealershipId) {
    console.error('No dealershipId in subscription metadata');
    return;
  }

  // Find the subscription plan
  const subscriptionPlan = await prisma.subscriptionPlan.findFirst({
    where: { slug: plan.plan_code },
  });

  if (!subscriptionPlan) {
    console.error(`Subscription plan not found for code: ${plan.plan_code}`);
    return;
  }

  // Update or create dealership subscription
  await prisma.dealershipSubscription.upsert({
    where: { dealershipId },
    update: {
      status: 'ACTIVE',
      paystackCustomerId: customer.customer_code,
      paystackSubscriptionId: subscription_code,
      nextPaymentDate: subscriptionData.next_payment_date
        ? new Date(subscriptionData.next_payment_date)
        : null,
    },
    create: {
      dealershipId,
      planId: subscriptionPlan.id,
      status: 'ACTIVE',
      paystackCustomerId: customer.customer_code,
      paystackSubscriptionId: subscription_code,
      startDate: new Date(),
      endDate: subscriptionData.next_payment_date
        ? new Date(subscriptionData.next_payment_date)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      nextPaymentDate: subscriptionData.next_payment_date
        ? new Date(subscriptionData.next_payment_date)
        : null,
    },
  });

  // Create notification
  await createNotification(dealershipId, 'PLAN_UPGRADED', subscriptionData);
}

async function handleSubscriptionCancellation(subscriptionData: any) {
  const { metadata, subscription_code } = subscriptionData;
  const dealershipId = metadata?.dealershipId;

  if (!dealershipId) {
    // Try to find by subscription code
    const subscription = await prisma.dealershipSubscription.findFirst({
      where: { paystackSubscriptionId: subscription_code },
    });

    if (!subscription) {
      console.error('No dealership found for subscription cancellation');
      return;
    }
  }

  await prisma.dealershipSubscription.update({
    where: dealershipId ? { dealershipId } : { paystackSubscriptionId: subscription_code },
    data: {
      status: 'CANCELLED',
      autoRenew: false,
    },
  });

  // Create notification
  if (dealershipId) {
    await createNotification(dealershipId, 'PLAN_DOWNGRADED', subscriptionData);
  }
}

async function handlePaymentSuccess(paymentData: any) {
  const { customer, amount, currency, reference, metadata } = paymentData;
  const dealershipId = metadata?.dealershipId;

  if (!dealershipId) {
    console.error('No dealershipId in payment metadata');
    return;
  }

  // Find the subscription
  const subscription = await prisma.dealershipSubscription.findUnique({
    where: { dealershipId },
  });

  if (!subscription) {
    console.error(`No subscription found for dealership: ${dealershipId}`);
    return;
  }

  // Update subscription status
  await prisma.dealershipSubscription.update({
    where: { dealershipId },
    data: {
      status: 'ACTIVE',
      lastPaymentDate: new Date(),
      nextPaymentDate: paymentData.paid_at
        ? new Date(new Date(paymentData.paid_at).getTime() + 30 * 24 * 60 * 60 * 1000)
        : null,
    },
  });

  // Create payment record
  await prisma.payment.create({
    data: {
      subscriptionId: subscription.id,
      amount: amount / 100, // Paystack amounts are in kobo
      currency: currency.toUpperCase(),
      status: 'COMPLETED',
      paymentMethod: 'PAYSTACK',
      paystackPaymentId: reference,
      description: `Payment for subscription`,
      paidAt: new Date(),
      metadata: {
        paystackReference: reference,
        customerCode: customer.customer_code,
      },
    },
  });

  // Create notification
  await createNotification(dealershipId, 'PAYMENT_SUCCESS', paymentData);
}

async function handlePaymentFailure(paymentData: any) {
  const { customer, amount, currency, reference, metadata } = paymentData;
  const dealershipId = metadata?.dealershipId;

  if (!dealershipId) {
    console.error('No dealershipId in failed payment metadata');
    return;
  }

  // Find the subscription
  const subscription = await prisma.dealershipSubscription.findUnique({
    where: { dealershipId },
  });

  if (!subscription) {
    console.error(`No subscription found for dealership: ${dealershipId}`);
    return;
  }

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
      subscriptionId: subscription.id,
      amount: amount / 100, // Paystack amounts are in kobo
      currency: currency.toUpperCase(),
      status: 'FAILED',
      paymentMethod: 'PAYSTACK',
      paystackPaymentId: reference,
      description: `Failed payment for subscription`,
      failedAt: new Date(),
      metadata: {
        paystackReference: reference,
        customerCode: customer.customer_code,
        failureReason: paymentData.gateway_response || 'Unknown error',
      },
    },
  });

  // Create notification
  await createNotification(dealershipId, 'PAYMENT_FAILED', paymentData);
}

async function handleInvoiceUpdate(invoiceData: any) {
  // Handle invoice creation and updates
  const { customer, amount, currency, subscription, metadata } = invoiceData;
  const dealershipId = metadata?.dealershipId;

  if (!dealershipId) {
    console.error('No dealershipId in invoice metadata');
    return;
  }

  // You can implement invoice tracking here if needed
  console.log(`Invoice updated for dealership: ${dealershipId}`);
}

async function handleInvoicePaymentFailure(invoiceData: any) {
  const { customer, metadata } = invoiceData;
  const dealershipId = metadata?.dealershipId;

  if (!dealershipId) {
    console.error('No dealershipId in invoice payment failure metadata');
    return;
  }

  // Create notification
  await createNotification(dealershipId, 'PAYMENT_FAILED', invoiceData);
}

async function createNotification(
  dealershipId: string,
  type: string,
  data: any
) {
  const notificationMessages = {
    PLAN_UPGRADED: 'Your subscription has been activated successfully!',
    PLAN_DOWNGRADED: 'Your subscription has been cancelled.',
    PAYMENT_SUCCESS: 'Payment received successfully.',
    PAYMENT_FAILED: 'Payment failed. Please update your payment method.',
  };

  try {
    await prisma.subscriptionNotification.create({
      data: {
        dealershipId,
        type: type as any,
        title: 'Subscription Update',
        message: notificationMessages[type as keyof typeof notificationMessages] || 'Subscription updated',
        metadata: data,
      },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}