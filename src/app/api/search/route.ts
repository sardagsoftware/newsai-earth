import type { NextRequest } from "next/server";
import OpenAI from "openai";
import { upsertToPinecone } from "../../../lib/pinecone";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function logError(tag: string, e: unknown) {
  try {
    if (e instanceof Error) {
      console.error(`[${tag}]`, e.message, "stack:", e.stack);
    } else {
      console.error(`[${tag}]`, JSON.stringify(e));
    }
  } catch (err) {
    console.error(`[${tag}] error serializing error`, err);
  }
}

async function fetchWithDebug(url: string, options?: RequestInit, tag?: string) {
  try {
    const r = await fetch(url, options);
    const text = await r.text();
    let json: unknown | undefined;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch (e) {
      // not JSON
    }
    return { ok: r.ok, status: r.status, statusText: r.statusText, json, text };
  } catch (e) {
    logError(`fetchWithDebug:${tag ?? url}`, e);
    throw e;
  }
}

function cosine(a: number[], b: number[]) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}

async function embedTexts(texts: string[]) {
  if (!process.env.OPENAI_API_KEY) return [];
  const batchSize = 32;
  const embeddings: number[][] = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    try {
      const resp = await openai.embeddings.create({ model: "text-embedding-3-small", input: batch });
      for (const d of resp.data) embeddings.push(d.embedding as number[]);
    } catch (e) {
      logError('embedTexts.batch', e);
      // if a batch fails, continue with what we have
    }
  }
  return embeddings;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let q = "";
  let formData: FormData | null = null;
    if (contentType.includes("multipart/form-data")) {
  formData = await req.formData();
  const qv = formData.get("q");
  q = typeof qv === "string" ? qv : "";
    } else {
      const body = await req.json();
      q = body.q || "";
    }

  // Determine base URL robustly: prefer explicit env, then Vercel-provided URL, then request origin, then a safe production fallback.
  const reqOrigin = typeof req !== 'undefined' ? new URL(req.url).origin : undefined;
  const safeProdDomain = 'https://newsai-earth.vercel.app';
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (reqOrigin || safeProdDomain));

  // Strong debug short-circuit: allow verifying that this deployed function is the latest.
  // Trigger via POST /api/search?force_debug=1 or by sending q === '__PING__'
  try {
    const _reqUrlForPing = new URL(req.url);
    const forceDebug = _reqUrlForPing.searchParams.get('force_debug') === '1';
    if (forceDebug || q === '__PING__') {
      return new Response(JSON.stringify({ ok: true, debugBase: base, reqOrigin, VERCEL_URL: process.env.VERCEL_URL || null, now: Date.now() }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (e) {
    // ignore URL parse errors for debug
  }
    const modules = [
      { path: `${base}/api/newsai`, name: "Haber & AI" },
      { path: `${base}/api/climateai`, name: "İklim & AI" },
      { path: `${base}/api/agricultureai`, name: "Tarım & AI" },
      { path: `${base}/api/chemistryai`, name: "Kimya & AI" },
      { path: `${base}/api/biologyai`, name: "Biyoloji & AI" },
      { path: `${base}/api/elementsai`, name: "Element & Bilim" },
      { path: `${base}/api/historyai`, name: "Tarih & AI" },
      { path: `${base}/api/decisions`, name: "Bakanlık Kararları" },
    ];

  const settled: Array<Record<string, unknown>> = [];
  // allow quick verbose debugging from prod: POST /api/search?debug=1
  const reqUrl = new URL(req.url);
  const verboseDebug = reqUrl.searchParams.get('debug') === '1';
  // Perform sequential fetches so we can capture the first failure context more clearly in logs
  for (const m of modules) {
    try {
      if (formData && (m.path === "/api/newsai" || m.path === "/api/decisions")) {
        const fd = new FormData();
        fd.append("q", q);
        for (const f of formData.getAll("images")) fd.append("images", f as unknown as Blob);
        for (const f of formData.getAll("files")) fd.append("files", f as unknown as Blob);
        const r = await fetchWithDebug(m.path, { method: "POST", body: fd }, 'module-multipart');
        settled.push({ module: m.name, payload: r.json ?? r.text ?? { status: r.status, ok: r.ok }, debug: { status: r.status, text: (r.text || '').slice(0,1000) } });
        continue;
      }
      const r = await fetchWithDebug(`${m.path}?q=${encodeURIComponent(q)}`, undefined, 'module-get');
      settled.push({ module: m.name, payload: r.json ?? r.text ?? { status: r.status, ok: r.ok }, debug: { status: r.status, text: (r.text || '').slice(0,1000) } });
    } catch (e) {
  // Ensure we capture detailed error info into the settled array so the prod response surfaces it
  logError('module.fetch', { path: m.path, err: e });
  const errMsg = e instanceof Error ? e.message : JSON.stringify(e);
  const errStack = e instanceof Error && e.stack ? e.stack : undefined;
  settled.push({ error: errMsg, source: m.path, stack: errStack });
      // keep going to collect other modules but note the failure
    }

  // TEMP DEBUG: immediately return settled to inspect which module fetch failed in prod
  try {
    return new Response(JSON.stringify({ settled, debugBase: base }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    // fallthrough to normal behavior
  }
  }

    // Collect fetch-level errors to return for debugging (temporary)
    const fetchErrors: Array<Record<string, unknown>> = [];
    for (const s of settled) {
      if (s && typeof s === 'object' && 'error' in (s as Record<string, unknown>)) {
        const se = s as Record<string, unknown>;
        fetchErrors.push({ source: se.source ?? se.module ?? 'unknown', error: se.error ?? se, stack: se.stack ?? null });
      }
    }

    // If verbose debug requested, return the raw settled array and fetchErrors for diagnosis
    if (verboseDebug) {
      // limit text sizes to avoid huge responses
      const limited = settled.map((it) => {
        try {
          const copy: Record<string, unknown> = {};
          for (const k of Object.keys(it)) {
            const v = (it as Record<string, unknown>)[k];
            if (typeof v === 'string') copy[k] = v.slice(0, 2000);
            else if (typeof v === 'object' && v !== null && 'text' in (v as any)) {
              copy[k] = { status: (v as any).status, text: String((v as any).text).slice(0, 2000) };
            } else copy[k] = v;
          }
          return copy;
        } catch (e) {
          return { error: 'serialize-failed' };
        }
      });
      return new Response(JSON.stringify({ results: [], settled: limited, fetchErrors, debugBase: base }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    // Flatten, tag with source, dedupe and limit
    const rawResults: unknown[] = [];
    for (const entry of settled) {
      const e = entry as unknown as { module?: string; payload?: unknown };
      const moduleName = e.module ?? "Unknown";
      const p = e.payload ?? e;
      if (p && typeof p === "object") {
        const obj = p as Record<string, unknown>;
        // If this is an error object (from a failed fetch), record it in fetchErrors and skip adding as a result
        if ('error' in obj) {
          fetchErrors.push({ source: obj.source ?? moduleName, error: obj.error ?? obj, stack: obj.stack ?? null });
          continue;
        }
        if (Array.isArray(obj.articles)) {
          for (const a of obj.articles) rawResults.push({ ...(a as Record<string, unknown>), source: obj.source ?? moduleName });
        } else if (Array.isArray(p)) {
          for (const a of (p as unknown[])) rawResults.push({ ...(a as Record<string, unknown>), source: moduleName });
        } else {
          rawResults.push({ ...(obj as Record<string, unknown>), source: obj.source ?? moduleName });
        }
      } else {
        rawResults.push({ value: p, source: moduleName });
      }
    }

    // Deduplicate by id/url/title fallback
    const seen = new Set<string>();
    const results: Record<string, unknown>[] = [];
    for (const item of rawResults) {
      const it = item as Record<string, unknown>;
      const key = (typeof it.id === "string" && it.id) || (typeof it.url === "string" && it.url) || (typeof it.title === "string" && it.title) || JSON.stringify(it);
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      results.push(it);
      if (results.length >= 120) break; // collect a bit more before ranking
    }

    // If OpenAI key present, embed query and results and re-rank by cosine similarity
    if (process.env.OPENAI_API_KEY && q.trim()) {
      try {
        const queryEmbeddingResp = await openai.embeddings.create({ model: "text-embedding-3-small", input: q });
        const queryEmbedding = queryEmbeddingResp.data[0].embedding as number[];

        // Build texts to embed for results: prefer title + summary/description
        const texts = results.map((r) => {
          const title = typeof r.title === "string" ? r.title : "";
          const summary = typeof r.summary === "string" ? r.summary : typeof r.description === "string" ? r.description : "";
          return (title + " \n " + summary).slice(0, 2000);
        });

        let resEmbeddings: number[][] = [];
        try {
          resEmbeddings = await embedTexts(texts);
        } catch (e) {
          logError('embedTexts', e);
        }
        // optionally upsert embeddings into Pinecone for faster future queries
        if (process.env.PINECONE_API_KEY && process.env.PINECONE_URL) {
          try {
            const vectors = resEmbeddings.map((v, i) => ({ id: `search-${Date.now()}-${i}`, values: v, metadata: { title: results[i].title, source: results[i].source } }));
            await upsertToPinecone('newsai-index', vectors);
          } catch (e) {
            logError('pinecone.upsert', e);
          }
        }
        const scored: { score: number; item: Record<string, unknown> }[] = [];
        for (let i = 0; i < results.length && i < resEmbeddings.length; i++) {
          const sc = cosine(queryEmbedding, resEmbeddings[i]);
          scored.push({ score: sc, item: results[i] });
        }
        scored.sort((a, b) => b.score - a.score);
        const top = scored.slice(0, 30).map((s) => ({ ...s.item, _score: s.score }));
  // If HF is disabled by env var, skip HF rerank
  if (!process.env.HF_DISABLED && process.env.HF_API_TOKEN && top.length > 1) {
          try {
            const hfCandidates = top.map((t) => {
              const obj = t as Record<string, unknown>;
              const title = typeof obj.title === 'string' ? obj.title : String(obj.title ?? '');
              const summary = typeof obj.summary === 'string' ? obj.summary : String(obj.summary ?? '');
              return (title + '\n' + summary).slice(0, 2000);
            });
            const hfBody = { inputs: { query: q, candidates: hfCandidates } };
            // prefer explicit endpoint if provided, otherwise try the model-level inference path
            const hfModelUrl = 'https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-V3.1-Base';
            const hfEndpointUrl = process.env.HF_ENDPOINT ? process.env.HF_ENDPOINT : hfModelUrl;
            const hfResp = await fetchWithDebug(hfEndpointUrl, {
              method: 'POST',
              headers: { Authorization: `Bearer ${process.env.HF_API_TOKEN}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(hfBody),
            }, 'hf-rerank');
            if (!hfResp.ok) {
              logError('hf.rerank.http', { status: hfResp.status, textPreview: (hfResp.text || '').slice(0, 1000) });
              if (hfResp.status === 404 && hfEndpointUrl === hfModelUrl) {
                console.warn('Model-level inference returned 404. Consider creating a Hugging Face Inference Endpoint for DeepSeek and set HF_ENDPOINT to its URL.');
              }
            }
            if (hfResp.ok) {
              const hfJson = hfResp.json ?? (hfResp.text ? JSON.parse(hfResp.text) : undefined);
              // Expecting hfJson.scores or array of numbers; adapt safely
              let scores: number[] = [];
              if (Array.isArray(hfJson)) {
                scores = hfJson.map((x: unknown) => (typeof x === 'number' ? x : 0));
              } else if (hfJson && typeof hfJson === 'object' && 'scores' in hfJson && Array.isArray((hfJson as Record<string, unknown>)['scores'])) {
                const arr = (hfJson as Record<string, unknown>)['scores'] as unknown[];
                scores = arr.map((x: unknown) => (typeof x === 'number' ? x : 0));
              }
                      if (scores.length === hfCandidates.length) {
                      const hfScored = top.map((item, i) => ({ score: scores[i], item }));
                      hfScored.sort((a, b) => b.score - a.score);
                      const final = hfScored.map((s) => ({ ...(s.item as Record<string, unknown>), _score_hf: s.score }));
                      return new Response(JSON.stringify({ results: final, errors: fetchErrors }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                    }
            }
          } catch (e) {
            logError('hf.rerank', e);
          }
        }

  return new Response(JSON.stringify({ results: top, errors: fetchErrors, debugBase: base }), { status: 200, headers: { "Content-Type": "application/json" } });
      } catch (e) {
        // if embedding fails, fall back to raw results
        logError('openai.embedding', e);
      }
    }

  // Fallback: return deduped results without ranking
  return new Response(JSON.stringify({ results: results.slice(0, 30), errors: fetchErrors, debugBase: base }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: unknown) {
    logError('search.route', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
