import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyClean() {
  try {
    // Get all vehicles
    const vehicles = await prisma.vehicle.findMany({
      include: {
        dealership: true,
        images: true,
      }
    });

    console.log('Total vehicles in database:', vehicles.length);

    if (vehicles.length > 0) {
      console.log('\nVehicles found:');
      vehicles.forEach((v, idx) => {
        console.log(`${idx + 1}. ${v.year} ${v.make} ${v.model} (ID: ${v.id})`);
        console.log(`   Dealership: ${v.dealership?.name || 'None'}`);
        console.log(`   Status: ${v.status}`);
      });

      // Delete them all
      console.log('\nDeleting all vehicles...');
      await prisma.vehicleImage.deleteMany();
      await prisma.featuredListing.deleteMany();
      await prisma.lead.deleteMany();
      await prisma.vehicle.deleteMany();

      const afterCount = await prisma.vehicle.count();
      console.log('Vehicles after deletion:', afterCount);
    } else {
      console.log('Database is clean - no vehicles found');
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verifyClean();
