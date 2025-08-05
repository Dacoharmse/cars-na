/**
 * Middleware for route protection in Cars.na
 */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Get the pathname of the request
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Admin routes - only allow ADMIN role
    if (pathname.startsWith("/admin")) {
      if (!token || (token as any).role !== "ADMIN") {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    // Dealer routes - allow DEALER_PRINCIPAL and SALES_EXECUTIVE roles
    if (pathname.startsWith("/dealer")) {
      if (!token || 
          ((token as any).role !== "DEALER_PRINCIPAL" && 
           (token as any).role !== "SALES_EXECUTIVE")) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Public routes that don't require authentication
        const publicRoutes = ["/", "/vehicles", "/about", "/financing", "/sell"];
        const isPublicRoute = publicRoutes.some(route => 
          pathname === route || pathname.startsWith("/vehicles/")
        );
        
        if (isPublicRoute) {
          return true;
        }

        // Protected routes require a token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};