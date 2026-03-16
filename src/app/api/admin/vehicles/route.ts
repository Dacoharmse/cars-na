import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    // Build where clause
    const where: Record<string, unknown> = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { vin: { contains: search, mode: 'insensitive' } },
        { dealership: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            isPrimary: true,
          },
          orderBy: [
            { isPrimary: 'desc' },
            { displayOrder: 'asc' },
          ],
        },
        _count: {
          select: {
            leads: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    const formattedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      originalPrice: vehicle.originalPrice ?? undefined,
      mileage: vehicle.mileage ?? 0,
      color: vehicle.color ?? undefined,
      vin: vehicle.vin ?? undefined,
      description: vehicle.description ?? undefined,
      transmission: vehicle.transmission ?? undefined,
      fuelType: vehicle.fuelType ?? undefined,
      bodyType: vehicle.bodyType ?? undefined,
      status: vehicle.status,
      moderationStatus: 'APPROVED' as const,
      featured: vehicle.featured,
      dealerPick: vehicle.dealerPick,
      isNew: vehicle.isNew,
      isPrivate: vehicle.isPrivate,
      viewCount: vehicle.viewCount,
      leadCount: vehicle._count.leads,
      qualityScore: 0,
      flaggedReasons: [] as string[],
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
      dealership: {
        id: vehicle.dealership.id,
        name: vehicle.dealership.name,
        email: vehicle.dealership.email || '',
        phone: vehicle.dealership.phone || '',
      },
      images: vehicle.images.map((img) => ({
        id: img.id,
        url: img.url,
        isPrimary: img.isPrimary,
      })),
    }));

    return NextResponse.json({
      success: true,
      vehicles: formattedVehicles,
      total: formattedVehicles.length,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch vehicles',
      },
      { status: 500 }
    );
  }
}
