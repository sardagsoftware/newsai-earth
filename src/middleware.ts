import { NextResponse } from 'next/server';
// ...existing code...

export function middleware() {
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // generate a per-request nonce and set it in a cookie so server components can read it
  const nonce = Buffer.from(String(Math.random())).toString('base64').replace(/=+$/g, '');
  // CSP: allow self and nonce for scripts. We removed 'unsafe-inline' for scripts to harden policy.
  // Keep 'unsafe-inline' for styles temporarily because some third-party CSS may inject inline styles.
  const csp = `default-src 'self'; img-src 'self' data:; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'none'`;
  response.headers.set('Content-Security-Policy', csp);
  // expose nonce to server components via cookie (not HttpOnly so SSR can read via cookies())
  response.cookies.set('csp-nonce', nonce, { path: '/', sameSite: 'lax' });

  return response;
}
