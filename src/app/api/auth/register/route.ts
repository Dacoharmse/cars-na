import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'businessName',
      'businessType',
      'subscriptionPlanId',
      'email',
      'phone',
      'contactPerson',
      'streetAddress',
      'city',
      'region',
      'password',
      'agreeToTerms'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate subscription plan exists
    const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: { id: data.subscriptionPlanId }
    });

    if (!subscriptionPlan) {
      return NextResponse.json(
        { error: 'Invalid subscription plan selected' },
        { status: 400 }
      );
    }

    // Validate password match
    if (data.password !== data.confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    // Validate terms agreement
    if (!data.agreeToTerms) {
      return NextResponse.json(
        { error: 'You must agree to the terms and conditions' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if dealership name already exists
    const existingDealership = await prisma.dealership.findFirst({
      where: { name: data.businessName }
    });

    if (existingDealership) {
      return NextResponse.json(
        { error: 'Business name already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create dealership, user, and subscription in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create dealership
      const dealership = await tx.dealership.create({
        data: {
          name: data.businessName,
          businessType: data.businessType,
          registrationNumber: data.registrationNumber || null,
          taxNumber: data.taxNumber || null,
          streetAddress: data.streetAddress,
          city: data.city,
          region: data.region,
          postalCode: data.postalCode || null,
          phone: data.phone,
          alternatePhone: data.alternatePhone || null,
          email: data.email,
          googleMapsUrl: data.googleMapsUrl || null,
          status: 'PENDING', // Dealership needs admin approval
          isVerified: false
        }
      });

      // Create user (dealer principal)
      const user = await tx.user.create({
        data: {
          name: data.contactPerson,
          email: data.email,
          password: hashedPassword,
          role: 'DEALER_PRINCIPAL',
          dealershipId: dealership.id,
          status: 'PENDING', // User account pending until email verified
          isActive: false // Inactive until verified
        }
      });

      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + subscriptionPlan.duration);

      // Create subscription
      const subscription = await tx.dealershipSubscription.create({
        data: {
          dealershipId: dealership.id,
          planId: data.subscriptionPlanId,
          status: 'PENDING_PAYMENT', // Pending until first payment is made
          startDate,
          endDate,
          nextPaymentDate: startDate,
          autoRenew: true,
          currentListings: 0,
          listingsUsed: 0,
          featuredListingsUsed: 0
        }
      });

      return { dealership, user, subscription };
    });

    // Send email notifications
    try {
      // Send notification to admin about new dealer registration
      await emailService.sendAdminNewDealerNotification({
        dealershipName: result.dealership.name,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,
        city: data.city,
        region: data.region,
        businessType: data.businessType,
        subscriptionPlan: subscriptionPlan.name,
        dealershipId: result.dealership.id,
      });

      // Send confirmation email to the dealer
      await emailService.sendDealerRegistrationConfirmation({
        name: data.contactPerson,
        email: data.email,
        dealershipName: result.dealership.name,
        subscriptionPlan: subscriptionPlan.name,
      });

      console.log('Registration emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send registration emails:', emailError);
      // Continue even if emails fail - registration was successful
    }

    console.log('New dealership registration:', {
      dealershipId: result.dealership.id,
      dealershipName: result.dealership.name,
      userId: result.user.id,
      userEmail: result.user.email,
      subscriptionId: result.subscription.id,
      subscriptionPlan: subscriptionPlan.name
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Your application is pending admin approval. Check your email for further details.',
      dealershipId: result.dealership.id
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);

    // Return a proper JSON error response
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Registration failed. Please try again.'
      },
      { status: 500 }
    );
  }
}
