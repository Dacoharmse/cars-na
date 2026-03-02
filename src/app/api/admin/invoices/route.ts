import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateMonthlyInvoices } from '@/lib/invoice-generator';

// GET /api/admin/invoices — list all invoices
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const month = searchParams.get('month') ? parseInt(searchParams.get('month')!) : undefined;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const rawPage = parseInt(searchParams.get('page') || '1');
    const rawLimit = parseInt(searchParams.get('limit') || '50');
    const page = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const limit = isNaN(rawLimit) ? 50 : Math.min(Math.max(rawLimit, 1), 100);

    const where: any = {};
    if (status) where.status = status;
    if (month) where.billingMonth = month;
    if (year) where.billingYear = year;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          dealership: {
            select: { id: true, name: true, email: true, contactPerson: true, slug: true },
          },
          paidBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ]);

    // Summary stats
    const [pendingCount, overdueCount, paidTotal] = await Promise.all([
      prisma.invoice.count({ where: { status: 'PENDING' } }),
      prisma.invoice.count({ where: { status: 'OVERDUE' } }),
      prisma.invoice.aggregate({ where: { status: 'PAID' }, _sum: { totalAmount: true } }),
    ]);

    return NextResponse.json({
      invoices,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      stats: {
        pendingCount,
        overdueCount,
        totalPaidRevenue: paidTotal._sum.totalAmount ?? 0,
      },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

// POST /api/admin/invoices — generate monthly invoices
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const now = new Date();
    const month = body.month ?? now.getMonth() + 1;
    const year = body.year ?? now.getFullYear();

    if (month < 1 || month > 12) {
      return NextResponse.json({ error: 'Invalid month (1–12)' }, { status: 400 });
    }
    if (year < 2020 || year > now.getFullYear() + 1) {
      return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
    }

    const result = await generateMonthlyInvoices(month, year);

    return NextResponse.json({
      success: true,
      message: `Generated ${result.generated} invoice(s). Skipped ${result.skipped} (already exist or no subscription).`,
      ...result,
    });
  } catch (error) {
    console.error('Error generating invoices:', error);
    return NextResponse.json({ error: 'Failed to generate invoices' }, { status: 500 });
  }
}
