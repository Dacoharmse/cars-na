import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch leads for dealer's dealership
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user and their dealership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { dealership: true },
    });

    if (!user?.dealershipId) {
      return NextResponse.json({ error: 'No dealership associated with user' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const cursor = searchParams.get('cursor');
    const leadId = searchParams.get('leadId'); // For fetching a specific lead with messages

    // If fetching a specific lead with messages
    if (leadId) {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId },
        include: {
          vehicle: {
            select: {
              id: true,
              make: true,
              model: true,
              year: true,
              price: true,
            },
          },
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!lead || lead.dealershipId !== user.dealershipId) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }

      return NextResponse.json({ lead });
    }

    // Build where clause
    const where: any = {
      dealershipId: user.dealershipId,
    };

    if (status) {
      where.status = status;
    }

    // Fetch leads with message count (cursor-based pagination)
    const leads = await prisma.lead.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    let nextCursor: string | null = null;
    if (leads.length > limit) {
      const nextItem = leads.pop();
      nextCursor = nextItem!.id;
    }

    // Get stats
    const [total, newCount, contacted, converted] = await Promise.all([
      prisma.lead.count({ where: { dealershipId: user.dealershipId } }),
      prisma.lead.count({ where: { dealershipId: user.dealershipId, status: 'NEW' } }),
      prisma.lead.count({ where: { dealershipId: user.dealershipId, status: 'CONTACTED' } }),
      prisma.lead.count({ where: { dealershipId: user.dealershipId, status: 'CONVERTED' } }),
    ]);

    const conversionRate = total > 0 ? (converted / total) * 100 : 0;

    return NextResponse.json({
      leads,
      nextCursor,
      stats: {
        total,
        new: newCount,
        contacted,
        converted,
        conversionRate: Math.round(conversionRate * 100) / 100,
      },
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

// PATCH - Update lead status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user?.dealershipId) {
      return NextResponse.json({ error: 'No dealership associated with user' }, { status: 403 });
    }

    const body = await request.json();
    const { leadId, status } = body;

    if (!leadId || !status) {
      return NextResponse.json({ error: 'Missing leadId or status' }, { status: 400 });
    }

    // Verify lead belongs to user's dealership
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
    });

    if (!lead || lead.dealershipId !== user.dealershipId) {
      return NextResponse.json({ error: 'Lead not found or unauthorized' }, { status: 404 });
    }

    // Update lead status
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { status, updatedAt: new Date() },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            price: true,
          },
        },
      },
    });

    return NextResponse.json({ lead: updatedLead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
