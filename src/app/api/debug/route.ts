import { NextResponse } from 'next/server';
import * as net from 'net';
import * as dns from 'dns/promises';

async function testTCP(host: string, port: number, timeoutMs = 5000): Promise<string> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timer = setTimeout(() => { socket.destroy(); resolve(`timeout after ${timeoutMs}ms`); }, timeoutMs);
    socket.connect(port, host, () => { clearTimeout(timer); socket.destroy(); resolve('connected'); });
    socket.on('error', (e) => { clearTimeout(timer); resolve(`error: ${e.message}`); });
  });
}

export async function GET() {
  const url = process.env.DATABASE_URL || 'NOT SET';
  const masked = url.replace(/:([^:@]+)@/, ':***@');

  // DNS lookups
  let directDns = 'fail';
  let poolerDns = 'fail';
  try { directDns = JSON.stringify(await dns.resolve4('db.tcihyirnfhpsktuveaym.supabase.co')); } catch(e) { directDns = `IPv4 fail: ${e instanceof Error ? e.message : e}`; }
  try { poolerDns = JSON.stringify(await dns.resolve4('aws-0-eu-west-2.pooler.supabase.com')); } catch(e) { poolerDns = `IPv4 fail: ${e instanceof Error ? e.message : e}`; }

  // TCP tests
  const directTCP = await testTCP('db.tcihyirnfhpsktuveaym.supabase.co', 5432);
  const pooler6543 = await testTCP('aws-0-eu-west-2.pooler.supabase.com', 6543);
  const pooler5432 = await testTCP('aws-0-eu-west-2.pooler.supabase.com', 5432);

  return NextResponse.json({ DATABASE_URL: masked, NODE_ENV: process.env.NODE_ENV, directDns, poolerDns, directTCP, pooler6543, pooler5432 });
}
