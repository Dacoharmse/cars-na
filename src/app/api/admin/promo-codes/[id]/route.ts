import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH - Update promo code
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      code,
      discountType,
      discountValue,
      startDate,
      endDate,
      usageLimit,
      isActive,
      applicablePlans,
    } = body;

    // Check if code is being changed and if it conflicts with existing
    if (code) {
      const existing = await prisma.promoCode.findFirst({
        where: {
          code: code.toUpperCase(),
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Promo code already exists' },
          { status: 400 }
        );
      }
    }

    // Update the promo code
    const promoCode = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(code && { code: code.toUpperCase() }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: parseFloat(discountValue) }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(usageLimit !== undefined && { usageLimit: usageLimit ? parseInt(usageLimit) : null }),
        ...(isActive !== undefined && { isActive }),
        ...(applicablePlans && { applicablePlans }),
      },
    });

    return NextResponse.json({
      success: true,
      promoCode,
    });
  } catch (error) {
    console.error('Error updating promo code:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to update promo code' },
      { status: 500 }
    );
  }
}

// DELETE - Delete promo code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.promoCode.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting promo code:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete promo code' },
      { status: 500 }
    );
  }
}
