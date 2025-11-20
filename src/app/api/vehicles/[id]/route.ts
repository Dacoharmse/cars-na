import { NextRequest, NextResponse } from 'next/server';

// Mock vehicle data for testing - replace with actual database queries later
const mockVehicles = [
  {
    id: 'v1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 450000, // NAD
    mileage: 8500,
    color: 'Silver',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    bodyType: 'Sedan',
    vin: 'JT2BF22K123456789',
    status: 'AVAILABLE',
    description: 'Well-maintained 2023 Toyota Camry with low mileage. Perfect for daily commuting with excellent fuel economy.',
    isPrivate: false,
    createdAt: new Date('2024-01-15'),
    images: [
      {
        url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
        isPrimary: true
      },
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        isPrimary: false
      }
    ],
    dealership: {
      id: 'd1',
      name: 'Windhoek Motors',
      address: '123 Independence Avenue',
      city: 'Windhoek',
      state: 'Khomas',
      zipCode: '10001',
      phone: '+264 61 123 4567',
      email: 'info@windhoekmotors.com.na',
      description: 'Premier automotive dealership serving Namibia since 1985.'
    }
  },
  {
    id: 'v2',
    make: 'Honda',
    model: 'CR-V',
    year: 2022,
    price: 520000, // NAD
    mileage: 12000,
    color: 'Blue',
    transmission: 'Automatic',
    fuelType: 'Hybrid',
    bodyType: 'SUV',
    vin: 'JHLRD78856C123456',
    status: 'AVAILABLE',
    description: 'Reliable Honda CR-V hybrid with excellent fuel efficiency and spacious interior.',
    isPrivate: false,
    createdAt: new Date('2024-02-10'),
    images: [
      {
        url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        isPrimary: true
      }
    ],
    dealership: {
      id: 'd2',
      name: 'Namibia Auto Center',
      address: '456 Sam Nujoma Drive',
      city: 'Windhoek',
      state: 'Khomas',
      zipCode: '10002',
      phone: '+264 61 987 6543',
      email: 'sales@namibiaauto.com.na',
      description: 'Your trusted partner for quality vehicles in Namibia.'
    }
  },
  {
    id: 'v3',
    make: 'Ford',
    model: 'Ranger',
    year: 2023,
    price: 680000, // NAD
    mileage: 5000,
    color: 'White',
    transmission: 'Manual',
    fuelType: 'Diesel',
    bodyType: 'Pickup',
    vin: '1FTER4FH8NLA12345',
    status: 'AVAILABLE',
    description: 'Powerful Ford Ranger pickup truck, perfect for both work and adventure.',
    isPrivate: false,
    createdAt: new Date('2024-03-05'),
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
        isPrimary: true
      }
    ],
    dealership: {
      id: 'd1',
      name: 'Windhoek Motors',
      address: '123 Independence Avenue',
      city: 'Windhoek',
      state: 'Khomas',
      zipCode: '10001',
      phone: '+264 61 123 4567',
      email: 'info@windhoekmotors.com.na',
      description: 'Premier automotive dealership serving Namibia since 1985.'
    }
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: vehicleId } = await params;
    
    // Find the vehicle by ID
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    
    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
