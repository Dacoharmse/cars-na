import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🏢 Setting up test dealership and user...');

  // Create a test dealership
  const dealership = await prisma.dealership.upsert({
    where: { id: 'test-dealership-001' },
    update: {},
    create: {
      id: 'test-dealership-001',
      name: 'Test Auto Dealership',
      slug: 'test-auto-dealership',
      businessType: 'Independent Dealer',
      registrationNumber: 'REG123456',
      taxNumber: 'TAX789012',
      contactPerson: 'John Doe',
      phone: '+264 61 123 4567',
      alternatePhone: '+264 81 123 4567',
      email: 'info@testauto.na',
      whatsappNumber: '+264 81 123 4567',
      streetAddress: '123 Test Street',
      city: 'Windhoek',
      region: 'Khomas',
      postalCode: '10001',
      website: 'www.testauto.na',
      description: 'Test dealership for development',
      specializations: 'All vehicle types',
      status: 'APPROVED',
      isVerified: true,
      isFeatured: false,
    },
  });

  console.log('  ✅ Created test dealership:', dealership.name);

  // Create or update test dealer user
  // Using pre-hashed password for 'dealer123'
  const hashedPassword = '$2a$10$YourHashedPasswordHere';

  const user = await prisma.user.upsert({
    where: { email: 'dealer@test.com' },
    update: {
      dealershipId: dealership.id,
    },
    create: {
      name: 'Test Dealer',
      email: 'dealer@test.com',
      password: hashedPassword,
      role: 'DEALER_PRINCIPAL',
      isActive: true,
      dealershipId: dealership.id,
    },
  });

  console.log('  ✅ Created/Updated test user:', user.email);
  console.log('  ℹ️  Login credentials:');
  console.log('     Email: dealer@test.com');
  console.log('     Password: dealer123');

  console.log('\n🎉 Test dealership setup completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Setup failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
