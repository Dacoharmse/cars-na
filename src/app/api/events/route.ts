import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/events — public, returns published upcoming events
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get('all') === '1'; // admin: fetch all incl. past/unpublished
  const limit = parseInt(searchParams.get('limit') || '20');

  try {
    const events = await (prisma as any).event.findMany({
      where: all ? {} : {
        isPublished: true,
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
      take: limit,
    });
    return NextResponse.json(events);
  } catch (err) {
    console.error('[events GET]', err);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events — admin only
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN' || session?.user?.email === 'admin@cars.na';
  if (!session || !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const event = await (prisma as any).event.create({
      data: {
        title: body.title,
        description: body.description || null,
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location || null,
        venue: body.venue || null,
        category: body.category || null,
        imageUrl: body.imageUrl || null,
        externalUrl: body.externalUrl || null,
        isFeatured: body.isFeatured ?? false,
        isPublished: body.isPublished ?? true,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    console.error('[events POST]', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
