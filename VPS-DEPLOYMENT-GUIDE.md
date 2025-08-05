# 🚀 Cars.na VPS Deployment Guide (Ubuntu 22.04 LTS)

**Complete guide for deploying Cars.na on an unmanaged VPS without cPanel**

## 📋 **Server Requirements & Specifications**

### **Minimum VPS Requirements**
- **OS**: Ubuntu 22.04 LTS (Recommended)
- **RAM**: 2GB minimum (4GB recommended)
- **Storage**: 20GB SSD minimum (40GB recommended)
- **CPU**: 1 vCPU minimum (2 vCPU recommended)
- **Network**: 1Gbps connection

### **Alternative OS Options** (from your provider)
1. **Ubuntu 22.04 LTS** ⭐ **BEST CHOICE**
2. **Rocky Linux 9** ✅ Good alternative
3. **CentOS 7** ⚠️ Outdated, not recommended
4. **Debian 12** ✅ Good alternative
5. **Fedora 40** ⚠️ Too cutting-edge for production

## 🔧 **Step 1: Initial Server Setup**

### **1.1 Connect to Your VPS**
```bash
# SSH into your server (replace with your server IP)
ssh root@your-server-ip

# Create a new user for security
adduser cars-na
usermod -aG sudo cars-na

# Switch to the new user
su - cars-na
```

### **1.2 Update System**
```bash
# Update package lists and upgrade system
sudo apt update && sudo apt upgrade -y

# Install essential packages
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

### **1.3 Configure Firewall**
```bash
# Enable UFW firewall
sudo ufw enable

# Allow SSH (port 22)
sudo ufw allow 22

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check firewall status
sudo ufw status
```

## 🟢 **Step 2: Install Node.js 20+**

### **2.1 Install Node.js via NodeSource**
```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### **2.2 Install PM2 Process Manager**
```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify PM2 installation
pm2 --version
```

## 🗄️ **Step 3: Install PostgreSQL Database**

### **3.1 Install PostgreSQL**
```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Check PostgreSQL status
sudo systemctl status postgresql
```

### **3.2 Configure PostgreSQL**
```bash
# Switch to postgres user
sudo -u postgres psql

# Inside PostgreSQL shell, create database and user
CREATE DATABASE cars_na_db;
CREATE USER cars_na_user WITH ENCRYPTED PASSWORD 'your-secure-password-here';
GRANT ALL PRIVILEGES ON DATABASE cars_na_db TO cars_na_user;
ALTER USER cars_na_user CREATEDB;

# Exit PostgreSQL shell
\q
```

### **3.3 Configure PostgreSQL for Remote Connections** (Optional)
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and uncomment/modify this line:
listen_addresses = 'localhost'

# Edit pg_hba.conf for authentication
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add this line for local connections:
local   all   cars_na_user   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## 🔒 **Step 4: Setup SSL/TLS with Let's Encrypt**

### **4.1 Install Certbot**
```bash
# Install snapd (if not already installed)
sudo apt install -y snapd

# Install certbot via snap
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Create symlink
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### **4.2 Install Nginx**
```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check Nginx status
sudo systemctl status nginx
```

### **4.3 Configure Nginx for Cars.na**
```bash
# Create Nginx configuration for Cars.na
sudo nano /etc/nginx/sites-available/cars-na
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Serve static files directly
    location /_next/static {
        alias /home/cars-na/cars-na/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Handle favicon and other static assets
    location /favicon.ico {
        alias /home/cars-na/cars-na/public/favicon.ico;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Security: Block access to sensitive files
    location ~ /\. {
        deny all;
    }

    location ~ /(\.env|package\.json|tsconfig\.json) {
        deny all;
    }
}
```

### **4.4 Enable Site and Get SSL Certificate**
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/cars-na /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 📦 **Step 5: Deploy Cars.na Application**

### **5.1 Clone and Setup Application**
```bash
# Navigate to home directory
cd /home/cars-na

# Clone your repository (replace with your repo URL)
git clone https://github.com/your-username/cars-na.git
cd cars-na

# Install dependencies
npm install --production
```

### **5.2 Environment Configuration**
```bash
# Create production environment file
nano .env
```

**Add your production configuration:**
```env
# Database Configuration
DATABASE_URL="postgresql://cars_na_user:your-secure-password-here@localhost:5432/cars_na_db"

# NextAuth.js Configuration
NEXTAUTH_SECRET="generate-a-super-secure-256-bit-secret-here"
NEXTAUTH_URL="https://your-domain.com"

# Environment
NODE_ENV="production"

# Security Settings
BCRYPT_SALT_ROUNDS="12"
RATE_LIMIT_MAX_REQUESTS="100"

# Email Configuration (configure with your SMTP provider)
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT="587"
SMTP_USER="your-smtp-username"
SMTP_PASS="your-smtp-password"
FROM_EMAIL="noreply@your-domain.com"

# Optional: Analytics
GOOGLE_ANALYTICS_ID="your-ga-id"
```

### **5.3 Database Migration**
```bash
# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Verify database connection
npx prisma studio --browser none --port 5555
# Press Ctrl+C to exit after verifying connection
```

### **5.4 Build Application**
```bash
# Build the Next.js application
npm run build

# Test the application locally
npm run start &
curl http://localhost:3000
# Kill the test process
pkill -f "npm run start"
```

## 🚀 **Step 6: Production Process Management**

### **6.1 Create PM2 Ecosystem File**
```bash
# Create PM2 configuration
nano ecosystem.config.js
```

**Add this configuration:**
```javascript
module.exports = {
  apps: [{
    name: 'cars-na',
    script: 'npm',
    args: 'start',
    cwd: '/home/cars-na/cars-na',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/cars-na/logs/err.log',
    out_file: '/home/cars-na/logs/out.log',
    log_file: '/home/cars-na/logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### **6.2 Create Log Directory and Start Application**
```bash
# Create logs directory
mkdir -p /home/cars-na/logs

# Start application with PM2
pm2 start ecosystem.config.js

# Check application status
pm2 status

# View logs
pm2 logs cars-na

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

## 🔧 **Step 7: System Monitoring & Maintenance**

### **7.1 Setup Log Rotation**
```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/cars-na
```

**Add this configuration:**
```
/home/cars-na/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0644 cars-na cars-na
    postrotate
        pm2 reloadLogs
    endscript
}
```

### **7.2 Setup System Monitoring**
```bash
# Install htop for system monitoring
sudo apt install -y htop

# Install PostgreSQL monitoring tools
sudo apt install -y postgresql-client

# Create monitoring script
nano /home/cars-na/monitor.sh
```

**Add monitoring script:**
```bash
#!/bin/bash

echo "=== Cars.na System Status ==="
echo "Date: $(date)"
echo ""

echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== System Resources ==="
free -h
df -h

echo ""
echo "=== Database Status ==="
systemctl status postgresql --no-pager -l

echo ""
echo "=== Nginx Status ==="
systemctl status nginx --no-pager -l

echo ""
echo "=== Recent Application Logs ==="
tail -20 /home/cars-na/logs/combined.log
```

```bash
# Make script executable
chmod +x /home/cars-na/monitor.sh
```

### **7.3 Setup Automated Backups**
```bash
# Create backup script
nano /home/cars-na/backup.sh
```

**Add backup script:**
```bash
#!/bin/bash

BACKUP_DIR="/home/cars-na/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="cars_na_db"
DB_USER="cars_na_user"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
PGPASSWORD="your-secure-password-here" pg_dump -h localhost -U $DB_USER $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C /home/cars-na cars-na --exclude=node_modules --exclude=.next

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make backup script executable
chmod +x /home/cars-na/backup.sh

# Add to crontab for daily backups
crontab -e

# Add this line for daily backups at 2 AM
0 2 * * * /home/cars-na/backup.sh >> /home/cars-na/logs/backup.log 2>&1
```

## 🛡️ **Step 8: Security Hardening**

### **8.1 Configure Fail2Ban**
```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Create custom configuration
sudo nano /etc/fail2ban/jail.local
```

**Add this configuration:**
```ini
[DEFAULT]
bantime = 1h
findtime = 10m
maxretry = 5
backend = systemd

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-noscript]
enabled = true
filter = nginx-noscript
logpath = /var/log/nginx/access.log
maxretry = 6

[nginx-badbots]
enabled = true
filter = nginx-badbots
logpath = /var/log/nginx/access.log
maxretry = 2
```

```bash
# Start and enable Fail2Ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### **8.2 Setup SSH Key Authentication** (Optional but Recommended)
```bash
# On your local machine, generate SSH key
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key to server
ssh-copy-id cars-na@your-server-ip

# Test SSH key login
ssh cars-na@your-server-ip

# Disable password authentication (optional)
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
# Then: sudo systemctl restart sshd
```

### **8.3 Setup Automatic Security Updates**
```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Configure automatic security updates
sudo dpkg-reconfigure -plow unattended-upgrades

# Edit configuration
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

## 📊 **Step 9: Performance Optimization**

### **9.1 Configure Nginx Caching**
```bash
# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/cars-na
```

**Add caching configuration to the server block:**
```nginx
# Add these lines inside the server block

# Gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied expired no-cache no-store private must-revalidate auth;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json;

# Browser caching for static assets
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Pragma public;
    add_header Vary Accept-Encoding;
}
```

### **9.2 Optimize PostgreSQL**
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf
```

**Add these optimizations:**
```ini
# Memory settings (adjust based on your VPS RAM)
shared_buffers = 256MB                  # 25% of RAM for 1GB VPS
effective_cache_size = 512MB            # 50% of RAM
work_mem = 4MB
maintenance_work_mem = 64MB

# Connection settings
max_connections = 100

# Logging
log_min_duration_statement = 1000       # Log slow queries
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '
```

```bash
# Restart PostgreSQL
sudo systemctl restart postgresql
```

## 🚀 **Step 10: Deployment Testing & Verification**

### **10.1 Application Health Checks**
```bash
# Check if application is running
pm2 status

# Test application response
curl -I https://your-domain.com

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Test API endpoints
curl -X POST https://your-domain.com/api/trpc/user.me
```

### **10.2 Performance Testing**
```bash
# Install Apache Bench for load testing
sudo apt install -y apache2-utils

# Test website performance (100 requests, 10 concurrent)
ab -n 100 -c 10 https://your-domain.com/

# Test API performance
ab -n 50 -c 5 https://your-domain.com/api/trpc/vehicle.getAll
```

### **10.3 Database Connection Testing**
```bash
# Test database connection from application
cd /home/cars-na/cars-na
npx prisma studio --browser none --port 5555 &
sleep 5
curl http://localhost:5555
pkill -f "prisma studio"
```

## 🔄 **Step 11: Deployment & Update Procedures**

### **11.1 Create Deployment Script**
```bash
# Create deployment script
nano /home/cars-na/deploy.sh
```

**Add deployment script:**
```bash
#!/bin/bash

set -e

echo "Starting Cars.na deployment..."

# Navigate to application directory
cd /home/cars-na/cars-na

# Pull latest changes
git pull origin main

# Install/update dependencies
npm install --production

# Run database migrations
npx prisma generate
npx prisma db push

# Build application
npm run build

# Restart application
pm2 restart cars-na

# Check application status
sleep 5
pm2 status

echo "Deployment completed successfully!"
```

```bash
# Make deployment script executable
chmod +x /home/cars-na/deploy.sh
```

### **11.2 Zero-Downtime Deployment Script**
```bash
# Create zero-downtime deployment script
nano /home/cars-na/deploy-zero-downtime.sh
```

**Add zero-downtime script:**
```bash
#!/bin/bash

set -e

echo "Starting zero-downtime Cars.na deployment..."

APP_DIR="/home/cars-na/cars-na"
BACKUP_DIR="/home/cars-na/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup before deployment
echo "Creating backup..."
$HOME/backup.sh

# Navigate to application directory
cd $APP_DIR

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Install/update dependencies
echo "Installing dependencies..."
npm install --production

# Run database migrations
echo "Running database migrations..."
npx prisma generate
npx prisma db push

# Build application
echo "Building application..."
npm run build

# Graceful restart with PM2
echo "Restarting application..."
pm2 reload cars-na --wait-ready --listen-timeout 10000

# Verify deployment
echo "Verifying deployment..."
sleep 10

# Health check
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Deployment successful!"
    pm2 status
else
    echo "❌ Deployment failed! Rolling back..."
    pm2 restart cars-na
    exit 1
fi

echo "Zero-downtime deployment completed successfully!"
```

```bash
# Make zero-downtime script executable
chmod +x /home/cars-na/deploy-zero-downtime.sh
```

## 📱 **Step 12: Mobile & API Testing**

### **12.1 Mobile Responsiveness Test**
```bash
# Install curl for testing
curl -A "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)" https://your-domain.com
```

### **12.2 API Endpoint Testing**
```bash
# Create API test script
nano /home/cars-na/test-api.sh
```

**Add API testing script:**
```bash
#!/bin/bash

BASE_URL="https://your-domain.com"

echo "Testing Cars.na API endpoints..."

# Test homepage
echo "Testing homepage..."
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/
echo ""

# Test vehicle listings
echo "Testing vehicle listings..."
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/vehicles
echo ""

# Test API health
echo "Testing tRPC API..."
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/trpc/
echo ""

# Test authentication
echo "Testing authentication..."
curl -s -o /dev/null -w "%{http_code}" $BASE_URL/auth/login
echo ""

echo "API testing completed!"
```

```bash
chmod +x /home/cars-na/test-api.sh
```

## 📊 **Step 13: Monitoring & Alerting Setup**

### **13.1 System Resource Monitoring**
```bash
# Create resource monitoring script
nano /home/cars-na/check-resources.sh
```

**Add resource monitoring:**
```bash
#!/bin/bash

# Thresholds
CPU_THRESHOLD=80
MEMORY_THRESHOLD=80
DISK_THRESHOLD=80

# Get current usage
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
MEMORY_USAGE=$(free | grep Mem | awk '{printf("%.0f", $3/$2 * 100.0)}')
DISK_USAGE=$(df -h / | awk 'NR==2{printf("%d", $5)}')

echo "=== Resource Usage ==="
echo "CPU: ${CPU_USAGE}%"
echo "Memory: ${MEMORY_USAGE}%"
echo "Disk: ${DISK_USAGE}%"

# Check thresholds and alert
if (( $(echo "$CPU_USAGE > $CPU_THRESHOLD" | bc -l) )); then
    echo "⚠️ HIGH CPU USAGE: ${CPU_USAGE}%"
fi

if [ $MEMORY_USAGE -gt $MEMORY_THRESHOLD ]; then
    echo "⚠️ HIGH MEMORY USAGE: ${MEMORY_USAGE}%"
fi

if [ $DISK_USAGE -gt $DISK_THRESHOLD ]; then
    echo "⚠️ HIGH DISK USAGE: ${DISK_USAGE}%"
fi
```

```bash
chmod +x /home/cars-na/check-resources.sh

# Add to crontab for regular monitoring
crontab -e
# Add: */5 * * * * /home/cars-na/check-resources.sh >> /home/cars-na/logs/resources.log 2>&1
```

## 🆘 **Step 14: Troubleshooting Guide**

### **14.1 Common Issues & Solutions**

#### **Application Won't Start**
```bash
# Check PM2 logs
pm2 logs cars-na

# Check application build
cd /home/cars-na/cars-na
npm run build

# Check database connection
npx prisma studio --browser none --port 5555
```

#### **Database Connection Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
sudo -u postgres psql -c "SELECT version();"

# Check database exists
sudo -u postgres psql -c "\l"
```

#### **SSL Certificate Issues**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --dry-run

# Check Nginx configuration
sudo nginx -t
```

#### **High Memory Usage**
```bash
# Check Node.js memory usage
pm2 monit

# Restart application to clear memory
pm2 restart cars-na
```

### **14.2 Log Analysis**
```bash
# Application logs
tail -f /home/cars-na/logs/combined.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# System logs
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f
```

## 🎯 **Step 15: Go-Live Checklist**

### **Pre-Launch Verification**
- [ ] Domain DNS pointing to VPS IP
- [ ] SSL certificate installed and working
- [ ] Database connection successful
- [ ] Application building and starting correctly
- [ ] PM2 process management working
- [ ] Nginx reverse proxy configured
- [ ] Firewall rules configured
- [ ] Backups scheduled and tested
- [ ] Monitoring scripts in place
- [ ] Performance testing completed

### **Security Checklist**
- [ ] SSH key authentication enabled
- [ ] Fail2Ban configured and running
- [ ] Security headers configured
- [ ] Database secured with strong passwords
- [ ] Environment variables secured
- [ ] Automatic security updates enabled
- [ ] Log rotation configured

### **Performance Checklist**
- [ ] Nginx caching configured
- [ ] PostgreSQL optimized
- [ ] PM2 cluster mode enabled
- [ ] Static file serving optimized
- [ ] Gzip compression enabled
- [ ] Load testing completed

## 🎉 **Congratulations!**

Your Cars.na application is now successfully deployed on your unmanaged VPS! 

### **What You've Achieved:**
- ✅ **Secure Production Environment** - Enterprise-grade security
- ✅ **High Performance Setup** - Optimized for speed and scalability
- ✅ **Automated Backups** - Daily database and application backups
- ✅ **SSL/TLS Encryption** - Secure HTTPS communication
- ✅ **Process Management** - Automatic restarts and clustering
- ✅ **Monitoring & Logging** - Comprehensive system monitoring
- ✅ **Zero-Downtime Deployments** - Seamless updates

### **Useful Commands:**
```bash
# Check application status
pm2 status

# View logs
pm2 logs cars-na

# Restart application
pm2 restart cars-na

# Deploy updates
/home/cars-na/deploy-zero-downtime.sh

# Monitor resources
/home/cars-na/check-resources.sh

# Create backup
/home/cars-na/backup.sh
```

Your Cars.na vehicle marketplace is now live and ready to serve the Namibian automotive market! 🚗✨