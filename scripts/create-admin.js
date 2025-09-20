const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔐 Creating admin user...');

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin@cars2025', 12);

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@cars.na' }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Updating password...');

      // Update existing admin user
      const updatedUser = await prisma.user.update({
        where: { email: 'admin@cars.na' },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          status: 'ACTIVE',
          isActive: true,
          emailVerified: new Date(),
          updatedAt: new Date()
        }
      });

      console.log('✅ Admin user updated successfully!');
      console.log(`📧 Email: ${updatedUser.email}`);
      console.log(`🔑 Password: admin@cars2025`);
      console.log(`👤 Role: ${updatedUser.role}`);
    } else {
      // Create new admin user
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@cars.na',
          password: hashedPassword,
          name: 'System Administrator',
          role: 'ADMIN',
          status: 'ACTIVE',
          isActive: true,
          emailVerified: new Date(),
          loginCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      console.log('✅ Admin user created successfully!');
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`🔑 Password: admin@cars2025`);
      console.log(`👤 Role: ${adminUser.role}`);
      console.log(`🆔 User ID: ${adminUser.id}`);
    }

    console.log('\\n🎉 You can now login to the admin panel at: /admin-auth');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);

    // Provide helpful debugging information
    if (error.code === 'P1001') {
      console.log('');
      console.log('💡 Database connection failed. Please ensure:');
      console.log('   1. PostgreSQL is running: docker-compose up -d postgres');
      console.log('   2. Database schema is pushed: npm run db:push');
      console.log('   3. Environment variables are correct in .env file');
    } else if (error.code === 'P2002') {
      console.log('');
      console.log('💡 Unique constraint violation. Admin user might already exist.');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createAdminUser();