import { NextResponse } from 'next/server';
// ...existing code...

export function middleware() {
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline';");
  return response;
}
