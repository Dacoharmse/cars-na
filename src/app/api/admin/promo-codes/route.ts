import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch all promo codes
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      promoCodes,
    });
  } catch (error) {
    console.error('Error fetching promo codes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch promo codes' },
      { status: 500 }
    );
  }
}

// POST - Create new promo code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      code,
      discountType,
      discountValue,
      startDate,
      endDate,
      usageLimit,
      applicablePlans,
    } = body;

    // Validate required fields
    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if promo code already exists
    const existing = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Promo code already exists' },
        { status: 400 }
      );
    }

    // Create the promo code
    const promoCode = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        applicablePlans: applicablePlans || [],
        createdBy: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      promoCode,
    });
  } catch (error) {
    console.error('Error creating promo code:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to create promo code' },
      { status: 500 }
    );
  }
}
