import { NextRequest, NextResponse } from 'next/server';
import { paystack } from '@/lib/paystack';

// Mock data - in production, this would come from the database
const DEALERS_DATA = [
  {
    id: 'dealer-001',
    name: 'Premium Motors Namibia',
    email: 'info@premiummotors.na',
    subscriptionPlan: 'Professional',
    monthlyFee: 49900, // N$499.00 in cents
  },
  {
    id: 'dealer-002',
    name: 'Auto Palace',
    email: 'sales@autopalace.na',
    subscriptionPlan: 'Basic',
    monthlyFee: 19900, // N$199.00 in cents
  },
  {
    id: 'dealer-003',
    name: 'Elite Autos Namibia',
    email: 'contact@eliteautos.na',
    subscriptionPlan: 'Professional',
    monthlyFee: 49900, // N$499.00 in cents
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentIds } = body;

    // Validate input
    if (!paymentIds || !Array.isArray(paymentIds)) {
      return NextResponse.json(
        { error: 'Invalid request. Payment IDs are required.' },
        { status: 400 }
      );
    }

    if (paymentIds.length === 0) {
      return NextResponse.json(
        { error: 'No payments selected.' },
        { status: 400 }
      );
    }

    // Get dealer information for selected payments
    const selectedDealers = DEALERS_DATA.filter(dealer =>
      paymentIds.includes(dealer.id)
    );

    if (selectedDealers.length === 0) {
      return NextResponse.json(
        { error: 'No valid dealers found for the selected payment IDs.' },
        { status: 400 }
      );
    }

    // Process each payment
    const processedPayments = [];
    const failedPayments = [];

    for (const dealer of selectedDealers) {
      try {
        // In a real application with Paystack:
        // 1. Create a charge/transaction using Paystack API
        // 2. Send payment link to dealer email
        // 3. Update payment status in database
        // 4. Send confirmation email

        // For now, we'll simulate the payment processing
        const paymentReference = `PMT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Simulate Paystack payment initialization
        // const response = await paystack.transaction.initialize({
        //   email: dealer.email,
        //   amount: dealer.monthlyFee, // Amount in kobo/cents
        //   currency: 'NGN', // Paystack primarily supports NGN
        //   reference: paymentReference,
        //   callback_url: `${process.env.NEXTAUTH_URL}/api/paystack/verify`,
        // });

        processedPayments.push({
          dealerId: dealer.id,
          dealerName: dealer.name,
          amount: dealer.monthlyFee,
          reference: paymentReference,
          status: 'initiated',
        });

        // In production, send payment notification email to dealer
        console.log(`Payment initiated for ${dealer.name}: ${paymentReference}`);

      } catch (error) {
        console.error(`Failed to process payment for ${dealer.name}:`, error);
        failedPayments.push({
          dealerId: dealer.id,
          dealerName: dealer.name,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    // Calculate total amount processed
    const totalAmount = processedPayments.reduce((sum, payment) => sum + payment.amount, 0);

    return NextResponse.json({
      success: true,
      processed: processedPayments.length,
      failed: failedPayments.length,
      totalAmount: totalAmount / 100, // Convert back to main currency unit
      details: {
        processedPayments,
        failedPayments,
      },
      message: `Successfully initiated ${processedPayments.length} payment(s). ${
        failedPayments.length > 0 ? `${failedPayments.length} payment(s) failed.` : ''
      }`,
    });
  } catch (error) {
    console.error('Error processing payments:', error);
    return NextResponse.json(
      {
        error: 'Failed to process payments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
