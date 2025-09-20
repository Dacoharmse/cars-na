-- Cars.na Database Initialization Script
-- This script sets up the initial database structure and sample data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE cars_na_db TO cars_na_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cars_na_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cars_na_user;

-- Create demo admin user (will be handled by Prisma migrations later)
-- Initial setup complete