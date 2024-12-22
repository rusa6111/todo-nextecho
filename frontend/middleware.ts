import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('Authorization')?.value;

    if (!token && request.nextUrl.pathname.startsWith('/todo')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup' || request.nextUrl.pathname === '/')) {
        return NextResponse.redirect(new URL('/todo', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/todo/:path*', '/', '/login', '/signup'],
};
