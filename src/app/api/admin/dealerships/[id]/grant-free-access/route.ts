import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { addMonths } from 'date-fns';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { months } = await request.json();

    if (!months || months < 1 || months > 24) {
      return NextResponse.json({ success: false, error: 'Months must be between 1 and 24' }, { status: 400 });
    }

    const dealership = await prisma.dealership.findUnique({
      where: { id },
      include: { subscription: true },
    });

    if (!dealership) {
      return NextResponse.json({ success: false, error: 'Dealership not found' }, { status: 404 });
    }

    const now = new Date();
    const baseDate = dealership.subscription?.endDate && dealership.subscription.endDate > now
      ? dealership.subscription.endDate
      : now;
    const newEndDate = addMonths(baseDate, months);

    await prisma.$transaction(async (tx) => {
      // Lift access restriction
      await tx.dealership.update({
        where: { id },
        data: {
          accessRestrictedAt: null,
          status: dealership.status === 'SUSPENDED' ? 'APPROVED' : dealership.status,
        },
      });

      // Extend or create subscription
      if (dealership.subscription) {
        await tx.dealershipSubscription.update({
          where: { id: dealership.subscription.id },
          data: {
            endDate: newEndDate,
            status: 'ACTIVE',
            nextPaymentDate: newEndDate,
            updatedAt: now,
          },
        });
      }

      // Cancel any outstanding overdue/pending invoices
      await tx.invoice.updateMany({
        where: {
          dealershipId: id,
          status: { in: ['PENDING', 'OVERDUE'] },
        },
        data: { status: 'CANCELLED' },
      });

      // Notify dealer principal
      const users = await tx.user.findMany({
        where: { dealershipId: id, role: 'DEALER_PRINCIPAL' },
        select: { id: true },
      });
      for (const user of users) {
        await tx.notification.create({
          data: {
            userId: user.id,
            type: 'GENERAL',
            title: `${months} Free Month${months > 1 ? 's' : ''} Granted`,
            message: `Your subscription has been extended by ${months} month${months > 1 ? 's' : ''} complimentary. Your access has been fully restored. Thank you for being a valued partner!`,
            link: '/dealer/dashboard',
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: `Granted ${months} free month(s) and lifted restriction for ${dealership.name}`,
      newEndDate,
    });
  } catch (error) {
    console.error('Error granting free access:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to grant free access' },
      { status: 500 }
    );
  }
}
