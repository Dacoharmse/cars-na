import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('💳 Starting subscription plans seeding...');

  const basicPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'basic' },
    update: {},
    create: {
      name: 'Basic',
      slug: 'basic',
      description: 'Perfect for small dealerships getting started',
      price: 19900, // N$199.00
      currency: 'NAD',
      duration: 1, // 1 month
      features: JSON.stringify([
        'Up to 10 vehicle listings',
        '5 photos per listing',
        'Basic analytics',
        'Email support',
        'Standard search visibility'
      ]),
      maxListings: 10,
      maxPhotos: 5,
      priority: 1,
      isActive: true
    }
  });

  const standardPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'standard' },
    update: {},
    create: {
      name: 'Standard',
      slug: 'standard',
      description: 'Most popular plan for growing dealerships',
      price: 49900, // N$499.00
      currency: 'NAD',
      duration: 1,
      features: JSON.stringify([
        'Up to 50 vehicle listings',
        '10 photos per listing',
        'Advanced analytics dashboard',
        'Priority email & phone support',
        'Enhanced search visibility',
        'Featured dealer badge',
        '2 featured listings per month'
      ]),
      maxListings: 50,
      maxPhotos: 10,
      priority: 2,
      isActive: true
    }
  });

  const premiumPlan = await prisma.subscriptionPlan.upsert({
    where: { slug: 'premium' },
    update: {},
    create: {
      name: 'Premium',
      slug: 'premium',
      description: 'Ultimate plan for established dealerships',
      price: 99900, // N$999.00
      currency: 'NAD',
      duration: 1,
      features: JSON.stringify([
        'Unlimited vehicle listings',
        'Unlimited photos per listing',
        'Premium analytics & insights',
        'Dedicated account manager',
        'Top search visibility',
        'Premium dealer badge',
        '10 featured listings per month',
        'Social media promotion',
        'Homepage banner placement',
        'Custom dealership page'
      ]),
      maxListings: 0, // 0 = unlimited
      maxPhotos: 20,
      priority: 3,
      isActive: true
    }
  });

  console.log('  ✅ Created Basic plan: N$199/month');
  console.log('  ✅ Created Standard plan: N$499/month');
  console.log('  ✅ Created Premium plan: N$999/month');

  console.log('\n🎉 Subscription plans seeding completed successfully!');
  console.log('📊 Summary: Created 3 subscription plans');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Subscription plans seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
