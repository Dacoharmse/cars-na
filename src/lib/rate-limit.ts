/**
 * Rate limiting utilities for Cars.na
 */
import { NextRequest, NextResponse } from 'next/server';

interface WindowEntry {
  count: number;
  resetAt: number;
}

// Single shared store; entries auto-expire by resetAt
const store = new Map<string, WindowEntry>();

// Periodically clean expired entries to prevent memory leaks
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 60_000); // clean every minute
}

/**
 * Returns true if the request is within the rate limit.
 * @param key      Unique key (e.g. IP + endpoint)
 * @param limit    Max requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count < limit) {
    entry.count++;
    return true;
  }

  return false;
}

/** Helper to get client IP from request headers */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const ip = forwarded.split(',')[0].trim();
    if (ip) return ip;
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) return realIP.trim();
  return 'unknown';
}

/**
 * Apply rate limiting to a route handler.
 * Returns a 429 response if the limit is exceeded, otherwise calls handler().
 */
export async function withRateLimit(
  request: NextRequest,
  options: { limit: number; windowMs: number; endpoint?: string },
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const ip = getClientIP(request);
  const key = `${options.endpoint ?? 'default'}:${ip}`;

  if (!checkRateLimit(key, options.limit, options.windowMs)) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(options.windowMs / 1000)) },
      }
    );
  }

  return handler();
}

// Pre-configured limiters
export const contactLimiter = { limit: 5, windowMs: 60_000 };       // 5/min per IP
export const newsletterLimiter = { limit: 3, windowMs: 60_000 };     // 3/min per IP
export const advertiseLimiter = { limit: 3, windowMs: 60_000 };      // 3/min per IP
export const sellVehicleLimiter = { limit: 5, windowMs: 60_000 };    // 5/min per IP
export const inquiryLimiter = { limit: 10, windowMs: 60_000 };       // 10/min per IP
export const searchLimiter = { limit: 60, windowMs: 60_000 };        // 60/min per IP
export const authLimiter = { limit: 10, windowMs: 15 * 60_000 };     // 10/15min per IP

// Legacy export kept for backward compatibility with tRPC trpc.ts import
export function rateLimit(options: { interval: number; uniqueTokenPerInterval: number }) {
  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const allowed = checkRateLimit(token, limit, options.interval);
        if (allowed) resolve();
        else reject(new Error('Rate limit exceeded'));
      }),
  };
}
