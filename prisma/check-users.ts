import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('👥 Checking all users and their dealership associations...\n');

  const users = await prisma.user.findMany({
    include: {
      dealership: true
    }
  });

  users.forEach(user => {
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Dealership ID: ${user.dealershipId || 'None'}`);
    if (user.dealership) {
      console.log(`  Dealership Name: ${user.dealership.name}`);
      console.log(`  Dealership Slug: ${user.dealership.slug}`);
    } else {
      console.log(`  ⚠️  NO DEALERSHIP ASSOCIATED`);
    }
    console.log('---');
  });

  console.log(`\nTotal users: ${users.length}`);
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
