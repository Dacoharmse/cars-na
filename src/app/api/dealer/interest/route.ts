import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'DEALER') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Dealer access required.' },
        { status: 401 }
      );
    }

    // Get dealer's dealership
    const dealer = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        dealership: true,
      },
    });

    if (!dealer?.dealership) {
      return NextResponse.json(
        { success: false, error: 'No dealership associated with this account' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { listingId, offerPrice, message } = body;

    if (!listingId) {
      return NextResponse.json(
        { success: false, error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Check if listing exists and is approved
    const listing = await prisma.userVehicleListing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }

    if (listing.status !== 'APPROVED') {
      return NextResponse.json(
        { success: false, error: 'Listing is not available' },
        { status: 400 }
      );
    }

    // Check if dealer already expressed interest
    const existingInterest = await prisma.dealerInterest.findUnique({
      where: {
        listingId_dealershipId: {
          listingId,
          dealershipId: dealer.dealership.id,
        },
      },
    });

    if (existingInterest) {
      return NextResponse.json(
        { success: false, error: 'You have already expressed interest in this listing' },
        { status: 400 }
      );
    }

    // Create dealer interest
    const interest = await prisma.dealerInterest.create({
      data: {
        listingId,
        dealershipId: dealer.dealership.id,
        userId: session.user.id,
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        message: message || null,
        status: 'PENDING',
      },
    });

    // Update listing interested count
    await prisma.userVehicleListing.update({
      where: { id: listingId },
      data: {
        interestedCount: {
          increment: 1,
        },
      },
    });

    // Send email notification to the seller (sellers don't have accounts)
    try {
      const { emailService } = await import('@/lib/email');

      await emailService.sendDealerInterestToSeller({
        sellerName: listing.userName,
        sellerEmail: listing.userEmail,
        dealershipName: dealer.dealership.name,
        dealerPhone: dealer.dealership.phone || undefined,
        dealerEmail: dealer.dealership.email || undefined,
        vehicleDetails: {
          year: listing.year,
          make: listing.make,
          model: listing.model,
          category: listing.category,
        },
        offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
        message: message || undefined,
      });
    } catch (emailError) {
      console.error('Failed to send email to seller:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      interest: {
        id: interest.id,
        status: interest.status,
      },
      message: 'Interest expressed successfully. You can now contact the seller.',
    });
  } catch (error) {
    console.error('Error expressing interest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to express interest' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'DEALER') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Dealer access required.' },
        { status: 401 }
      );
    }

    // Get dealer's dealership
    const dealer = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        dealership: true,
      },
    });

    if (!dealer?.dealership) {
      return NextResponse.json(
        { success: false, error: 'No dealership associated with this account' },
        { status: 400 }
      );
    }

    // Get all interests from this dealership
    const interests = await prisma.dealerInterest.findMany({
      where: {
        dealershipId: dealer.dealership.id,
      },
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      interests,
    });
  } catch (error) {
    console.error('Error fetching dealer interests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch interests' },
      { status: 500 }
    );
  }
}
