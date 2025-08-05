/**
 * Rate limiting utilities for Cars.na
 */
import { NextRequest } from 'next/server';

interface RateLimitOptions {
  interval: number; // Time window in milliseconds
  uniqueTokenPerInterval: number; // Max number of tokens per interval
}

const rateLimitMap = new Map();

export function rateLimit(options: RateLimitOptions) {
  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = rateLimitMap.get(token) || [0, Date.now()];
        const [count, lastReset] = tokenCount;
        const now = Date.now();
        const timePassed = now - lastReset;

        if (timePassed > options.interval) {
          rateLimitMap.set(token, [1, now]);
          resolve();
        } else if (count < limit) {
          rateLimitMap.set(token, [count + 1, lastReset]);
          resolve();
        } else {
          reject(new Error('Rate limit exceeded'));
        }
      }),
  };
}

// Create rate limiters for different endpoints
export const authLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500, // Limit each IP to 500 requests per interval
});

export const searchLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000, // Limit each IP to 1000 requests per minute
});

export const contactLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 100, // Limit each IP to 100 requests per minute
});

// Helper function to get client IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return request.ip || 'unknown';
}

// Rate limit middleware for API routes
export async function withRateLimit<T>(
  request: NextRequest,
  limiter: ReturnType<typeof rateLimit>,
  maxRequests: number,
  handler: () => Promise<T>
): Promise<T> {
  const ip = getClientIP(request);
  
  try {
    await limiter.check(maxRequests, ip);
    return await handler();
  } catch (error) {
    throw new Error('Too many requests, please try again later');
  }
}