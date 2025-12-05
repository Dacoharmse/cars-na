import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dealership = await prisma.dealership.findUnique({
    where: { slug: 'daco-dealer' }
  });

  console.log('\n=== DATABASE CHECK ===');
  console.log('Dealership Name:', dealership?.name);
  console.log('Cover Image:', dealership?.coverImage);
  console.log('Logo:', dealership?.logo);
  console.log('====================\n');

  if (!dealership?.coverImage) {
    console.log('❌ NO COVER IMAGE IN DATABASE!');
    console.log('The coverImage field is null or empty.');
  } else {
    console.log('✅ Cover image exists in database');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
