-- Clean all demo data from the database
-- This script will delete all records from all tables except SubscriptionPlan

-- Delete dependent records first (to respect foreign key constraints)
DELETE FROM "Lead";
DELETE FROM "VehicleImage";
DELETE FROM "FeaturedListing";
DELETE FROM "Vehicle";
DELETE FROM "Account";
DELETE FROM "Session";
DELETE FROM "UserAuditLog";
DELETE FROM "DealershipSubscription";
DELETE FROM "SubscriptionNotification";
DELETE FROM "UsageAnalytics";
DELETE FROM "Payment";
DELETE FROM "User";
DELETE FROM "Dealership";

-- Show counts to verify
SELECT 'User' as table_name, COUNT(*) as record_count FROM "User"
UNION ALL
SELECT 'Dealership', COUNT(*) FROM "Dealership"
UNION ALL
SELECT 'Vehicle', COUNT(*) FROM "Vehicle"
UNION ALL
SELECT 'Lead', COUNT(*) FROM "Lead"
UNION ALL
SELECT 'SubscriptionPlan', COUNT(*) FROM "SubscriptionPlan";
