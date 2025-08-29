import { NextResponse } from 'next/server';

export async function GET() {
  // Unique marker string to help identify the deployed file contents
  const marker = 'debug-echo-v1-20250827';
  const env = {
    VERCEL_URL: process.env.VERCEL_URL || null,
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || null,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || null,
  };
  return NextResponse.json({ ok: true, marker, env, now: Date.now() });
}
