import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// ...existing code...

export function middleware(request: NextRequest) {
  // Bypass middleware for asset requests to avoid interfering with Next's static file serving
  const p = request.nextUrl.pathname;
  if (p.startsWith('/_next') || p.startsWith('/favicon.ico') || p.startsWith('/static')) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // generate a per-request nonce and set it in a cookie so server components can read it
  const nonce = Buffer.from(String(Math.random())).toString('base64').replace(/=+$/g, '');
  // CSP: allow self and nonce for scripts. We removed 'unsafe-inline' for scripts to harden policy.
  // Keep 'unsafe-inline' for styles temporarily because some third-party CSS may inject inline styles.
  // Allow openweathermap icons to be loaded (including subdomains); avoid opening img-src to all https: unless necessary
  const csp = `default-src 'self'; img-src 'self' data: https://openweathermap.org https://*.openweathermap.org; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'none'`;
  response.headers.set('Content-Security-Policy', csp);
  // expose nonce to server components via cookie (not HttpOnly so SSR can read via cookies())
  response.cookies.set('csp-nonce', nonce, { path: '/', sameSite: 'lax' });

  return response;
}
