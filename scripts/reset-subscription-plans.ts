import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deleting all existing subscription plans...');

  // Delete all existing plans
  await prisma.subscriptionPlan.deleteMany({});

  console.log('✅ Deleted all existing plans\n');
  console.log('📝 Creating 3 new subscription plans...\n');

  // Create Basic Plan
  const basicPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Basic',
      slug: 'basic',
      description: 'Perfect for small dealerships getting started',
      price: 19900, // N$199.00 in cents
      currency: 'NAD',
      duration: 30, // 30 days
      features: [
        'Up to 10 vehicle listings',
        'Basic photo gallery (5 photos per vehicle)',
        'Email support',
        'Basic analytics',
        'Mobile responsive listings'
      ],
      maxListings: 10,
      maxPhotos: 5,
      priority: 1,
      isActive: true
    }
  });

  console.log(`✅ Created: ${basicPlan.name} - N$${(basicPlan.price / 100).toFixed(2)}/month`);

  // Create Professional Plan
  const professionalPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Professional',
      slug: 'professional',
      description: 'Ideal for growing dealerships with higher volume',
      price: 49900, // N$499.00 in cents
      currency: 'NAD',
      duration: 30, // 30 days
      features: [
        'Up to 50 vehicle listings',
        'Extended photo gallery (15 photos per vehicle)',
        'Priority email support',
        'Advanced analytics dashboard',
        'Featured listings (3 per month)',
        'Social media integration',
        'Lead management system'
      ],
      maxListings: 50,
      maxPhotos: 15,
      priority: 2,
      isActive: true
    }
  });

  console.log(`✅ Created: ${professionalPlan.name} - N$${(professionalPlan.price / 100).toFixed(2)}/month`);

  // Create Premium Plan
  const premiumPlan = await prisma.subscriptionPlan.create({
    data: {
      name: 'Premium',
      slug: 'premium',
      description: 'Complete solution for established dealerships',
      price: 99900, // N$999.00 in cents
      currency: 'NAD',
      duration: 30, // 30 days
      features: [
        'Unlimited vehicle listings',
        'Unlimited photos per vehicle',
        '24/7 priority support',
        'Comprehensive analytics & reports',
        'Unlimited featured listings',
        'Premium placement in search results',
        'Custom branding options',
        'API access for integrations',
        'Dedicated account manager'
      ],
      maxListings: 999999, // Using large number for unlimited
      maxPhotos: 999999, // Using large number for unlimited
      priority: 3,
      isActive: true
    }
  });

  console.log(`✅ Created: ${premiumPlan.name} - N$${(premiumPlan.price / 100).toFixed(2)}/month`);

  console.log('\n🎉 Successfully created 3 subscription plans!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
