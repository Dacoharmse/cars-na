const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding vehicles for showcase...\n');

  try {
    // Get first dealership
    const dealership = await prisma.dealership.findFirst();

    if (!dealership) {
      console.log('No dealership found. Please create a dealership first.');
      return;
    }

    console.log(`Using dealership: ${dealership.name}\n`);

    // Create vehicles with all showcase flags
    const vehicles = [
      {
        dealershipId: dealership.id,
        make: 'Audi',
        model: 'A4',
        year: 2025,
        price: 450000,
        originalPrice: 480000, // Has discount
        mileage: 0,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        bodyType: 'Sedan',
        color: 'Silver',
        description: 'Brand new 2025 Audi A4',
        status: 'AVAILABLE',
        featured: true,
        dealerPick: true,
        isNew: true,
        viewCount: 250,
      },
      {
        dealershipId: dealership.id,
        make: 'BMW',
        model: 'X5',
        year: 2024,
        price: 750000,
        originalPrice: 800000,
        mileage: 5000,
        transmission: 'Automatic',
        fuelType: 'Diesel',
        bodyType: 'SUV',
        color: 'Black',
        description: 'Luxury SUV with low mileage',
        status: 'AVAILABLE',
        featured: true,
        dealerPick: true,
        isNew: false,
        viewCount: 350,
      },
      {
        dealershipId: dealership.id,
        make: 'Toyota',
        model: 'Fortuner',
        year: 2024,
        price: 550000,
        mileage: 12000,
        transmission: 'Automatic',
        fuelType: 'Diesel',
        bodyType: 'SUV',
        color: 'White',
        description: 'Reliable and spacious SUV',
        status: 'AVAILABLE',
        featured: true,
        isNew: false,
        viewCount: 180,
      },
      {
        dealershipId: dealership.id,
        make: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2025,
        price: 650000,
        originalPrice: 700000,
        mileage: 0,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        bodyType: 'Sedan',
        color: 'Blue',
        description: 'Elegant and powerful sedan',
        status: 'AVAILABLE',
        featured: false,
        dealerPick: true,
        isNew: true,
        viewCount: 290,
      },
    ];

    for (const vehicleData of vehicles) {
      const vehicle = await prisma.vehicle.create({
        data: vehicleData,
      });

      console.log(`✓ Created: ${vehicle.year} ${vehicle.make} ${vehicle.model}`);
      console.log(`  - Featured: ${vehicle.featured}`);
      console.log(`  - Dealer Pick: ${vehicle.dealerPick}`);
      console.log(`  - Is New: ${vehicle.isNew}`);
      console.log(`  - View Count: ${vehicle.viewCount}`);
      console.log(`  - Has Discount: ${vehicle.originalPrice ? 'Yes' : 'No'}\n`);
    }

    console.log('✅ Successfully seeded vehicles!\n');

    // Display summary
    const stats = await Promise.all([
      prisma.vehicle.count({ where: { featured: true, status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { dealerPick: true, status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { isNew: true, status: 'AVAILABLE' } }),
      prisma.vehicle.count({ where: { isNew: false, status: 'AVAILABLE' } }),
      prisma.vehicle.count({
        where: {
          originalPrice: { not: null },
          status: 'AVAILABLE'
        }
      }),
    ]);

    console.log('Showcase Summary:');
    console.log(`- Featured Vehicles: ${stats[0]}`);
    console.log(`- Dealer Picks: ${stats[1]}`);
    console.log(`- New Cars: ${stats[2]}`);
    console.log(`- Used Cars: ${stats[3]}`);
    console.log(`- Top Deals (with discounts): ${stats[4]}`);

  } catch (error) {
    console.error('Error seeding vehicles:', error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
