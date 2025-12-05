import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/dealer/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        jobTitle: true,
        bio: true,
        whatsappNumber: true,
        specialties: true,
        yearsExperience: true,
        languages: true,
        profileImage: true,
        isPublicProfile: true,
        displayOrder: true,
        role: true,
        dealership: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, profile: user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/dealer/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate and sanitize data
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.whatsappNumber !== undefined) updateData.whatsappNumber = data.whatsappNumber;
    if (data.specialties !== undefined) updateData.specialties = data.specialties;
    if (data.yearsExperience !== undefined) updateData.yearsExperience = parseInt(data.yearsExperience);
    if (data.languages !== undefined) updateData.languages = data.languages;
    if (data.profileImage !== undefined) updateData.profileImage = data.profileImage;
    if (data.isPublicProfile !== undefined) updateData.isPublicProfile = data.isPublicProfile;
    if (data.displayOrder !== undefined) updateData.displayOrder = parseInt(data.displayOrder);

    const user = await prisma.user.update({
      where: { email: session.user.email! },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        jobTitle: true,
        bio: true,
        whatsappNumber: true,
        specialties: true,
        yearsExperience: true,
        languages: true,
        profileImage: true,
        isPublicProfile: true,
        displayOrder: true,
        role: true,
      }
    });

    console.log('Profile updated successfully:', {
      userId: user.id,
      email: user.email,
      updatedFields: Object.keys(updateData)
    });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
