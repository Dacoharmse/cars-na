import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to generate a unique slug from dealership name
function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

async function fixDealershipSlugs() {
  try {
    console.log('🔍 Finding dealerships without slugs...');

    // Find all approved dealerships that don't have a slug
    const dealershipsWithoutSlugs = await prisma.dealership.findMany({
      where: {
        OR: [
          { slug: null },
          { slug: '' }
        ],
        status: 'APPROVED'
      }
    });

    console.log(`📋 Found ${dealershipsWithoutSlugs.length} dealerships without slugs`);

    if (dealershipsWithoutSlugs.length === 0) {
      console.log('✅ All approved dealerships already have slugs!');
      return;
    }

    // Update each dealership with a unique slug
    for (const dealership of dealershipsWithoutSlugs) {
      let baseSlug = generateSlug(dealership.name);
      let slug = baseSlug;

      // Ensure slug is unique by appending a number if needed
      let counter = 1;
      while (await prisma.dealership.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      await prisma.dealership.update({
        where: { id: dealership.id },
        data: { slug }
      });

      console.log(`✅ Updated "${dealership.name}" with slug: "${slug}"`);
    }

    console.log(`\n🎉 Successfully updated ${dealershipsWithoutSlugs.length} dealerships!`);
  } catch (error) {
    console.error('❌ Error fixing dealership slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDealershipSlugs();
