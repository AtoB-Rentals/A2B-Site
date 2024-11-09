// middleware.js
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    // Get the IP address
    let ip = req.ip

    if (req.headers.get('x-forwarded-for') && req.headers.get('x-forwarded-for') !== "::1") {
        ip = req.headers.get('x-forwarded-for') || ip
    } else if (req.ip) {
        ip = req.ip
    }

    const response = NextResponse.next()

    // Prepare the response
    if (ip) {
        response.headers.set('X-Client-IP', ip); // Set the IP in the response headers
    }

    // Check the path and handle redirects based on authentication token
    // if (url.pathname.startsWith('/manager') && url.pathname !== '/manager/login' && !token) {

    //     return NextResponse.redirect(new URL('/manager/login', req.url))
    // } else if (url.pathname.startsWith('/user') && url.pathname !== '/user/login' && !token) {

    //     return NextResponse.redirect(new URL('/user/login', req.url))
    // } else if (url.pathname.startsWith('/host') && url.pathname !== '/host/login' && !token) {

    //     return NextResponse.redirect(new URL('/host/login', req.url))
    // }

    // Return the response with the IP header if no redirects happen
    return response;
}

// Define the paths where this middleware should be applied
// export const config = {
//     matcher: ['/']
// };
