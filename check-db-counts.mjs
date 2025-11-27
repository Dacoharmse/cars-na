import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCounts() {
  const counts = {
    vehicles: await prisma.vehicle.count(),
    users: await prisma.user.count(),
    dealerships: await prisma.dealership.count(),
    leads: await prisma.lead.count(),
    vehicleImages: await prisma.vehicleImage.count(),
    featuredListings: await prisma.featuredListing.count()
  };

  console.log('Database Record Counts:');
  console.log(JSON.stringify(counts, null, 2));

  await prisma.$disconnect();
}

checkCounts().catch(console.error);
