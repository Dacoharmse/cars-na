# Cars.na Database Setup Guide

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ and npm

### 1. Start PostgreSQL Database
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Or start everything including pgAdmin
docker-compose up -d
```

### 2. Initialize Database Schema
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 3. Create Admin User
```bash
# Create admin user with credentials admin@cars.na / admin@cars2025
npm run create-admin
```

## 🔧 Database Configuration

### Environment Variables (.env)
```env
DATABASE_URL="postgresql://cars_na_user:cars_na_password@localhost:5432/cars_na_db"
```

### Docker Compose Services
- **PostgreSQL**: `localhost:5432`
- **pgAdmin**: `localhost:5050`

## 📊 Database Schema

### Core Models
- **User**: Authentication, roles, profiles
- **Dealership**: Business information and verification
- **Vehicle**: Car listings with specifications
- **VehicleImage**: Image management
- **Lead**: Customer inquiries
- **UserAuditLog**: Admin action tracking

### User Roles
- `ADMIN`: System administrators
- `DEALER_PRINCIPAL`: Dealership owners
- `SALES_EXECUTIVE`: Sales staff
- `USER`: Regular customers

## 🎯 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run db:setup` | Complete database setup (Docker + Schema + Seed) |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:reset` | Reset database and reseed |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run create-admin` | Create admin user |

## 🔑 Default Credentials

### Admin Panel (`/admin-auth`)
- **Email**: admin@cars.na
- **Password**: admin@cars2025

### Dealer Dashboard (`/dealer/dashboard`)
- **Email**: dealer@namibiamotors.na
- **Password**: dealer2025

## 🛠️ Troubleshooting

### Database Connection Issues
1. Ensure Docker is running
2. Check if PostgreSQL container is up: `docker-compose ps`
3. Verify environment variables in `.env`
4. Restart containers: `docker-compose restart`

### Schema Issues
1. Reset database: `npm run db:reset`
2. Check Prisma logs: `npx prisma db push --preview-feature`
3. Validate schema: `npx prisma validate`

### Port Conflicts
If port 5432 is already in use:
1. Change port in `docker-compose.yml`
2. Update `DATABASE_URL` in `.env`
3. Restart containers

## 📱 Database Management

### pgAdmin Access
- URL: `http://localhost:5050`
- Email: `admin@cars.na`
- Password: `admin123`

### Prisma Studio
```bash
npm run db:studio
# Opens at http://localhost:5555
```

## 🔄 Production Setup

For production deployment:
1. Use managed PostgreSQL service (AWS RDS, Google Cloud SQL, etc.)
2. Update `DATABASE_URL` with production credentials
3. Run migrations: `npx prisma migrate deploy`
4. Disable pgAdmin service in docker-compose.yml

## 📚 Sample Data

The seed script creates:
- 1 Admin user
- 1 Sample dealership (Namibia Motors)
- 1 Dealer principal user
- 5 Sample vehicles (Toyota, BMW, Mercedes, Ford, VW)

## 🔐 Security Notes

- Change default passwords in production
- Use strong `NEXTAUTH_SECRET` in production
- Enable SSL for database connections in production
- Regular database backups recommended