import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Auth guard — admin only
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting database cleanup...');

    // Delete in order of dependencies
    await prisma.lead.deleteMany();
    await prisma.vehicleImage.deleteMany();
    await prisma.featuredListing.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.userAuditLog.deleteMany();
    await prisma.dealershipSubscription.deleteMany();
    await prisma.subscriptionNotification.deleteMany();
    await prisma.usageAnalytics.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.user.deleteMany();
    await prisma.dealership.deleteMany();

    // Get final counts
    const counts = {
      users: await prisma.user.count(),
      dealerships: await prisma.dealership.count(),
      vehicles: await prisma.vehicle.count(),
      leads: await prisma.lead.count(),
      subscriptionPlans: await prisma.subscriptionPlan.count(),
    };

    console.log('Database cleanup completed:', counts);

    return NextResponse.json({
      success: true,
      message: 'Database cleaned successfully! All demo data has been removed.',
      counts,
    });
  } catch (error) {
    console.error('Database cleanup error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to clean database',
      },
      { status: 500 }
    );
  }
}
