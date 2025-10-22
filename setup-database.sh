#!/bin/bash
# Production-ready PostgreSQL setup script for Cars.na

echo "========================================="
echo "Cars.na Database Setup Script"
echo "========================================="
echo ""

# Install PostgreSQL
echo "1. Installing PostgreSQL..."
sudo dnf install -y postgresql postgresql-server postgresql-contrib

# Initialize database
echo "2. Initializing PostgreSQL database..."
sudo postgresql-setup --initdb

# Start and enable PostgreSQL service
echo "3. Starting PostgreSQL service..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
echo "4. Creating database and user..."
sudo -u postgres psql << SQL
CREATE USER cars_na_user WITH PASSWORD 'cars_na_password';
CREATE DATABASE cars_na_db OWNER cars_na_user;
GRANT ALL PRIVILEGES ON DATABASE cars_na_db TO cars_na_user;
\c cars_na_db
GRANT ALL ON SCHEMA public TO cars_na_user;
SQL

# Configure PostgreSQL to allow local connections
echo "5. Configuring PostgreSQL authentication..."
sudo bash -c "cat >> /var/lib/pgsql/data/pg_hba.conf << HBA
# Cars.na local connections
local   cars_na_db   cars_na_user                     md5
host    cars_na_db   cars_na_user   127.0.0.1/32      md5
host    cars_na_db   cars_na_user   ::1/128           md5
HBA"

# Restart PostgreSQL
echo "6. Restarting PostgreSQL..."
sudo systemctl restart postgresql

echo ""
echo "========================================="
echo "PostgreSQL setup complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Run: npx prisma migrate dev"
echo "2. Run: npx prisma db seed"
echo "3. Start your app: npm run dev"
