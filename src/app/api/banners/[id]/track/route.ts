import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/banners/[id]/track - Track banner click or impression
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { type } = body; // 'click' or 'impression'

    if (!type || !['click', 'impression'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid tracking type' },
        { status: 400 }
      );
    }

    // Check if Prisma client and banner model are available
    if (!prisma || !prisma.banner) {
      console.log('Database unavailable, skipping banner tracking');
      return NextResponse.json({ success: true, tracked: false });
    }

    try {
      // Check if banner exists
      const banner = await prisma.banner.findUnique({
        where: { id }
      });

      if (!banner) {
        // Banner not found in database, but don't fail the request
        // This could be a placeholder banner
        console.log(`Banner ${params.id} not found in database (possibly a placeholder)`);
        return NextResponse.json({ success: true, tracked: false });
      }

      // Update the appropriate counter
      const updateData = type === 'click'
        ? { clicks: { increment: 1 } }
        : { impressions: { increment: 1 } };

      await prisma.banner.update({
        where: { id },
        data: updateData
      });

      return NextResponse.json({ success: true, tracked: true });
    } catch (dbError) {
      // Database operation failed, but don't break the app
      console.log('Database operation failed, skipping banner tracking:', dbError instanceof Error ? dbError.message : 'Unknown error');
      return NextResponse.json({ success: true, tracked: false });
    }
  } catch (error) {
    console.error('Error tracking banner:', error);
    // Don't fail the request, just log the error
    // This allows the app to work even when database is unavailable
    return NextResponse.json({ success: true, tracked: false });
  }
}