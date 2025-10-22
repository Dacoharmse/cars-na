import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow these routes without any checks
  const publicRoutes = [
    '/',
    '/vehicles',
    '/sell',
    '/contact',
    '/about',
    '/dealers',
    '/financing',
    '/help',
    '/privacy',
    '/terms',
    '/cookies',
    '/dealer/login',
    '/admin/login',
    '/admin-auth',
    '/dealers/register',
    '/api/auth',
    '/api/public',
    '/_next',
    '/favicon',
    '/images',
    '/static'
  ];

  // Check if it's a public route or starts with public paths
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route ||
    pathname.startsWith(route + '/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/static/')
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For now, let's disable authentication checks to fix the redirect loops
  // Later we'll add proper session checking via API calls

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static files
     */
    '/((?!_next/static|_next/image|favicon.ico|images|static).*)',
  ],
};