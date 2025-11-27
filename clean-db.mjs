import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting database cleanup...\n');

  try {
    // Delete all data except subscription plans
    await prisma.lead.deleteMany();
    console.log('✓ Deleted all leads');

    await prisma.vehicleImage.deleteMany();
    console.log('✓ Deleted all vehicle images');

    await prisma.featuredListing.deleteMany();
    console.log('✓ Deleted all featured listings');

    await prisma.vehicle.deleteMany();
    console.log('✓ Deleted all vehicles');

    await prisma.account.deleteMany();
    console.log('✓ Deleted all accounts');

    await prisma.session.deleteMany();
    console.log('✓ Deleted all sessions');

    await prisma.userAuditLog.deleteMany();
    console.log('✓ Deleted all audit logs');

    await prisma.dealershipSubscription.deleteMany();
    console.log('✓ Deleted all dealership subscriptions');

    await prisma.subscriptionNotification.deleteMany();
    console.log('✓ Deleted all subscription notifications');

    await prisma.usageAnalytics.deleteMany();
    console.log('✓ Deleted all usage analytics');

    await prisma.payment.deleteMany();
    console.log('✓ Deleted all payments');

    await prisma.user.deleteMany();
    console.log('✓ Deleted all users');

    await prisma.dealership.deleteMany();
    console.log('✓ Deleted all dealerships');

    console.log('\n✅ Database cleanup completed!');
    console.log('\nYour database is now clean and ready for real dealerships and vehicles.');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
