import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkListings() {
  try {
    console.log('=== Checking User Vehicle Listings ===\n');

    const listings = await prisma.userVehicleListing.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    console.log(`Total listings found: ${listings.length}\n`);

    listings.forEach((listing, index) => {
      console.log(`${index + 1}. Listing ID: ${listing.id}`);
      console.log(`   Vehicle: ${listing.year} ${listing.make} ${listing.model}`);
      console.log(`   Status: ${listing.status}`);
      console.log(`   Region: ${listing.region || 'NOT SET'}`);
      console.log(`   City: ${listing.city || 'NOT SET'}`);
      console.log(`   Seller: ${listing.userName} (${listing.userEmail})`);
      console.log(`   Created: ${listing.createdAt}`);
      console.log('');
    });

    console.log('\n=== Checking Dealerships ===\n');

    const dealerships = await prisma.dealership.findMany({
      where: { status: 'APPROVED' },
      include: {
        users: {
          where: { role: 'DEALER_PRINCIPAL' },
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`Total approved dealerships: ${dealerships.length}\n`);

    dealerships.forEach((dealership, index) => {
      console.log(`${index + 1}. Dealership: ${dealership.name}`);
      console.log(`   Region: ${dealership.region || 'NOT SET'}`);
      console.log(`   Status: ${dealership.status}`);
      console.log(`   Dealers: ${dealership.users.length}`);
      dealership.users.forEach(user => {
        console.log(`     - ${user.name} (${user.email})`);
      });
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkListings();
