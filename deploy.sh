#!/bin/bash

# Cars.na VPS Deployment Script
echo "🚀 Starting Cars.na deployment..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2

# Clone repository (if not already cloned)
if [ ! -d "/home/cloudpanel/htdocs/cars-na" ]; then
    cd /home/cloudpanel/htdocs/
    git clone https://github.com/your-username/cars-na.git
fi

cd /home/cloudpanel/htdocs/cars-na

# Install dependencies
npm install

# Setup environment (you'll need to edit .env.local manually)
if [ ! -f ".env.local" ]; then
    echo "⚠️  Creating .env.local template - EDIT THIS FILE!"
    cat > .env.local << EOF
DATABASE_URL="postgresql://cars_na_user:your_secure_password@localhost:5432/cars_na"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret-key"
EOF
fi

# Generate Prisma client
npx prisma generate

echo "✅ Deployment setup complete!"
echo "📝 Next steps:"
echo "1. Edit .env.local with your actual values"
echo "2. Create PostgreSQL database and user"
echo "3. Run: npx prisma db push"
echo "4. Run: npm run build"
echo "5. Run: pm2 start ecosystem.config.js"
