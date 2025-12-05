import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Starting database cleanup...');

  // Delete in order to respect foreign key constraints

  console.log('📸 Deleting vehicle images...');
  const deletedImages = await prisma.vehicleImage.deleteMany({});
  console.log(`  ✅ Deleted ${deletedImages.count} vehicle images`);

  console.log('🚗 Deleting vehicles...');
  const deletedVehicles = await prisma.vehicle.deleteMany({});
  console.log(`  ✅ Deleted ${deletedVehicles.count} vehicles`);

  console.log('📢 Deleting banners...');
  const deletedBanners = await prisma.banner.deleteMany({});
  console.log(`  ✅ Deleted ${deletedBanners.count} banners`);

  console.log('💳 Deleting dealership subscriptions...');
  const deletedSubscriptions = await prisma.dealershipSubscription.deleteMany({});
  console.log(`  ✅ Deleted ${deletedSubscriptions.count} subscriptions`);

  console.log('👤 Deleting users...');
  const deletedUsers = await prisma.user.deleteMany({});
  console.log(`  ✅ Deleted ${deletedUsers.count} users`);

  console.log('🏢 Deleting dealerships...');
  const deletedDealerships = await prisma.dealership.deleteMany({});
  console.log(`  ✅ Deleted ${deletedDealerships.count} dealerships`);

  console.log('📋 Deleting subscription plans...');
  const deletedPlans = await prisma.subscriptionPlan.deleteMany({});
  console.log(`  ✅ Deleted ${deletedPlans.count} subscription plans`);

  // Delete any featured requests
  console.log('⭐ Deleting featured dealership requests...');
  const deletedFeaturedDealerships = await prisma.featuredDealershipRequest.deleteMany({});
  console.log(`  ✅ Deleted ${deletedFeaturedDealerships.count} featured dealership requests`);

  console.log('⭐ Deleting featured listing requests...');
  const deletedFeaturedListings = await prisma.featuredListingRequest.deleteMany({});
  console.log(`  ✅ Deleted ${deletedFeaturedListings.count} featured listing requests`);

  console.log('\n🎉 Database cleanup completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Vehicle Images: ${deletedImages.count}`);
  console.log(`   - Vehicles: ${deletedVehicles.count}`);
  console.log(`   - Banners: ${deletedBanners.count}`);
  console.log(`   - Subscriptions: ${deletedSubscriptions.count}`);
  console.log(`   - Users: ${deletedUsers.count}`);
  console.log(`   - Dealerships: ${deletedDealerships.count}`);
  console.log(`   - Subscription Plans: ${deletedPlans.count}`);
  console.log(`   - Featured Dealership Requests: ${deletedFeaturedDealerships.count}`);
  console.log(`   - Featured Listing Requests: ${deletedFeaturedListings.count}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Cleanup failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
