import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/dealer/dealership - Get current dealer's dealership information
export async function GET() {
  try {
    console.log('🔍 GET /api/dealer/dealership - Request received');
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log('❌ No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    const dealershipId = user.dealershipId;

    console.log('👤 User:', user.email);
    console.log('🏢 Dealership ID from session:', dealershipId);

    if (!dealershipId) {
      console.log('❌ No dealership ID in session');
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
      console.log('❌ Dealership not found in database');
      return NextResponse.json({ success: false, error: 'Dealership not found' }, { status: 404 });
    }

    console.log('✅ Returning dealership:', dealership.name);
    return NextResponse.json({ success: true, dealership });
  } catch (error) {
    console.error('Error fetching dealership:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dealership' },
      { status: 500 }
    );
  }
}

// PUT /api/dealer/dealership - Update dealership information
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    const dealershipId = user.dealershipId;

    if (!dealershipId) {
      return NextResponse.json({ success: false, error: 'No dealership associated with this user' }, { status: 404 });
    }

    const body = await request.json();

    // Extract only the fields that can be updated
    const {
      name,
      businessType,
      contactPerson,
      phone,
      alternatePhone,
      email,
      whatsappNumber,
      streetAddress,
      city,
      region,
      postalCode,
      website,
      description,
      specializations,
      facebookUrl,
      instagramUrl,
      twitterUrl,
      linkedinUrl,
      logoUrl,
      coverImageUrl
    } = body;

    const updatedDealership = await prisma.dealership.update({
      where: { id: dealershipId },
      data: {
        name,
        businessType,
        contactPerson,
        phone,
        alternatePhone,
        email,
        whatsappNumber,
        streetAddress,
        city,
        region,
        postalCode,
        website,
        description,
        specializations,
        facebookUrl,
        instagramUrl,
        twitterUrl,
        linkedinUrl,
        logoUrl,
        coverImageUrl
      },
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

    return NextResponse.json({ success: true, dealership: updatedDealership });
  } catch (error) {
    console.error('Error updating dealership:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update dealership' },
      { status: 500 }
    );
  }
}
