import { NextResponse } from 'next/server';

export async function GET() {
  const url = process.env.DATABASE_URL || 'NOT SET';
  const directUrl = process.env.DIRECT_URL || 'NOT SET';
  const masked = url.replace(/:([^:@]+)@/, ':***@');
  const maskedDirect = directUrl.replace(/:([^:@]+)@/, ':***@');
  
  // Try raw pg connection
  let pgResult = 'not tested';
  try {
    const { Client } = await import('pg');
    const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 5000 });
    await client.connect();
    const res = await client.query('SELECT 1 as ok');
    await client.end();
    pgResult = `success: ${JSON.stringify(res.rows)}`;
  } catch (e: unknown) {
    pgResult = `error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({ DATABASE_URL: masked, DIRECT_URL: maskedDirect, NODE_ENV: process.env.NODE_ENV, pgResult });
}
