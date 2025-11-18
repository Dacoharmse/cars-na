import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [
      'businessName',
      'businessType',
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

    // Create dealership and user in a transaction
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

      return { dealership, user };
    });

    // TODO: Send verification email
    // For now, we'll just return success
    console.log('New dealership registration:', {
      dealershipId: result.dealership.id,
      dealershipName: result.dealership.name,
      userId: result.user.id,
      userEmail: result.user.email
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Your application is pending admin approval. You will receive an email once approved.',
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
