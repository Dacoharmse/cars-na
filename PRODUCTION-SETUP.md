# Cars.na Production Setup Guide

## Database Setup (PostgreSQL)

### Option 1: Automated Setup (Recommended)
Run the setup script:
```bash
./setup-database.sh
```

### Option 2: Manual Setup
If the script doesn't work, follow these steps:

1. **Install PostgreSQL:**
   ```bash
   sudo dnf install -y postgresql postgresql-server postgresql-contrib
   ```

2. **Initialize database:**
   ```bash
   sudo postgresql-setup --initdb
   ```

3. **Start PostgreSQL:**
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

4. **Create database and user:**
   ```bash
   sudo -u postgres psql
   ```
   Then in the PostgreSQL prompt:
   ```sql
   CREATE USER cars_na_user WITH PASSWORD 'cars_na_password';
   CREATE DATABASE cars_na_db OWNER cars_na_user;
   GRANT ALL PRIVILEGES ON DATABASE cars_na_db TO cars_na_user;
   \c cars_na_db
   GRANT ALL ON SCHEMA public TO cars_na_user;
   \q
   ```

5. **Configure authentication** (edit `/var/lib/pgsql/data/pg_hba.conf`):
   Add these lines:
   ```
   local   cars_na_db   cars_na_user                     md5
   host    cars_na_db   cars_na_user   127.0.0.1/32      md5
   host    cars_na_db   cars_na_user   ::1/128           md5
   ```

6. **Restart PostgreSQL:**
   ```bash
   sudo systemctl restart postgresql
   ```

## Application Setup

1. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

2. **Seed the database:**
   ```bash
   npx prisma db seed
   ```

3. **Start the application:**
   ```bash
   npm run dev
   ```

## Verify Database Connection

Test the connection:
```bash
psql -h localhost -U cars_na_user -d cars_na_db
# Enter password: cars_na_password
```

## Production Environment Variables

Ensure your `.env` file has:
```env
DATABASE_URL="postgresql://cars_na_user:cars_na_password@localhost:5432/cars_na_db"
NODE_ENV="production"
NEXTAUTH_SECRET="your-secure-secret-here"
NEXTAUTH_URL="https://your-production-domain.com"
```

## Troubleshooting

### Database connection fails
- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Check logs: `sudo journalctl -u postgresql -n 50`
- Verify user can connect: `psql -h localhost -U cars_na_user -d cars_na_db`

### Prisma migration issues
- Reset database: `npx prisma migrate reset`
- Generate client: `npx prisma generate`
- Try migration again: `npx prisma migrate dev`

### Port 5432 already in use
- Check what's using it: `sudo lsof -i :5432`
- Stop conflicting service or use a different port

## VPS Deployment Notes

When deploying to your VPS:
1. Use the same PostgreSQL version (16)
2. Configure firewall rules for port 5432 if needed
3. Use environment-specific `.env` files
4. Set up automatic backups:
   ```bash
   pg_dump -U cars_na_user -d cars_na_db > backup.sql
   ```
5. Consider using connection pooling (PgBouncer) for production

