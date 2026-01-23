import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Debug logging for production
    console.log('GET /api/admin/sell-listings - Session:', session ? 'exists' : 'null');
    if (session?.user) {
      console.log('User email:', session.user.email);
      console.log('User role:', (session.user as any).role);
    }

    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;

    // Check for admin access - either by role or by admin email
    const isAdmin = userRole === 'ADMIN' || userEmail === 'admin@cars.na';

    if (!session || !isAdmin) {
      console.log('Unauthorized access attempt - Role:', userRole, 'Email:', userEmail);
      return NextResponse.json({
        error: 'Unauthorized',
        details: !session ? 'No session found' : 'User is not an admin'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const listings = await prisma.userVehicleListing.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Error fetching sell listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === 'ADMIN' || userEmail === 'admin@cars.na';

    if (!session || !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { listingId, status, rejectionReason } = body;

    if (!listingId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const listing = await prisma.userVehicleListing.update({
      where: { id: listingId },
      data: {
        status,
        ...(rejectionReason && { rejectionReason }),
      },
    });

    // Send email notification to seller if approved
    if (status === 'APPROVED') {
      try {
        const { emailService } = await import('@/lib/email');
        await emailService.sendListingApprovedToSeller({
          sellerName: listing.userName,
          sellerEmail: listing.userEmail,
          vehicleDetails: {
            year: listing.year,
            make: listing.make,
            model: listing.model,
            category: listing.category,
          },
        });
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
      }
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const userRole = (session?.user as any)?.role;
    const userEmail = session?.user?.email;
    const isAdmin = userRole === 'ADMIN' || userEmail === 'admin@cars.na';

    if (!session || !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('id');

    if (!listingId) {
      return NextResponse.json(
        { error: 'Missing listing ID' },
        { status: 400 }
      );
    }

    await prisma.userVehicleListing.delete({
      where: { id: listingId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
