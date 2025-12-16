import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch all approved dealerships
    const dealerships = await prisma.dealership.findMany({
      where: {
        status: 'APPROVED',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        streetAddress: true,
        phone: true,
      },
      orderBy: [
        { city: 'asc' },
        { name: 'asc' },
      ],
    });

    // Group dealerships by city/town
    const groupedByTown = dealerships.reduce((acc, dealership) => {
      const town = dealership.city || 'Other';

      if (!acc[town]) {
        acc[town] = [];
      }

      acc[town].push(dealership);

      return acc;
    }, {} as Record<string, typeof dealerships>);

    // Convert to array format sorted by town name
    const result = Object.entries(groupedByTown)
      .map(([town, dealers]) => ({
        town,
        dealerships: dealers,
      }))
      .sort((a, b) => {
        // Put "Other" at the end
        if (a.town === 'Other') return 1;
        if (b.town === 'Other') return -1;
        return a.town.localeCompare(b.town);
      });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching grouped dealerships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dealerships' },
      { status: 500 }
    );
  }
}
