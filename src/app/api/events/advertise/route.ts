import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/events/advertise — admin only, returns all inquiries
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN' || session?.user?.email === 'admin@cars.na';
  if (!session || !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status'); // optional filter

  try {
    const inquiries = await (prisma as any).eventAdvertiseInquiry.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(inquiries);
  } catch (err) {
    console.error('[event-advertise GET]', err);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

// POST /api/events/advertise — public, submit advertising inquiry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    const required = ['companyName', 'contactName', 'email', 'phone', 'eventName', 'eventDate', 'eventLocation'];
    for (const field of required) {
      if (!body[field]?.trim()) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const inquiry = await (prisma as any).eventAdvertiseInquiry.create({
      data: {
        companyName: body.companyName.trim(),
        contactName: body.contactName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        website: body.website?.trim() || null,
        eventName: body.eventName.trim(),
        eventDate: body.eventDate.trim(),
        eventCategory: body.eventCategory?.trim() || null,
        eventLocation: body.eventLocation.trim(),
        expectedAttendees: body.expectedAttendees?.trim() || null,
        description: body.description?.trim() || null,
        budget: body.budget?.trim() || null,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ ok: true, id: inquiry.id }, { status: 201 });
  } catch (err) {
    console.error('[event-advertise POST]', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

// PATCH /api/events/advertise — admin only, update inquiry status
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const isAdmin = (session?.user as any)?.role === 'ADMIN' || session?.user?.email === 'admin@cars.na';
  if (!session || !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    const valid = ['PENDING', 'REVIEWED', 'APPROVED', 'REJECTED'];
    if (!id || !valid.includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const updated = await (prisma as any).eventAdvertiseInquiry.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[event-advertise PATCH]', err);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
