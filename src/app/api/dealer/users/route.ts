import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/dealer/users
 * Fetches all users (team members) belonging to the logged-in dealer's dealership
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const user = session.user as any;

    // Check if user is a dealer (DEALER_PRINCIPAL or SALES_EXECUTIVE)
    if (user.role !== 'DEALER_PRINCIPAL' && user.role !== 'SALES_EXECUTIVE') {
      return NextResponse.json(
        { error: 'Access denied - Dealer account required' },
        { status: 403 }
      );
    }

    // Get dealership ID from session
    const dealershipId = user.dealershipId;

    if (!dealershipId) {
      return NextResponse.json(
        { error: 'No dealership associated with this account' },
        { status: 400 }
      );
    }

    // Fetch all users from the same dealership
    const users = await prisma.user.findMany({
      where: {
        dealershipId: dealershipId,
        role: {
          in: ['DEALER_PRINCIPAL', 'SALES_EXECUTIVE']
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      users: users
    });

  } catch (error) {
    console.error('Error fetching dealership users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dealership users' },
      { status: 500 }
    );
  }
}
