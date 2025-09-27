import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/admin/banners/[id] - Get specific banner
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const banner = await prisma.banner.findUnique({
      where: { id: params.id }
    });

    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch banner' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/banners/[id] - Update banner
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      subtitle,
      description,
      imageUrl,
      linkUrl,
      buttonText,
      isActive,
      position,
      priority,
      startDate,
      endDate,
      backgroundColor,
      textColor,
      overlayOpacity
    } = body;

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id: params.id }
    });

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    const banner = await prisma.banner.update({
      where: { id: params.id },
      data: {
        title,
        subtitle,
        description,
        imageUrl,
        linkUrl,
        buttonText,
        isActive,
        position,
        priority,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        backgroundColor,
        textColor,
        overlayOpacity
      }
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/banners/[id] - Delete banner
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id: params.id }
    });

    if (!existingBanner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    await prisma.banner.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}