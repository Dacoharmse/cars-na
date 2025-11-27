import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/dealer/vehicles/[id] - Fetch single vehicle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a dealer
    if (!['DEALER_PRINCIPAL', 'SALES_EXECUTIVE'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Access denied. Dealer account required.' }, { status: 403 });
    }

    // Get user's dealership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { dealership: true }
    });

    if (!user || !user.dealership) {
      return NextResponse.json({ error: 'No dealership associated with this account' }, { status: 400 });
    }

    // Fetch the vehicle
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: id,
        dealershipId: user.dealership.id // Ensure vehicle belongs to dealer's dealership
      },
      include: {
        images: {
          orderBy: {
            isPrimary: 'desc'
          }
        }
      }
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      vehicle: {
        id: vehicle.id,
        category: vehicle.category,
        manufacturer: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        mileage: vehicle.mileage,
        color: vehicle.color,
        internalRef: vehicle.internalRef,
        description: vehicle.description,
        transmission: vehicle.transmission,
        fuelType: vehicle.fuelType,
        bodyType: vehicle.bodyType,
        engineCapacity: vehicle.engineCapacity,
        horsepower: vehicle.horsepower,
        loadCapacity: vehicle.loadCapacity,
        passengerCapacity: vehicle.passengerCapacity,
        length: vehicle.length,
        weight: vehicle.weight,
        isNew: vehicle.isNew,
        status: vehicle.status,
        comfort: vehicle.comfortFeatures,
        safety: vehicle.safetyFeatures,
        images: vehicle.images
      }
    });

  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/dealer/vehicles/[id] - Update vehicle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a dealer
    if (!['DEALER_PRINCIPAL', 'SALES_EXECUTIVE'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Access denied. Dealer account required.' }, { status: 403 });
    }

    const vehicleData = await request.json();

    // Get user's dealership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { dealership: true }
    });

    if (!user || !user.dealership) {
      return NextResponse.json({ error: 'No dealership associated with this account' }, { status: 400 });
    }

    // Verify vehicle belongs to dealer's dealership
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id: id,
        dealershipId: user.dealership.id
      }
    });

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found or access denied' }, { status: 404 });
    }

    // Update vehicle
    const vehicle = await prisma.vehicle.update({
      where: { id: id },
      data: {
        category: vehicleData.category,
        make: vehicleData.manufacturer,
        model: vehicleData.model,
        year: parseInt(vehicleData.year),
        price: parseFloat(vehicleData.price),
        mileage: vehicleData.mileage ? parseInt(vehicleData.mileage) : null,
        color: vehicleData.color || null,
        internalRef: vehicleData.internalRef || null,
        description: vehicleData.description || null,
        transmission: vehicleData.transmission,
        fuelType: vehicleData.fuelType,
        bodyType: vehicleData.bodyType || null,
        engineCapacity: vehicleData.engineCapacity ? vehicleData.engineCapacity.toString() : null,
        horsepower: vehicleData.horsepower ? parseInt(vehicleData.horsepower) : null,
        loadCapacity: vehicleData.loadCapacity ? parseFloat(vehicleData.loadCapacity) : null,
        passengerCapacity: vehicleData.passengerCapacity ? parseInt(vehicleData.passengerCapacity) : null,
        length: vehicleData.length ? parseFloat(vehicleData.length) : null,
        weight: vehicleData.weight ? parseFloat(vehicleData.weight) : null,
        isNew: vehicleData.isNew || false,
        status: vehicleData.status || 'AVAILABLE',
        comfortFeatures: vehicleData.comfort || [],
        safetyFeatures: vehicleData.safety || []
      }
    });

    // Handle image deletions first
    if (vehicleData.imagesToDelete && vehicleData.imagesToDelete.length > 0) {
      console.log('Deleting images:', vehicleData.imagesToDelete);
      await prisma.vehicleImage.deleteMany({
        where: {
          id: { in: vehicleData.imagesToDelete },
          vehicleId: id // Ensure we only delete images for this vehicle
        }
      });
      console.log('Deleted', vehicleData.imagesToDelete.length, 'images');
    }

    // Handle new images if provided (base64 encoded)
    if (vehicleData.newImages && vehicleData.newImages.length > 0) {
      console.log('Adding new images:', vehicleData.newImages.length);

      // Get current image count to set correct display order
      const currentImageCount = await prisma.vehicleImage.count({
        where: { vehicleId: id }
      });

      // Add new images while keeping existing ones
      // Images are base64 data URIs (e.g., "data:image/jpeg;base64,/9j/4AAQ...")
      await prisma.vehicleImage.createMany({
        data: vehicleData.newImages.map((imageUrl: string, index: number) => ({
          vehicleId: id,
          url: imageUrl, // Store base64 data URI directly
          isPrimary: currentImageCount === 0 && index === 0, // First image is primary if no existing images
          displayOrder: currentImageCount + index
        }))
      });

      console.log('Added', vehicleData.newImages.length, 'new images to vehicle');
    }

    console.log('Vehicle successfully updated:', {
      vehicleId: vehicle.id,
      dealer: session.user.email,
      make: vehicle.make,
      model: vehicle.model
    });

    return NextResponse.json({
      success: true,
      message: 'Vehicle successfully updated',
      vehicleId: vehicle.id,
      data: vehicle
    });

  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/dealer/vehicles/[id] - Delete vehicle
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a dealer
    if (!['DEALER_PRINCIPAL', 'SALES_EXECUTIVE'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Access denied. Dealer account required.' }, { status: 403 });
    }

    // Get user's dealership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { dealership: true }
    });

    if (!user || !user.dealership) {
      return NextResponse.json({ error: 'No dealership associated with this account' }, { status: 400 });
    }

    // Verify vehicle belongs to dealer's dealership
    const existingVehicle = await prisma.vehicle.findFirst({
      where: {
        id: id,
        dealershipId: user.dealership.id
      }
    });

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found or access denied' }, { status: 404 });
    }

    // Delete vehicle images first (cascade)
    await prisma.vehicleImage.deleteMany({
      where: { vehicleId: id }
    });

    // Delete vehicle
    await prisma.vehicle.delete({
      where: { id: id }
    });

    console.log('Vehicle successfully deleted:', {
      vehicleId: id,
      dealer: session.user.email
    });

    return NextResponse.json({
      success: true,
      message: 'Vehicle successfully deleted'
    });

  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
