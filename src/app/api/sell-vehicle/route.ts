import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { VehicleCategory } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';

// Helper function to check auto-moderate setting
async function isAutoModerateEnabled(): Promise<boolean> {
  try {
    const settingsFile = path.join(process.cwd(), 'data', 'auto-moderate.json');
    const data = await fs.readFile(settingsFile, 'utf-8');
    const settings = JSON.parse(data);
    return settings.enabled ?? false;
  } catch {
    return false; // Default to disabled
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const body = await req.json();
    const {
      category,
      make,
      model,
      year,
      mileage,
      condition,
      price,
      negotiable,
      color,
      transmission,
      fuelType,
      vin,
      registrationNo,
      city,
      region,
      description,
      images,
      hasAccident,
      serviceHistory,
      numberOfOwners,
      reason,
      availableForTest,
      userName,
      userEmail,
      userPhone,
    } = body;

    // Validate required fields
    if (!category || !make || !model || !year || !price || !description || !userName || !userEmail || !userPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate category
    if (!Object.values(VehicleCategory).includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid vehicle category' },
        { status: 400 }
      );
    }

    // Check auto-moderate setting
    const autoModerateEnabled = await isAutoModerateEnabled();
    const initialStatus = autoModerateEnabled ? 'APPROVED' : 'PENDING';

    // Create the listing
    const listing = await prisma.userVehicleListing.create({
      data: {
        userId: session?.user?.id || null,
        userName,
        userEmail,
        userPhone,
        category,
        make,
        model,
        year: parseInt(year),
        mileage: mileage ? parseInt(mileage) : null,
        condition,
        price: parseFloat(price),
        negotiable: negotiable ?? true,
        color: color || null,
        transmission: transmission || null,
        fuelType: fuelType || null,
        vin: vin || null,
        registrationNo: registrationNo || null,
        city: city || null,
        region: region || null,
        description,
        images: images || [],
        hasAccident: hasAccident ?? false,
        serviceHistory: serviceHistory ?? false,
        numberOfOwners: numberOfOwners ? parseInt(numberOfOwners) : null,
        reason: reason || null,
        availableForTest: availableForTest ?? true,
        status: initialStatus,
      },
    });

    // Send approval email if auto-approved
    if (autoModerateEnabled) {
      try {
        const { emailService } = await import('@/lib/email');
        await emailService.sendListingApprovedToSeller({
          sellerName: userName,
          sellerEmail: userEmail,
          vehicleDetails: {
            year: parseInt(year),
            make,
            model,
            category,
          },
        });
      } catch (emailError) {
        console.error('Failed to send auto-approval email:', emailError);
      }
    }

    // Create notifications for all approved dealerships in the same region (if region is provided)
    if (region) {
      const dealerships = await prisma.dealership.findMany({
        where: {
          status: 'APPROVED',
          region: region,
        },
        include: {
          users: {
            where: {
              role: {
                in: ['DEALER_PRINCIPAL', 'SALES_EXECUTIVE'],
              },
            },
            select: {
              id: true,
            },
          },
        },
      });

      // Create notifications for all dealer users
      const notificationPromises = dealerships.flatMap(dealership =>
        dealership.users.map(user =>
          prisma.notification.create({
            data: {
              userId: user.id,
              type: 'NEW_LISTING',
              title: 'New Vehicle Listing',
              message: `A new ${year} ${make} ${model} has been listed for sale in ${city || region}.`,
              link: `/dealer/vehicle-listings/${listing.id}`,
              metadata: {
                listingId: listing.id,
                category: category,
                make: make,
                model: model,
                year: year,
                price: price,
              },
            },
          })
        )
      );

      await Promise.all(notificationPromises);
    }

    return NextResponse.json({
      success: true,
      listing: {
        id: listing.id,
        status: listing.status,
      },
      message: autoModerateEnabled
        ? 'Your listing has been automatically approved and is now visible to dealerships!'
        : 'Your listing has been submitted and is pending approval.',
    });
  } catch (error) {
    console.error('Error creating vehicle listing:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's listings
    const listings = await prisma.userVehicleListing.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            interests: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      listings,
    });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
