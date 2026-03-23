import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function isAdmin(session: any) {
  return session?.user?.role === 'ADMIN' || session?.user?.email === 'admin@cars.na';
}

// PUT /api/events/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const event = await (prisma as any).event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description ?? null,
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location ?? null,
        venue: body.venue ?? null,
        category: body.category ?? null,
        imageUrl: body.imageUrl ?? null,
        externalUrl: body.externalUrl ?? null,
        isFeatured: body.isFeatured ?? false,
        isPublished: body.isPublished ?? true,
      },
    });
    return NextResponse.json(event);
  } catch (err) {
    console.error('[events PUT]', err);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events/[id]
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session || !isAdmin(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  try {
    await (prisma as any).event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[events DELETE]', err);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
