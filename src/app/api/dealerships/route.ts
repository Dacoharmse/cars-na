import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const dealerships = await prisma.dealership.findMany({
      where: {
        status: 'APPROVED',
      },
      include: {
        _count: {
          select: {
            vehicles: {
              where: {
                status: 'AVAILABLE'
              }
            }
          }
        }
      },
      orderBy: [
        { region: 'asc' },
        { city: 'asc' },
        { isFeatured: 'desc' },
        { isVerified: 'desc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(dealerships);
  } catch (error) {
    console.error('Error fetching dealerships:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dealerships' },
      { status: 500 }
    );
  }
}
