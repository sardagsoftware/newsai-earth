export async function GET() {
  const key = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  if (!key) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set in environment' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  try {
    const r = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: 'ping' }),
    });
    const text = await r.text();
    let json: unknown | null = null;
    try { json = text ? JSON.parse(text) : null; } catch { json = null; }
    return new Response(JSON.stringify({ ok: r.ok, status: r.status, statusText: r.statusText, bodyText: (text || '').slice(0,2000), bodyJson: json }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: unknown) {
    return new Response(JSON.stringify({ error: String(e), stack: e instanceof Error ? e.stack : null }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
