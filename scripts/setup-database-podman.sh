#!/bin/bash

# Cars.na Database Setup Script using Podman
echo "🚀 Setting up Cars.na PostgreSQL Database with Podman..."

# Check if Podman is available
if ! command -v podman &> /dev/null; then
    echo "❌ Podman is not installed. Please install Podman first."
    echo "📖 Visit: https://podman.io/getting-started/installation"
    exit 1
fi

# Stop and remove existing container if it exists
echo "🧹 Cleaning up existing containers..."
podman stop cars-na-postgres 2>/dev/null || true
podman rm cars-na-postgres 2>/dev/null || true

# Create a pod for our services
echo "📦 Creating pod for Cars.na services..."
podman pod rm cars-na-pod 2>/dev/null || true
podman pod create --name cars-na-pod -p 5432:5432 -p 5050:80

# Start PostgreSQL container
echo "🐘 Starting PostgreSQL container..."
podman run -d \
  --name cars-na-postgres \
  --pod cars-na-pod \
  -e POSTGRES_DB=cars_na_db \
  -e POSTGRES_USER=cars_na_user \
  -e POSTGRES_PASSWORD=cars_na_password \
  -e PGDATA=/var/lib/postgresql/data/pgdata \
  -v cars_na_postgres_data:/var/lib/postgresql/data/pgdata \
  postgres:15-alpine

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 15

# Check if PostgreSQL is running
if podman ps --filter "name=cars-na-postgres" --filter "status=running" | grep -q cars-na-postgres; then
    echo "✅ PostgreSQL is running successfully!"

    # Generate Prisma client
    echo "🔧 Generating Prisma client..."
    npm run db:generate

    # Push database schema
    echo "📊 Pushing database schema..."
    npm run db:push

    # Run seed script
    if [ -f "prisma/seed.ts" ]; then
        echo "🌱 Running database seed..."
        npm run db:seed
    fi

    # Start pgAdmin (optional)
    echo "🌐 Starting pgAdmin..."
    podman run -d \
      --name cars-na-pgadmin \
      --pod cars-na-pod \
      -e PGADMIN_DEFAULT_EMAIL=admin@cars.na \
      -e PGADMIN_DEFAULT_PASSWORD=admin123 \
      -e PGADMIN_CONFIG_SERVER_MODE=False \
      -v cars_na_pgadmin_data:/var/lib/pgadmin \
      dpage/pgadmin4:latest

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
    echo ""
    echo "🎯 Next Steps:"
    echo "   1. Create admin user: npm run create-admin"
    echo "   2. Start development server: npm run dev"
    echo "   3. Access admin panel: http://localhost:3000/admin-auth"

else
    echo "❌ Failed to start PostgreSQL container"
    echo "🔍 Check logs with: podman logs cars-na-postgres"
    exit 1
fi