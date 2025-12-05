import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Updating Daco Dealer data with real content...\n');

  const updated = await prisma.dealership.update({
    where: { id: 'cmiki078300017aj4th6bj49t' },
    data: {
      name: 'Daco Dealer',
      slug: 'daco-dealer',
      description: 'Your trusted automotive dealership in Windhoek',
      specializations: 'New and Used Cars, SUVs, Trucks',
      contactPerson: 'Daco Harmse',
      phone: '081 123 4569',
      alternatePhone: '061 234 5678',
      email: 'dacoharmse13.dh@gmail.com',
      whatsappNumber: '081 123 4569',
      website: 'www.dacodealer.na',
    }
  });

  console.log('✅ Updated dealership:');
  console.log('  Name:', updated.name);
  console.log('  Slug:', updated.slug);
  console.log('  Description:', updated.description);
  console.log('  Specializations:', updated.specializations);
  console.log('\n✨ Done!');
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
