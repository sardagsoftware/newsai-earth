import { NextResponse } from 'next/server';

export async function GET() {
  const marker = 'force-search-marker-20250827-v1';
  return NextResponse.json({ ok: true, marker, branch: process.env.VERCEL_GIT_COMMIT_REF || null, sha: process.env.VERCEL_GIT_COMMIT_SHA || null, now: Date.now() });
}

export async function POST() {
  const marker = 'force-search-marker-20250827-v1';
  return NextResponse.json({ ok: true, marker, branch: process.env.VERCEL_GIT_COMMIT_REF || null, sha: process.env.VERCEL_GIT_COMMIT_SHA || null, now: Date.now() });
}
