import { NextRequest, NextResponse } from 'next/server';
import { paystack, formatAmountForPaystack, convertNADToNGN } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { dealershipId, planId, email } = await req.json();

    if (!dealershipId || !planId || !email) {
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

    // Convert NAD to NGN for Paystack
    const amountInNGN = convertNADToNGN(plan.price);
    const amountInKobo = formatAmountForPaystack(amountInNGN, 'NGN');

    try {
      // Create or get Paystack customer
      let customer;
      const existingSubscription = await prisma.dealershipSubscription.findUnique({
        where: { dealershipId },
      });

      if (existingSubscription?.paystackCustomerId) {
        // Fetch existing customer
        try {
          customer = await paystack.customer.fetch(existingSubscription.paystackCustomerId);
        } catch (error) {
          console.warn('Could not fetch existing customer, creating new one');
          customer = null;
        }
      }

      if (!customer) {
        // Create new customer
        const customerResponse = await paystack.customer.create({
          email: email,
          first_name: dealership.name.split(' ')[0] || 'Dealership',
          last_name: dealership.name.split(' ').slice(1).join(' ') || 'Owner',
          phone: dealership.phone || '',
          metadata: {
            dealershipId: dealership.id,
            dealershipName: dealership.name,
          },
        });
        customer = customerResponse.data;
      }

      // Create Paystack plan if it doesn't exist
      let paystackPlan;
      try {
        paystackPlan = await paystack.plan.fetch(plan.slug);
      } catch (error) {
        // Plan doesn't exist, create it
        const planResponse = await paystack.plan.create({
          name: plan.name,
          interval: 'monthly',
          amount: amountInKobo,
          currency: 'NGN',
          description: plan.description || `${plan.name} subscription plan`,
          send_invoices: true,
          send_sms: false,
          hosted_page: false,
          metadata: {
            planId: plan.id,
            currency: 'NAD',
            originalAmount: plan.price,
          },
        });
        paystackPlan = planResponse.data;
      }

      // Create subscription
      const subscriptionResponse = await paystack.subscription.create({
        customer: customer.customer_code,
        plan: paystackPlan.plan_code,
        authorization: undefined, // Will be set during payment
        start_date: new Date().toISOString(),
        metadata: {
          dealershipId: dealership.id,
          planId: plan.id,
          currency: 'NAD',
          originalAmount: plan.price,
        },
      });

      const subscription = subscriptionResponse.data;

      // Calculate end date
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + plan.duration);

      // Create or update dealership subscription
      await prisma.dealershipSubscription.upsert({
        where: { dealershipId },
        update: {
          planId: plan.id,
          paystackCustomerId: customer.customer_code,
          paystackSubscriptionId: subscription.subscription_code,
          endDate,
          status: 'PENDING_PAYMENT',
          autoRenew: true,
        },
        create: {
          dealershipId,
          planId: plan.id,
          paystackCustomerId: customer.customer_code,
          paystackSubscriptionId: subscription.subscription_code,
          endDate,
          status: 'PENDING_PAYMENT',
          autoRenew: true,
        },
      });

      // Return payment initialization data
      return NextResponse.json({
        subscriptionId: subscription.subscription_code,
        paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        customer: {
          email: customer.email,
          customerCode: customer.customer_code,
        },
        amount: amountInKobo,
        currency: 'NGN',
        planCode: paystackPlan.plan_code,
        metadata: {
          dealershipId: dealership.id,
          planId: plan.id,
          subscriptionType: 'recurring',
        },
      });
    } catch (paystackError: any) {
      console.error('Paystack API error:', paystackError);

      // Handle specific Paystack errors
      if (paystackError.message?.includes('customer already exists')) {
        return NextResponse.json(
          { error: 'Customer with this email already exists. Please use a different email.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: paystackError.message || 'Failed to create subscription with Paystack' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

// Additional endpoint for handling one-time payments
export async function PUT(req: NextRequest) {
  try {
    const { dealershipId, planId, email, paymentReference } = await req.json();

    if (!dealershipId || !planId || !email || !paymentReference) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify the payment with Paystack
    const verificationResponse = await paystack.transaction.verify(paymentReference);

    if (!verificationResponse.data || verificationResponse.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const paymentData = verificationResponse.data;

    // Get plan details
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      );
    }

    // Calculate end date
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    // Create or update dealership subscription
    await prisma.dealershipSubscription.upsert({
      where: { dealershipId },
      update: {
        planId: plan.id,
        status: 'ACTIVE',
        lastPaymentDate: new Date(),
        endDate,
        autoRenew: false, // One-time payment, no auto-renew
      },
      create: {
        dealershipId,
        planId: plan.id,
        status: 'ACTIVE',
        lastPaymentDate: new Date(),
        endDate,
        autoRenew: false,
      },
    });

    // Create payment record
    const subscription = await prisma.dealershipSubscription.findUnique({
      where: { dealershipId },
    });

    if (subscription) {
      await prisma.payment.create({
        data: {
          subscriptionId: subscription.id,
          amount: paymentData.amount / 100, // Convert from kobo
          currency: paymentData.currency.toUpperCase(),
          status: 'COMPLETED',
          paymentMethod: 'PAYSTACK',
          paystackPaymentId: paymentReference,
          description: `One-time payment for ${plan.name}`,
          paidAt: new Date(),
          metadata: {
            paystackReference: paymentReference,
            customerEmail: email,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Subscription activated successfully',
      subscriptionId: subscription?.id,
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}