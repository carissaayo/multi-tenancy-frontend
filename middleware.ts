import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Extract subdomain
    const subdomain = hostname.split('.')[0];

    // Public routes that don't need workspace context
    const publicRoutes = ['/login', '/register', '/verify-email'];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    // If accessing workspace routes without subdomain, redirect to workspace selection
    if (!isPublicRoute && subdomain === 'localhost' || subdomain === 'www') {
        if (pathname.startsWith('/workspace')) {
            return NextResponse.redirect(new URL('/select-workspace', request.url));
        }
    }

    // Add workspace slug to headers for API calls
    const response = NextResponse.next();
    if (subdomain && subdomain !== 'localhost' && subdomain !== 'www') {
        response.headers.set('x-workspace-slug', subdomain);
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};