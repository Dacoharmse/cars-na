import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDetails() {
  try {
    const listing = await prisma.userVehicleListing.findFirst({
      where: {
        make: 'Toyota',
        model: 'Hilux',
        year: 2021,
      },
    });

    if (listing) {
      console.log('=== 2021 Toyota Hilux Details ===\n');
      console.log('ID:', listing.id);
      console.log('Status:', listing.status);
      console.log('Images:', listing.images);
      console.log('Images type:', typeof listing.images);
      console.log('Images length:', Array.isArray(listing.images) ? listing.images.length : 'Not an array');
      console.log('\nFull listing data:');
      console.log(JSON.stringify(listing, null, 2));
    } else {
      console.log('Listing not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDetails();
