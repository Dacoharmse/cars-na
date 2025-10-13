import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify user is authenticated
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is a dealer
    if (!['DEALER', 'DEALER_ADMIN', 'SALES_EXECUTIVE'].includes(session.user.role)) {
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

    // For development, just log the data and return success
    // In production, this would save to database via Prisma
    console.log('Vehicle submission received:', {
      dealer: session.user.email,
      vehicle: vehicleData,
      timestamp: new Date().toISOString()
    });

    // Generate a mock vehicle ID for the response
    const vehicleId = `vehicle-${Date.now()}`;

    // In production, this would be something like:
    // const vehicle = await prisma.vehicle.create({
    //   data: {
    //     ...vehicleData,
    //     dealershipId: session.user.dealershipId,
    //     createdById: session.user.id,
    //     status: 'AVAILABLE'
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: 'Vehicle successfully added to inventory',
      vehicleId: vehicleId,
      data: {
        ...vehicleData,
        id: vehicleId,
        status: 'AVAILABLE',
        createdAt: new Date().toISOString(),
        dealershipId: session.user.dealershipId,
        createdBy: session.user.name
      }
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
    if (!['DEALER', 'DEALER_ADMIN', 'SALES_EXECUTIVE'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Access denied. Dealer account required.' }, { status: 403 });
    }

    // For development, return mock vehicles
    // In production, this would query the database
    const mockVehicles = [
      {
        id: 'vehicle-1',
        manufacturer: 'BMW',
        model: 'X3',
        year: 2022,
        price: 650000,
        mileage: 25000,
        status: 'AVAILABLE',
        salespersonName: 'John Smith',
        createdAt: '2024-01-20T10:00:00Z'
      },
      {
        id: 'vehicle-2',
        manufacturer: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2021,
        price: 580000,
        mileage: 35000,
        status: 'AVAILABLE',
        salespersonName: 'Sarah Johnson',
        createdAt: '2024-01-19T15:30:00Z'
      }
    ];

    return NextResponse.json({
      success: true,
      vehicles: mockVehicles,
      total: mockVehicles.length
    });

  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}