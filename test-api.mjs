import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testQuery() {
  try {
    console.log('=== Testing Vehicle Listings Query ===\n');

    // Simulate the dealer (Daco Dealer with region Khomas)
    const dealershipId = 'cmiki078300017aj4th6bj49t';
    const region = 'Khomas';

    console.log(`Dealership ID: ${dealershipId}`);
    console.log(`Region: ${region}\n`);

    // Test the WHERE clause we're using in the API
    const where = {
      status: 'APPROVED',
      OR: [
        { region: region },
        { region: null },
      ],
    };

    console.log('WHERE clause:');
    console.log(JSON.stringify(where, null, 2));
    console.log('');

    const listings = await prisma.userVehicleListing.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        interests: {
          where: {
            dealershipId: dealershipId,
          },
        },
        _count: {
          select: {
            interests: true,
          },
        },
      },
    });

    console.log(`\n✅ Found ${listings.length} listing(s)\n`);

    listings.forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.year} ${listing.make} ${listing.model}`);
      console.log(`   ID: ${listing.id}`);
      console.log(`   Status: ${listing.status}`);
      console.log(`   Region: ${listing.region || 'NULL'}`);
      console.log(`   Price: NAD ${listing.price}`);
      console.log(`   Interests: ${listing._count.interests}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testQuery();
