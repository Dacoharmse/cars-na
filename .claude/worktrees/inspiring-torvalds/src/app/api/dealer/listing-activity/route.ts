import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST — Log a new activity (view, call, email, whatsapp, etc.)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'DEALER_PRINCIPAL' && session.user.role !== 'SALES_EXECUTIVE')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const dealer = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { dealershipId: true },
    });

    if (!dealer?.dealershipId) {
      return NextResponse.json({ success: false, error: 'No dealership' }, { status: 400 });
    }

    const { listingId, action, metadata } = await req.json();

    if (!listingId || !action) {
      return NextResponse.json({ success: false, error: 'listingId and action required' }, { status: 400 });
    }

    const validActions = ['VIEWED', 'EXPRESSED_INTEREST', 'CALLED_SELLER', 'EMAILED_SELLER', 'WHATSAPP_SELLER', 'STATUS_CHANGED'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action type' }, { status: 400 });
    }

    // For VIEWED, deduplicate — only log once per dealership per listing per hour
    if (action === 'VIEWED') {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentView = await prisma.listingActivity.findFirst({
        where: {
          listingId,
          dealershipId: dealer.dealershipId,
          action: 'VIEWED',
          createdAt: { gte: oneHourAgo },
        },
      });
      if (recentView) {
        return NextResponse.json({ success: true, deduplicated: true });
      }
    }

    const activity = await prisma.listingActivity.create({
      data: {
        listingId,
        dealershipId: dealer.dealershipId,
        userId: session.user.id,
        action,
        metadata: metadata || undefined,
      },
    });

    // Also increment viewCount on the listing if it's a view
    if (action === 'VIEWED') {
      await prisma.userVehicleListing.update({
        where: { id: listingId },
        data: { viewCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Error logging listing activity:', error);
    return NextResponse.json({ success: false, error: 'Failed to log activity' }, { status: 500 });
  }
}

// GET — Fetch activity log for a specific listing
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'DEALER_PRINCIPAL' && session.user.role !== 'SALES_EXECUTIVE')) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return NextResponse.json({ success: false, error: 'listingId required' }, { status: 400 });
    }

    const activities = await prisma.listingActivity.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        dealership: {
          select: { id: true, name: true, logo: true, city: true, region: true },
        },
        user: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error('Error fetching listing activities:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch activities' }, { status: 500 });
  }
}
