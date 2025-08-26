import { NextResponse } from 'next/server';
// ...existing code...

export function middleware() {
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Content-Security-Policy removed to allow Next.js inline scripts (e.g. runtime styles/scripts).
  // If you want a secure CSP, add appropriate nonces/hashes for inline scripts instead of blanket removal.
  // response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';");
  return response;
}
