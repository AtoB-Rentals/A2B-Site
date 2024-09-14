// middleware.js
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')
    const url = req.nextUrl

    // If the token is missing, redirect to the login page
    if (url.pathname.startsWith('/manager') && url.pathname !== '/manager/login') {
        // Manager-specific authentication
        if (!token) {
            return NextResponse.redirect(new URL('/manager/login', req.url));
        }
    } else if (url.pathname.startsWith('/user')) {
        // User-specific authentication
        if (!token) {
            return NextResponse.redirect(new URL('/user/login', req.url));
        }
    } else if (url.pathname.startsWith('/admin')) {
        // Admin-specific authentication
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', req.url));
        }
    }
}

// Define the paths where this middleware should be applied
export const config = {
    matcher: ['/manager/:path*']
};
