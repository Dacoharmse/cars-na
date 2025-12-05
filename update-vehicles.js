const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Updating vehicles for showcase...\n');

  // Get all available vehicles
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'AVAILABLE' },
    select: { id: true, make: true, model: true, year: true }
  });

  console.log(`Found ${vehicles.length} available vehicles`);

  if (vehicles.length === 0) {
    console.log('No vehicles to update');
    return;
  }

  // Update all vehicles to show in showcase
  for (let i = 0; i < vehicles.length; i++) {
    const vehicle = vehicles[i];
    await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: {
        featured: true,
        isNew: i % 2 === 0, // Alternate between new and used
        dealerPick: i < 3, // First 3 as dealer picks
        viewCount: Math.floor(Math.random() * 500) + 50,
        originalPrice: null // Clear any original prices for now
      }
    });
    console.log(`✓ Updated ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
  }

  console.log('\n✅ All vehicles updated successfully!');
  console.log('\nRefresh your homepage to see the vehicles in:');
  console.log('- Featured Vehicles section');
  console.log('- New Listings section (vehicles created recently)');
  console.log('- Most Viewed section');
  console.log('- Top New Cars / Top Used Cars sections');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
