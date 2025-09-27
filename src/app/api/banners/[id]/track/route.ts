import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/banners/[id]/track - Track banner click or impression
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { type } = body; // 'click' or 'impression'

    if (!type || !['click', 'impression'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid tracking type' },
        { status: 400 }
      );
    }

    // Check if banner exists
    const banner = await prisma.banner.findUnique({
      where: { id: params.id }
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // Update the appropriate counter
    const updateData = type === 'click'
      ? { clicks: { increment: 1 } }
      : { impressions: { increment: 1 } };

    await prisma.banner.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking banner:', error);
    return NextResponse.json(
      { error: 'Failed to track banner' },
      { status: 500 }
    );
  }
}