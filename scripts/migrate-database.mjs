#!/usr/bin/env node
/**
 * Database Migration Script
 * Migrates data from old deployment to new production database
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';

const execAsync = promisify(exec);

console.log('🔍 Database Migration Script\n');

// Step 1: Find old deployment
console.log('Step 1: Looking for old deployment...');

async function findOldDeployment() {
  try {
    // Check common locations
    const locations = [
      '/var/www',
      '/home',
      '/root'
    ];

    console.log('Checking for .env files with DATABASE_URL...');

    for (const location of locations) {
      try {
        const { stdout } = await execAsync(`find ${location} -maxdepth 3 -name ".env" -type f 2>/dev/null | head -10`);
        const envFiles = stdout.trim().split('\n').filter(f => f);

        for (const envFile of envFiles) {
          if (envFile.includes('cars-na') && !envFile.includes('.next/standalone')) {
            try {
              const content = readFileSync(envFile, 'utf-8');
              if (content.includes('DATABASE_URL')) {
                console.log(`✓ Found potential old deployment: ${dirname(envFile)}`);
                return { path: dirname(envFile), envFile };
              }
            } catch (e) {
              // Skip files we can't read
            }
          }
        }
      } catch (e) {
        // Skip locations we can't access
      }
    }

    // Also check PM2 dump
    try {
      const { stdout } = await execAsync('cat ~/.pm2/dump.pm2 2>/dev/null');
      console.log('\nPM2 saved processes:', stdout);
    } catch (e) {
      console.log('No PM2 dump found');
    }

    return null;
  } catch (error) {
    console.error('Error searching for old deployment:', error.message);
    return null;
  }
}

async function main() {
  try {
    const oldDeployment = await findOldDeployment();

    if (!oldDeployment) {
      console.log('\n⚠️  Could not automatically find old deployment.');
      console.log('\nPlease run these commands to locate it:');
      console.log('  ls -la /var/www/');
      console.log('  ls -la /home/');
      console.log('\nOnce you find it, set OLD_DB_PATH environment variable and run again:');
      console.log('  OLD_DB_PATH=/path/to/old/deployment node migrate-database.mjs');
      process.exit(0);
    }

    console.log(`\n📁 Old deployment found at: ${oldDeployment.path}`);
    console.log(`📄 Env file: ${oldDeployment.envFile}`);

    // Read old .env
    const oldEnv = readFileSync(oldDeployment.envFile, 'utf-8');
    const oldDbMatch = oldEnv.match(/DATABASE_URL="?([^"\n]+)"?/);

    if (!oldDbMatch) {
      console.error('❌ Could not find DATABASE_URL in old .env file');
      process.exit(1);
    }

    const oldDbUrl = oldDbMatch[1];
    console.log(`\n🗄️  Old database: ${oldDbUrl.replace(/:[^:]+@/, ':****@')}`);

    // Read new .env
    const newEnvPath = '/var/www/cars-na/.next/standalone/.env';
    const newEnv = readFileSync(newEnvPath, 'utf-8');
    const newDbMatch = newEnv.match(/DATABASE_URL="?([^"\n]+)"?/);

    if (!newDbMatch) {
      console.error('❌ Could not find DATABASE_URL in new .env file');
      process.exit(1);
    }

    const newDbUrl = newDbMatch[1];
    console.log(`🗄️  New database: ${newDbUrl.replace(/:[^:]+@/, ':****@')}`);

    if (oldDbUrl === newDbUrl) {
      console.log('\n✓ Both deployments use the same database!');
      console.log('No migration needed - the data is already there.');
      console.log('\nYou just need to create an admin user.');
      console.log('Run: node scripts/create-admin.mjs');
      process.exit(0);
    }

    console.log('\n⚠️  Found different databases. Please use the full migration script.');
    console.log('Creating migration SQL script...');

    // Create migration instructions
    const instructions = `
DATABASE MIGRATION INSTRUCTIONS
================================

Old DB: ${oldDbUrl}
New DB: ${newDbUrl}

To migrate data:

1. Backup both databases first:
   pg_dump "${oldDbUrl}" > /tmp/old-db-backup.sql
   pg_dump "${newDbUrl}" > /tmp/new-db-backup.sql

2. Export data from old database:
   pg_dump --data-only --inserts "${oldDbUrl}" > /tmp/migration-data.sql

3. Import into new database:
   psql "${newDbUrl}" < /tmp/migration-data.sql

4. If there are conflicts, you may need to adjust IDs.
   Consider using a tool like pgloader or manual migration.

5. After migration, create admin user:
   node scripts/create-admin.mjs
`;

    writeFileSync('/tmp/migration-instructions.txt', instructions);
    console.log(instructions);
    console.log('\nInstructions saved to: /tmp/migration-instructions.txt');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
