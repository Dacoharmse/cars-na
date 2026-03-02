import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/admin/invoices/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        dealership: {
          select: { id: true, name: true, email: true, contactPerson: true, city: true, region: true },
        },
        paidBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

// PATCH /api/admin/invoices/[id] — mark as paid or cancel
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action } = body; // 'mark-paid' | 'cancel'

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        dealership: {
          include: {
            users: {
              where: { role: 'DEALER_PRINCIPAL' },
              select: { id: true, email: true, name: true },
            },
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (action === 'mark-paid') {
      if (invoice.status === 'PAID') {
        return NextResponse.json({ error: 'Invoice is already marked as paid' }, { status: 400 });
      }

      // Mark invoice as paid
      const updated = await prisma.invoice.update({
        where: { id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          paidById: session.user.id,
        },
      });

      // Clear access restriction on dealership
      await prisma.dealership.update({
        where: { id: invoice.dealershipId },
        data: {
          accessRestrictedAt: null,
          // Restore APPROVED status if it was SUSPENDED due to invoice
          ...(invoice.dealership.status === 'SUSPENDED' ? { status: 'APPROVED' } : {}),
        },
      });

      // Notify dealer principal
      for (const user of invoice.dealership.users) {
        await prisma.notification.create({
          data: {
            userId: user.id,
            type: 'INVOICE_PAID',
            title: 'Invoice Marked as Paid',
            message: `Invoice ${invoice.invoiceNumber} has been marked as paid. Your account access has been fully restored. Thank you!`,
            link: '/dealer/invoices',
            metadata: { invoiceId: id, invoiceNumber: invoice.invoiceNumber },
          },
        });
      }

      return NextResponse.json({ success: true, invoice: updated });
    }

    if (action === 'cancel') {
      const updated = await prisma.invoice.update({
        where: { id },
        data: { status: 'CANCELLED' },
      });
      return NextResponse.json({ success: true, invoice: updated });
    }

    return NextResponse.json({ error: 'Invalid action. Use mark-paid or cancel.' }, { status: 400 });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}
