import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a dealer
    if (!['DEALER_PRINCIPAL', 'SALES_EXECUTIVE'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Access denied. Dealer account required.' }, { status: 403 });
    }

    const vehicleData = await request.json();

    // Validate required fields
    const requiredFields = [
      'salespersonId', 'salespersonName', 'manufacturer', 'model',
      'year', 'price', 'mileage', 'engineCapacity', 'fuelType', 'transmission'
    ];

    const missingFields = requiredFields.filter(field => !vehicleData[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Get user's actual dealership from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { dealership: true }
    });

    if (!user || !user.dealership) {
      console.error('User or dealership not found:', { user: user?.id, email: session.user.email });
      return NextResponse.json({ error: 'No dealership associated with this account' }, { status: 400 });
    }

    console.log('Creating vehicle for dealership:', {
      dealershipId: user.dealership.id,
      dealershipName: user.dealership.name,
      userEmail: user.email
    });

    // Save vehicle to database
    const vehicle = await prisma.vehicle.create({
      data: {
        category: vehicleData.category,
        make: vehicleData.manufacturer,
        model: vehicleData.model,
        year: parseInt(vehicleData.year),
        price: parseFloat(vehicleData.price),
        mileage: vehicleData.mileage ? parseInt(vehicleData.mileage) : null,
        color: vehicleData.color || null,
        description: vehicleData.description || null,
        transmission: vehicleData.transmission,
        fuelType: vehicleData.fuelType,
        bodyType: vehicleData.bodyType || null,
        engineCapacity: vehicleData.engineCapacity || null,
        horsepower: vehicleData.horsepower ? parseInt(vehicleData.horsepower) : null,
        loadCapacity: vehicleData.loadCapacity ? parseFloat(vehicleData.loadCapacity) : null,
        passengerCapacity: vehicleData.passengerCapacity ? parseInt(vehicleData.passengerCapacity) : null,
        length: vehicleData.length ? parseFloat(vehicleData.length) : null,
        weight: vehicleData.weight ? parseFloat(vehicleData.weight) : null,
        isNew: vehicleData.isNew || false,
        status: 'AVAILABLE',
        dealershipId: user.dealership.id
      }
    });

    console.log('Vehicle successfully saved to database:', {
      vehicleId: vehicle.id,
      dealer: session.user.email,
      make: vehicle.make,
      model: vehicle.model
    });

    return NextResponse.json({
      success: true,
      message: 'Vehicle successfully added to inventory',
      vehicleId: vehicle.id,
      data: vehicle
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the session to verify user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a dealer
    if (!['DEALER_PRINCIPAL', 'SALES_EXECUTIVE'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Access denied. Dealer account required.' }, { status: 403 });
    }

    // Get user's actual dealership from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { dealership: true }
    });

    if (!user || !user.dealership) {
      return NextResponse.json({ error: 'No dealership associated with this account' }, { status: 400 });
    }

    // Fetch vehicles for this dealership
    const vehicles = await prisma.vehicle.findMany({
      where: {
        dealershipId: user.dealership.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        make: true,
        model: true,
        year: true,
        price: true,
        mileage: true,
        status: true,
        category: true,
        color: true,
        transmission: true,
        fuelType: true,
        createdAt: true
      }
    });

    // Transform the data to match the expected format
    const formattedVehicles = vehicles.map(v => ({
      id: v.id,
      manufacturer: v.make,
      model: v.model,
      year: v.year,
      price: v.price,
      mileage: v.mileage,
      status: v.status,
      category: v.category,
      color: v.color,
      transmission: v.transmission,
      fuelType: v.fuelType,
      createdAt: v.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      vehicles: formattedVehicles,
      total: vehicles.length
    });

  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}