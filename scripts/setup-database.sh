#!/bin/bash

# Cars.na Database Setup Script
echo "🚀 Setting up Cars.na PostgreSQL Database..."

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "📖 Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "📖 Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Start PostgreSQL container
echo "🐘 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if PostgreSQL is running
if docker-compose ps postgres | grep -q "Up"; then
    echo "✅ PostgreSQL is running successfully!"

    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npm run db:generate

    # Push database schema
    echo "📊 Pushing database schema..."
    npm run db:push

    # Optionally run seed script
    if [ -f "prisma/seed.ts" ]; then
        echo "🌱 Running database seed..."
        npm run db:seed
    fi

    echo ""
    echo "🎉 Database setup complete!"
    echo "📋 Connection Details:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: cars_na_db"
    echo "   Username: cars_na_user"
    echo "   Password: cars_na_password"
    echo ""
    echo "🌐 pgAdmin is available at: http://localhost:5050"
    echo "   Email: admin@cars.na"
    echo "   Password: admin123"
    echo ""
    echo "🔗 Connection String:"
    echo "   postgresql://cars_na_user:cars_na_password@localhost:5432/cars_na_db"

else
    echo "❌ Failed to start PostgreSQL container"
    echo "🔍 Check logs with: docker-compose logs postgres"
    exit 1
fi