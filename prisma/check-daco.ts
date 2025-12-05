import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const dealership = await prisma.dealership.findUnique({
    where: { id: 'cmiki078300017aj4th6bj49t' }
  });

  console.log('🏢 Daco Dealer Data:');
  console.log('Name:', dealership?.name);
  console.log('Slug:', dealership?.slug);
  console.log('Description:', dealership?.description);
  console.log('Phone:', dealership?.phone);
  console.log('Email:', dealership?.email);
  console.log('Specializations:', dealership?.specializations);
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
