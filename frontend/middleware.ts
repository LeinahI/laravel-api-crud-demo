import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Get auth token from cookies or localStorage (stored via cookies for middleware access)
  const token = request.cookies.get('auth_token')?.value;

  // Public routes that should redirect authenticated users
  const publicAuthRoutes = ['/login', '/register',];
  
  // Protected routes that require authentication
  const protectedRoutes = ['/me', '/post/create'];

  // Check if current path is a public auth route
  const isPublicAuthRoute = publicAuthRoutes.includes(pathname);

  // Check if current path is a protected route
  const isProtectedRoute = protectedRoutes.includes(pathname);

  // If authenticated user tries to access login/register, redirect to /me
  if (isPublicAuthRoute && token) {
    return NextResponse.redirect(new URL('/me', request.url));
  }

  // If unauthenticated user tries to access protected routes, redirect to /login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
