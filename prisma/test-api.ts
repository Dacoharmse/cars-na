import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Testing API logic for Daco Dealership...\n');

  // Simulate what the API does
  const dealershipId = 'cmiki078300017aj4th6bj49t'; // Your actual dealership ID

  const dealership = await prisma.dealership.findUnique({
    where: { id: dealershipId },
    include: {
      subscription: {
        include: {
          plan: true
        }
      },
      _count: {
        select: {
          vehicles: true,
          users: true
        }
      }
    }
  });

  if (!dealership) {
    console.log('❌ Dealership not found');
    return;
  }

  console.log('✅ Dealership found:');
  console.log(JSON.stringify({ success: true, dealership }, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
