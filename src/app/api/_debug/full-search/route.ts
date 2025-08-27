import type { NextRequest } from 'next/server';
import OpenAI from 'openai';

let _openaiClient: OpenAI | null = null;
function getOpenAI() {
  try {
    if (_openaiClient) return _openaiClient;
    if (!process.env.OPENAI_API_KEY) return null;
    _openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return _openaiClient;
  } catch (e) {
    console.warn('getOpenAI init failed', e);
    return null;
  }
}

async function fetchWithDebug(url: string, options?: RequestInit) {
  try {
    const r = await fetch(url, options);
    const text = await r.text();
  let json: unknown | undefined;
  try { json = text ? JSON.parse(text) : undefined; } catch { /* not json */ }
    return { ok: r.ok, status: r.status, statusText: r.statusText, json, text };
  } catch (e: unknown) {
    return { error: String(e), stack: e instanceof Error ? e.stack : null };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const q = (body.q as string) || 'ping';
    const reqOrigin = typeof req !== 'undefined' ? new URL(req.url).origin : undefined;
    const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : reqOrigin || `http://localhost:${process.env.PORT || '3001'}`);

    const modules = [
      { path: `${base}/api/newsai`, name: 'newsai' },
      { path: `${base}/api/climateai`, name: 'climateai' },
      { path: `${base}/api/agricultureai`, name: 'agricultureai' },
      { path: `${base}/api/chemistryai`, name: 'chemistryai' },
      { path: `${base}/api/biologyai`, name: 'biologyai' },
      { path: `${base}/api/elementsai`, name: 'elementsai' },
      { path: `${base}/api/historyai`, name: 'historyai' },
      { path: `${base}/api/decisions`, name: 'decisions' },
    ];

    const moduleResults: Record<string, unknown>[] = [];
    for (const m of modules) {
      const url = `${m.path}?q=${encodeURIComponent(q)}`;
      const res = await fetchWithDebug(url);
      moduleResults.push({ module: m.name, url, res });
    }

    // Try OpenAI embeddings directly
    let openaiResult: unknown = null;
    const client = getOpenAI();
    if (client) {
      try {
        const r = await client.embeddings.create({ model: 'text-embedding-3-small', input: q });
        openaiResult = { ok: true, status: 200, dataPreview: Array.isArray(r.data) ? r.data.length : typeof r };
      } catch (err: unknown) {
        openaiResult = { error: String(err), stack: err instanceof Error ? err.stack : null };
      }
    } else {
      openaiResult = { error: 'OPENAI_API_KEY not set' };
    }

    return new Response(JSON.stringify({ base, moduleResults, openaiResult }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: String(err), stack: err instanceof Error ? err.stack : null }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
