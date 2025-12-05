import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Debugging Session Issue\n');

  // Check user
  const user = await prisma.user.findUnique({
    where: { email: 'dacoharmse13.dh@gmail.com' },
    include: { dealership: true }
  });

  if (!user) {
    console.log('❌ User not found');
    return;
  }

  console.log('👤 User Info:');
  console.log('  Email:', user.email);
  console.log('  Name:', user.name);
  console.log('  Dealership ID:', user.dealershipId);
  console.log('');

  if (user.dealership) {
    console.log('🏢 Associated Dealership:');
    console.log('  ID:', user.dealership.id);
    console.log('  Name:', user.dealership.name);
    console.log('  Slug:', user.dealership.slug);
  } else {
    console.log('❌ No dealership associated');
  }

  console.log('\n📋 All Dealerships in DB:');
  const allDealerships = await prisma.dealership.findMany({
    select: { id: true, name: true, slug: true }
  });
  allDealerships.forEach(d => {
    console.log(`  - ${d.name} (ID: ${d.id}, Slug: ${d.slug})`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
