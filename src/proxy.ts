import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow static/public paths
  const alwaysAllow = [
    '/_next',
    '/favicon',
    '/images',
    '/static',
    '/api/auth',      // NextAuth itself
    '/api/public',
    '/admin/login',   // admin login page
    '/dealer/login',  // dealer login page
    '/admin-auth',
    '/dealers/register',
  ];

  if (alwaysAllow.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  // ── Admin route protection ─────────────────────────────────────────────
  // /admin/* requires an ADMIN role JWT — redirect to /admin/login NOT
  // the dealer login page (which is NextAuth's global pages.signIn).
  if (pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAdmin =
      token?.role === 'ADMIN' || token?.email === 'admin@cars.na';

    if (!isAdmin) {
      const loginUrl = new URL('/admin/login', request.url);
      // Preserve intended destination so they can return after login
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // All other routes — allow through (no dealer-side middleware needed;
  // dealer pages do their own client-side session checks)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static files.
     */
    '/((?!_next/static|_next/image|favicon.ico|images|static).*)',
  ],
};
