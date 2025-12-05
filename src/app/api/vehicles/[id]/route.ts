import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Vehicle ID is required' },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      include: {
        dealership: {
          select: {
            id: true,
            name: true,
            slug: true,
            city: true,
            region: true,
            phone: true,
            email: true,
            website: true,
            whatsappNumber: true,
            logo: true,
            description: true,
            streetAddress: true,
            openingHours: true,
            users: {
              where: {
                isActive: true,
                isPublicProfile: true,
                role: {
                  in: ['DEALER_PRINCIPAL', 'SALES_EXECUTIVE']
                }
              },
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                jobTitle: true,
                bio: true,
                whatsappNumber: true,
                specialties: true,
                yearsExperience: true,
                languages: true,
                profileImage: true,
                displayOrder: true,
              },
              orderBy: {
                displayOrder: 'asc'
              }
            }
          }
        },
        images: {
          orderBy: {
            isPrimary: 'desc'
          }
        }
      }
    });

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.vehicle.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      vehicle
    });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicle' },
      { status: 500 }
    );
  }
}
