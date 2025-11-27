import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding subscription plans...');

  // Create Basic Plan
  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'basic' },
    update: {},
    create: {
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

  console.log('Created Basic plan:', basicPlan.name);

  // Create Professional Plan
  const professionalPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'professional' },
    update: {},
    create: {
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

  console.log('Created Professional plan:', professionalPlan.name);

  // Create Premium Plan
  const premiumPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'premium' },
    update: {},
    create: {
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
      maxListings: -1, // -1 means unlimited
      maxPhotos: -1, // -1 means unlimited
      priority: 3,
      isActive: true
    }
  });

  console.log('Created Premium plan:', premiumPlan.name);

  console.log('\n✅ Successfully seeded 3 subscription plans!');
  console.log('\nPlans created:');
  console.log(`1. ${basicPlan.name} - N$${(basicPlan.price / 100).toFixed(2)}/month`);
  console.log(`2. ${professionalPlan.name} - N$${(professionalPlan.price / 100).toFixed(2)}/month`);
  console.log(`3. ${premiumPlan.name} - N$${(premiumPlan.price / 100).toFixed(2)}/month`);
}

main()
  .catch((e) => {
    console.error('Error seeding subscription plans:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
