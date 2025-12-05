import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking showcase data...\n');

  try {
    // Check total vehicles
    const totalVehicles = await prisma.vehicle.count();
    console.log(`Total vehicles: ${totalVehicles}`);

    if (totalVehicles === 0) {
      console.log('\n⚠️  No vehicles found in database. Please add some vehicles first.');
      return;
    }

    // Check vehicles by status
    const availableVehicles = await prisma.vehicle.count({ where: { status: 'AVAILABLE' } });
    console.log(`Available vehicles: ${availableVehicles}`);

    // Check showcase flags
    const featured = await prisma.vehicle.count({ where: { featured: true, status: 'AVAILABLE' } });
    const dealerPicks = await prisma.vehicle.count({ where: { dealerPick: true, status: 'AVAILABLE' } });
    const newCars = await prisma.vehicle.count({ where: { isNew: true, status: 'AVAILABLE' } });
    const usedCars = await prisma.vehicle.count({ where: { isNew: false, status: 'AVAILABLE' } });
    const withDiscounts = await prisma.vehicle.count({
      where: {
        originalPrice: { not: null },
        status: 'AVAILABLE'
      }
    });

    console.log(`\nShowcase Categories:`);
    console.log(`- Featured Vehicles: ${featured}`);
    console.log(`- Dealer Picks: ${dealerPicks}`);
    console.log(`- New Cars: ${newCars}`);
    console.log(`- Used Cars: ${usedCars}`);
    console.log(`- Top Deals (with discounts): ${withDiscounts}`);

    // Get sample vehicles for each category
    console.log(`\n--- Sample Vehicles ---`);

    const featuredSamples = await prisma.vehicle.findMany({
      where: { featured: true, status: 'AVAILABLE' },
      take: 2,
      select: { id: true, make: true, model: true, year: true }
    });
    console.log(`Featured samples: ${JSON.stringify(featuredSamples, null, 2)}`);

    const newListings = await prisma.vehicle.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 72 * 60 * 60 * 1000) },
        status: 'AVAILABLE'
      },
      take: 2,
      orderBy: { createdAt: 'desc' },
      select: { id: true, make: true, model: true, year: true, createdAt: true }
    });
    console.log(`New listings (last 72h): ${JSON.stringify(newListings, null, 2)}`);

  } catch (error) {
    console.error('Error checking showcase data:', error);
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
