import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get('host') || '';
    const subdomain = hostname.split('.')[0];
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

    if (!isPublicRoute && subdomain === 'localhost' || subdomain === 'www') {
        if (pathname.startsWith('/workspace')) {
            return NextResponse.redirect(new URL('/select-workspace', request.url));
        }
    }

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
