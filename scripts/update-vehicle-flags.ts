import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to update vehicle flags for showcase...');

  try {
    // Get all vehicles
    const allVehicles = await prisma.vehicle.findMany({
      where: {
        status: 'AVAILABLE'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`Found ${allVehicles.length} available vehicles`);

    if (allVehicles.length === 0) {
      console.log('No vehicles found in database');
      return;
    }

    // Mark first 3 vehicles as featured
    const featuredCount = Math.min(3, allVehicles.length);
    for (let i = 0; i < featuredCount; i++) {
      await prisma.vehicle.update({
        where: { id: allVehicles[i].id },
        data: { featured: true }
      });
      console.log(`✓ Marked ${allVehicles[i].make} ${allVehicles[i].model} as featured`);
    }

    // Mark vehicles 3-6 as dealer picks
    const dealerPickStart = 3;
    const dealerPickCount = Math.min(4, allVehicles.length - dealerPickStart);
    for (let i = dealerPickStart; i < dealerPickStart + dealerPickCount; i++) {
      if (allVehicles[i]) {
        await prisma.vehicle.update({
          where: { id: allVehicles[i].id },
          data: { dealerPick: true }
        });
        console.log(`✓ Marked ${allVehicles[i].make} ${allVehicles[i].model} as dealer pick`);
      }
    }

    // Mark half of vehicles as new, half as used
    const halfPoint = Math.floor(allVehicles.length / 2);
    for (let i = 0; i < allVehicles.length; i++) {
      const isNew = i < halfPoint;
      await prisma.vehicle.update({
        where: { id: allVehicles[i].id },
        data: { isNew }
      });
      console.log(`✓ Marked ${allVehicles[i].make} ${allVehicles[i].model} as ${isNew ? 'NEW' : 'USED'}`);
    }

    // Add some discounts to create top deals
    const dealsCount = Math.min(3, allVehicles.length);
    for (let i = 0; i < dealsCount; i++) {
      const vehicle = allVehicles[i];
      const originalPrice = vehicle.price * 1.15; // 15% discount
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { originalPrice }
      });
      console.log(`✓ Added discount to ${vehicle.make} ${vehicle.model} (was $${originalPrice.toFixed(2)}, now $${vehicle.price})`);
    }

    // Add some view counts to create "most viewed" section
    for (let i = 0; i < Math.min(5, allVehicles.length); i++) {
      const viewCount = Math.floor(Math.random() * 500) + 100; // Random 100-600 views
      await prisma.vehicle.update({
        where: { id: allVehicles[i].id },
        data: { viewCount }
      });
      console.log(`✓ Set view count for ${allVehicles[i].make} ${allVehicles[i].model} to ${viewCount}`);
    }

    console.log('\n✅ Successfully updated all vehicle flags!');

    // Display summary
    const stats = await Promise.all([
      prisma.vehicle.count({ where: { featured: true, status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { dealerPick: true, status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { isNew: true, status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { isNew: false, status: 'AVAILABLE' } }),
      prisma.vehicle.count({
        where: {
          originalPrice: { not: null },
          status: 'AVAILABLE'
        }
      }),
    ]);

    console.log('\nShowcase Summary:');
    console.log(`- Featured Vehicles: ${stats[0]}`);
    console.log(`- Dealer Picks: ${stats[1]}`);
    console.log(`- New Cars: ${stats[2]}`);
    console.log(`- Used Cars: ${stats[3]}`);
    console.log(`- Top Deals: ${stats[4]}`);

  } catch (error) {
    console.error('Error updating vehicle flags:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
