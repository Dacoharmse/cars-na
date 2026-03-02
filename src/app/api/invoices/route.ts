import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/invoices — dealer's own invoices
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.user.role !== 'DEALER_PRINCIPAL' && session.user.role !== 'SALES_EXECUTIVE') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const dealershipId = session.user.dealershipId;
    if (!dealershipId) {
      return NextResponse.json({ error: 'No dealership associated with this account' }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const unpaidOnly = searchParams.get('unpaidOnly') === 'true';

    const where: any = { dealershipId };
    if (unpaidOnly) where.status = { in: ['PENDING', 'OVERDUE'] };

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        invoiceNumber: true,
        billingMonth: true,
        billingYear: true,
        subscriptionAmount: true,
        stockValue: true,
        stockFeeAmount: true,
        totalAmount: true,
        currency: true,
        planName: true,
        vehicleCount: true,
        status: true,
        dueDate: true,
        paidAt: true,
        pdfPath: true,
        sentAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ invoices });
  } catch (error) {
    console.error('Error fetching dealer invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}
