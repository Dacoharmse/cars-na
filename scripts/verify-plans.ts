import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { priority: 'asc' }
  });

  console.log('\n📋 Subscription Plans in Database:\n');
  plans.forEach((plan, index) => {
    console.log(`${index + 1}. ${plan.name}`);
    console.log(`   Price: N$${(plan.price / 100).toFixed(2)}/month`);
    console.log(`   Max Listings: ${plan.maxListings === -1 ? 'Unlimited' : plan.maxListings}`);
    console.log(`   Max Photos: ${plan.maxPhotos === -1 ? 'Unlimited' : plan.maxPhotos}`);
    console.log(`   Features: ${plan.features.length} features`);
    console.log(`   Active: ${plan.isActive ? 'Yes' : 'No'}`);
    console.log('');
  });

  console.log(`✅ Total plans: ${plans.length}\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
