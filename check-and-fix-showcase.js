const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Checking showcase data...\n');

  try {
    // Count total vehicles
    const totalVehicles = await prisma.vehicle.count();
    console.log(`Total vehicles in database: ${totalVehicles}\n`);

    if (totalVehicles === 0) {
      console.log('❌ No vehicles found in database!');
      console.log('Please add vehicles through the dealer dashboard first.\n');
      return;
    }

    // Check showcase flags
    const featured = await prisma.vehicle.count({ where: { featured: true, status: 'AVAILABLE' } });
    const dealerPick = await prisma.vehicle.count({ where: { dealerPick: true, status: 'AVAILABLE' } });
    const isNew = await prisma.vehicle.count({ where: { isNew: true, status: 'AVAILABLE' } });
    const hasDiscount = await prisma.vehicle.count({
      where: {
        originalPrice: { not: null },
        status: 'AVAILABLE'
      }
    });

    console.log('Current showcase stats:');
    console.log(`- Featured vehicles: ${featured}`);
    console.log(`- Dealer picks: ${dealerPick}`);
    console.log(`- New cars: ${isNew}`);
    console.log(`- Vehicles with discounts: ${hasDiscount}\n`);

    if (featured === 0 && dealerPick === 0 && isNew === 0) {
      console.log('⚠️  No showcase flags set! Updating all available vehicles...\n');

      // Get all available vehicles
      const vehicles = await prisma.vehicle.findMany({
        where: { status: 'AVAILABLE' },
        orderBy: { createdAt: 'desc' },
      });

      console.log(`Found ${vehicles.length} available vehicles. Updating flags...\n`);

      // Update each vehicle with showcase flags
      for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];

        const updated = await prisma.vehicle.update({
          where: { id: vehicle.id },
          data: {
            featured: i < 4, // First 4 as featured
            dealerPick: i < 6, // First 6 as dealer picks
            isNew: vehicle.mileage === 0 || vehicle.mileage < 100, // New if low/no mileage
            viewCount: Math.floor(Math.random() * 300) + 50, // Random view count
            originalPrice: i < 3 ? vehicle.price * 1.15 : null, // First 3 get discount
          },
        });

        console.log(`✓ Updated: ${updated.year} ${updated.make} ${updated.model}`);
        console.log(`  Featured: ${updated.featured}, Dealer Pick: ${updated.dealerPick}, Is New: ${updated.isNew}, Views: ${updated.viewCount}`);
        if (updated.originalPrice) {
          console.log(`  Discount: NAD ${updated.originalPrice} → NAD ${updated.price}`);
        }
        console.log('');
      }

      console.log('✅ All vehicles updated!\n');

      // Show final stats
      const newFeatured = await prisma.vehicle.count({ where: { featured: true, status: 'AVAILABLE' } });
      const newDealerPick = await prisma.vehicle.count({ where: { dealerPick: true, status: 'AVAILABLE' } });
      const newIsNew = await prisma.vehicle.count({ where: { isNew: true, status: 'AVAILABLE' } });
      const newHasDiscount = await prisma.vehicle.count({
        where: {
          originalPrice: { not: null },
          status: 'AVAILABLE'
        }
      });

      console.log('Updated showcase stats:');
      console.log(`- Featured vehicles: ${newFeatured}`);
      console.log(`- Dealer picks: ${newDealerPick}`);
      console.log(`- New cars: ${newIsNew}`);
      console.log(`- Vehicles with discounts: ${newHasDiscount}`);
    } else {
      console.log('✅ Showcase data looks good!');
    }

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
