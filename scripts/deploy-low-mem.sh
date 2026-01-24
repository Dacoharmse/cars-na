#!/bin/bash
# Deployment script optimized for low-memory VPS (2GB RAM)

set -e

echo "=== Cars.na Low Memory Deployment Script ==="

# Check if swap exists, if not suggest adding it
SWAP_SIZE=$(free -m | grep Swap | awk '{print $2}')
if [ "$SWAP_SIZE" -lt 1000 ]; then
    echo "WARNING: Swap space is low ($SWAP_SIZE MB). Consider adding swap:"
    echo "  sudo fallocate -l 2G /swapfile"
    echo "  sudo chmod 600 /swapfile"
    echo "  sudo mkswap /swapfile"
    echo "  sudo swapon /swapfile"
    echo "  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab"
    echo ""
fi

# Pull latest changes
echo "Pulling latest changes..."
git pull origin master

# Install dependencies
echo "Installing dependencies..."
npm install --production=false

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema
echo "Pushing database schema..."
npx prisma db push --accept-data-loss

# Build with memory limit
echo "Building application with memory limits..."
export NODE_OPTIONS="--max-old-space-size=1024"
npx next build

# Copy static files to standalone folder
echo "Setting up standalone deployment..."
if [ -d ".next/standalone" ]; then
    cp -r .next/static .next/standalone/.next/
    cp -r public .next/standalone/
    echo "Standalone build ready!"
fi

# Restart PM2 if available
if command -v pm2 &> /dev/null; then
    echo "Restarting PM2 process..."
    pm2 restart cars-na 2>/dev/null || pm2 start .next/standalone/server.js --name cars-na
    pm2 save
else
    echo "PM2 not found. Start the server with:"
    echo "  node .next/standalone/server.js"
    echo ""
    echo "Or install PM2:"
    echo "  npm install -g pm2"
    echo "  pm2 start .next/standalone/server.js --name cars-na"
fi

echo "=== Deployment Complete ==="
