# Deployment Guide for cars.na Production Updates

## Changes in This Update

### 1. Fixed Dealership Slug Generation (Commit: 2d091a1)
- Dealerships now get automatic slug generation on approval
- Fixed "Dealership not found" error
- Added safeguards against null slug links

### 2. Fixed Notification Toast Background (Commit: a97411b)
- Toast notifications now have solid, readable backgrounds
- Added proper dark mode support

### 3. Fixed Mobile UI Issues (Commit: d0fba6f)
- Improved modal scrolling
- Fixed mobile menu z-index issues with React Portal

### 4. Removed Dealers Listing Page (Commit: d91223e)
- Consolidated dealership browsing to navigation dropdown
- Cleaner user experience

## Deployment Commands for VPS

Run these commands on your VPS as the user running the application:

```bash
# Navigate to your project directory
cd /path/to/cars-na

# Pull latest changes from GitHub
git pull origin master

# Install any new dependencies (if package.json changed)
npm install

# Run the database migration script to fix existing dealerships without slugs
node scripts/fix-dealership-slugs.mjs

# Rebuild the Next.js application
npm run build

# Restart your Node.js process
# Option 1: If using PM2
pm2 restart cars-na

# Option 2: If using systemd
sudo systemctl restart cars-na

# Option 3: If running manually, stop the current process and restart
# Press Ctrl+C to stop, then run:
# npm start
```

## Important Post-Deployment Verification

1. **Verify Slug Migration**: Check that dealerships have slugs
   ```bash
   node scripts/fix-dealership-slugs.mjs
   ```
   Should output: "All approved dealerships already have slugs!"

2. **Test Dealership Pages**:
   - Visit your dealership dropdown menu
   - Click on any dealership
   - Verify the page loads correctly

3. **Test Admin Panel**:
   - Approve a new dealership
   - Verify it gets a slug automatically
   - Check that it appears in the dropdown

4. **Test Notifications**:
   - Trigger any success/error notifications
   - Verify they have solid backgrounds (not translucent)

## Rollback (If Needed)

If issues occur, rollback to the previous version:

```bash
cd /path/to/cars-na
git log --oneline -5  # Find the commit hash before these changes
git reset --hard <previous-commit-hash>
npm install
npm run build
pm2 restart cars-na  # or your restart command
```

## Environment Variables

No new environment variables are required for this update.

## Database Changes

The migration script (`scripts/fix-dealership-slugs.mjs`) will:
- Find all approved dealerships without slugs
- Generate unique slugs from dealership names
- Update the database automatically

This is safe to run multiple times - it will skip dealerships that already have slugs.

## Support

If you encounter issues:
1. Check logs: `pm2 logs cars-na` (or your log command)
2. Verify database connection
3. Check that all environment variables are set correctly
4. Ensure Node.js version is compatible (14+)
