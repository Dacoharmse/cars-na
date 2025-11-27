import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('Starting database cleanup...\n');

  try {
    // Delete in order of dependencies
    console.log('Deleting Leads...');
    const leads = await prisma.lead.deleteMany();
    console.log(`✓ Deleted ${leads.count} leads`);

    console.log('Deleting Vehicle Images...');
    const vehicleImages = await prisma.vehicleImage.deleteMany();
    console.log(`✓ Deleted ${vehicleImages.count} vehicle images`);

    console.log('Deleting Featured Listings...');
    const featuredListings = await prisma.featuredListing.deleteMany();
    console.log(`✓ Deleted ${featuredListings.count} featured listings`);

    console.log('Deleting Vehicles...');
    const vehicles = await prisma.vehicle.deleteMany();
    console.log(`✓ Deleted ${vehicles.count} vehicles`);

    console.log('Deleting Accounts...');
    const accounts = await prisma.account.deleteMany();
    console.log(`✓ Deleted ${accounts.count} accounts`);

    console.log('Deleting Sessions...');
    const sessions = await prisma.session.deleteMany();
    console.log(`✓ Deleted ${sessions.count} sessions`);

    console.log('Deleting User Audit Logs...');
    const auditLogs = await prisma.userAuditLog.deleteMany();
    console.log(`✓ Deleted ${auditLogs.count} audit logs`);

    console.log('Deleting Dealership Subscriptions...');
    const dealershipSubscriptions = await prisma.dealershipSubscription.deleteMany();
    console.log(`✓ Deleted ${dealershipSubscriptions.count} dealership subscriptions`);

    console.log('Deleting Subscription Notifications...');
    const subscriptionNotifications = await prisma.subscriptionNotification.deleteMany();
    console.log(`✓ Deleted ${subscriptionNotifications.count} subscription notifications`);

    console.log('Deleting Usage Analytics...');
    const usageAnalytics = await prisma.usageAnalytics.deleteMany();
    console.log(`✓ Deleted ${usageAnalytics.count} usage analytics`);

    console.log('Deleting Payments...');
    const payments = await prisma.payment.deleteMany();
    console.log(`✓ Deleted ${payments.count} payments`);

    console.log('Deleting Users...');
    const users = await prisma.user.deleteMany();
    console.log(`✓ Deleted ${users.count} users`);

    console.log('Deleting Dealerships...');
    const dealerships = await prisma.dealership.deleteMany();
    console.log(`✓ Deleted ${dealerships.count} dealerships`);

    console.log('\n✅ Database cleanup completed successfully!\n');

    // Verify the cleanup
    console.log('Verifying database state...');
    const userCount = await prisma.user.count();
    const dealershipCount = await prisma.dealership.count();
    const vehicleCount = await prisma.vehicle.count();
    const leadCount = await prisma.lead.count();
    const subscriptionPlanCount = await prisma.subscriptionPlan.count();

    console.log('\nFinal record counts:');
    console.log(`  Users: ${userCount}`);
    console.log(`  Dealerships: ${dealershipCount}`);
    console.log(`  Vehicles: ${vehicleCount}`);
    console.log(`  Leads: ${leadCount}`);
    console.log(`  Subscription Plans: ${subscriptionPlanCount} (preserved)`);
    console.log('\nDatabase is now clean and ready for production! 🎉');

  } catch (error) {
    console.error('Error cleaning database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
