import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const dealership = await prisma.dealership.findFirst({
      where: { slug, status: 'APPROVED' },
      include: {
        vehicles: {
          where: {
            status: 'AVAILABLE'
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            vehicles: {
              where: {
                status: 'AVAILABLE'
              }
            }
          }
        }
      }
    });

    if (!dealership) {
      return NextResponse.json(
        { success: false, error: 'Dealership not found' },
        { status: 404 }
      );
    }

    // Increment profile views (fire and forget)
    prisma.dealership.update({
      where: { id: dealership.id },
      data: { profileViews: { increment: 1 } }
    }).catch(err => console.error('Failed to increment profile views:', err));

    return NextResponse.json({
      success: true,
      dealership
    });

  } catch (error) {
    console.error('Error fetching dealership by slug:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dealership' },
      { status: 500 }
    );
  }
}
