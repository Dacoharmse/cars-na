import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Read auto-moderate setting from PlatformSettings table
async function getAutoModerate(): Promise<boolean> {
  try {
    const setting = await prisma.platformSettings.findUnique({
      where: { key: 'auto-moderate' },
    });
    if (!setting) return false;
    const value = setting.value as { enabled?: boolean };
    return value.enabled ?? false;
  } catch {
    return false;
  }
}

// Write auto-moderate setting to PlatformSettings table
async function setAutoModerate(enabled: boolean, userId?: string): Promise<void> {
  await prisma.platformSettings.upsert({
    where: { key: 'auto-moderate' },
    update: { value: { enabled }, updatedBy: userId },
    create: { key: 'auto-moderate', value: { enabled }, updatedBy: userId },
  });
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enabled = await getAutoModerate();
    return NextResponse.json({ enabled });
  } catch (error) {
    console.error('Error reading auto-moderate setting:', error);
    return NextResponse.json(
      { error: 'Failed to read setting' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid enabled value' },
        { status: 400 }
      );
    }

    await setAutoModerate(enabled, session.user.id);

    return NextResponse.json({ enabled });
  } catch (error) {
    console.error('Error updating auto-moderate setting:', error);
    return NextResponse.json(
      { error: 'Failed to update setting' },
      { status: 500 }
    );
  }
}
