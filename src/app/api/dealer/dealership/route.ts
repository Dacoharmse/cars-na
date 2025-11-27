import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/dealer/dealership - Get current dealer's dealership information
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    const dealershipId = user.dealershipId;

    if (!dealershipId) {
      return NextResponse.json({ error: 'No dealership associated with this user' }, { status: 404 });
    }

    const dealership = await prisma.dealership.findUnique({
      where: { id: dealershipId },
      include: {
        subscription: {
          include: {
            plan: true
          }
        },
        _count: {
          select: {
            vehicles: true,
            users: true
          }
        }
      }
    });

    if (!dealership) {
      return NextResponse.json({ error: 'Dealership not found' }, { status: 404 });
    }

    return NextResponse.json(dealership);
  } catch (error) {
    console.error('Error fetching dealership:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dealership' },
      { status: 500 }
    );
  }
}
