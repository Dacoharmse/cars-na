import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Fetch all platform settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all settings from database
    const settingsRecords = await prisma.platformSettings.findMany();

    // Convert array of settings to object format
    const settings: Record<string, any> = {};
    settingsRecords.forEach((record) => {
      settings[record.key] = record.value;
    });

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Error fetching platform settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch platform settings' },
      { status: 500 }
    );
  }
}

// PUT - Update platform settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { settings } = body;

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Update each settings section
    const updates = Object.entries(settings).map(([key, value]) =>
      prisma.platformSettings.upsert({
        where: { key },
        create: {
          key,
          value: value as any,
          updatedBy: session.user.id,
        },
        update: {
          value: value as any,
          updatedBy: session.user.id,
        },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error) {
    console.error('Error updating platform settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update platform settings' },
      { status: 500 }
    );
  }
}
