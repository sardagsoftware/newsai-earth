import type { NextRequest } from "next/server";
// import newsai handler for internal short-circuit debug
import { GET as newsaiGET } from "../newsai/route";
import { GET as agricultureGET } from "../agricultureai/route";
import { GET as climateGET } from "../climateai/route";
import { GET as elementsGET } from "../elementsai/route";
import { GET as chemistryGET } from "../chemistryai/route";
import { GET as biologyGET } from "../biologyai/route";
import { GET as historyGET } from "../historyai/route";
import { GET as decisionsGET } from "../decisions/route";
import OpenAI from "openai";
import { upsertToPinecone } from "../../../lib/pinecone";

let _openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI | null {
  try {
    if (_openaiClient) return _openaiClient;
    if (!process.env.OPENAI_API_KEY) return null;
    _openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return _openaiClient;
  } catch {
    // fall through
  }
  return null;
}

function logError(tag: string, e: unknown) {
  try {
    if (e instanceof Error) {
      console.error(`[${tag}]`, e.message, "stack:", e.stack);
    } else {
      console.error(`[${tag}]`, JSON.stringify(e));
    }
  } catch (err: unknown) {
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
    } catch {
      // not JSON
    }
    return { ok: r.ok, status: r.status, statusText: r.statusText, json, text };
  } catch (err: unknown) {
    // don't throw; return structured error so callers can include full context in debug responses
    logError(`fetchWithDebug:${tag ?? url}`, err);
    const out: Record<string, unknown> = { ok: false, status: 0, statusText: 'fetch-failed' };
    try {
      if (err instanceof Error) {
        out.error = err.message;
        out.stack = err.stack;
      } else {
        out.error = String(err);
      }
    } catch {
      out.error = 'fetch-error-serialize-failed';
    }
    return out;
  }
}

function asRecord(x: unknown): Record<string, unknown> {
  return (x as Record<string, unknown>) ?? {};
}

function getPreview(obj: unknown, max = 1000) {
  try {
    const o = asRecord(obj);
    if (typeof o.text === 'string') return (o.text as string).slice(0, max);
    if (typeof o.json === 'string') return (o.json as string).slice(0, max);
    return JSON.stringify(o.json ?? o.text ?? o).slice(0, max);
  } catch {
    return '';
  }
}

function extractFocused(item: unknown) {
  try {
    const it = asRecord(item);
    const candidates = [
      it.focused,
      it.answer,
      it.summary,
      it.content,
      it.description,
      it.text,
      it.title,
      it.url,
    ];
    for (const c of candidates) {
      if (typeof c === 'string' && c.trim()) return c.trim();
    }
    // fallback: try JSON stringify of main fields
    const s = JSON.stringify(it);
    return s.slice(0, 2000);
  } catch {
    return '';
  }
}

function shapeResultsToFocused(arr: unknown[]) {
  return arr.map((r) => ({ focused: extractFocused(r) }));
}

async function normalizeResponse(r: unknown) {
  try {
    // If it's a standard Response, extract fields
  if (typeof r === 'object' && r !== null && 'text' in (r as Record<string, unknown>) && 'status' in (r as Record<string, unknown>)) {
      // treat as Response-like
      try {
        const resp = r as unknown as Response;
  const status = (resp as Response).status ?? 0;
  const statusText = (resp as Response).statusText ?? '';
        let text = '';
        try {
          text = await resp.text();
        } catch {
          // ignore
        }
        let json: unknown = undefined;
        try {
          if (text) json = JSON.parse(text);
        } catch {
          // not json
        }
        const ok = status >= 200 && status < 300;
        return { ok, status, statusText, text, json } as Record<string, unknown>;
      } catch {
        return asRecord(r);
      }
    }
  } catch {
    // fall through
  }
  return asRecord(r);
}

function cosine(a: number[], b: number[]) {
  let dot = 0;
  let na = 0;
  let nb = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
      dot += a[i] * b[i];
      na += a[i] * a[i];
      nb += b[i] * b[i];
    }

    return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-12);
}

async function embedTexts(texts: string[]) {
  const client = getOpenAI();
  if (!client) return [];
  const batchSize = 32;
  const embeddings: number[][] = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    try {
      const resp = await client.embeddings.create({ model: "text-embedding-3-small", input: batch });
      for (const d of resp.data) embeddings.push(d.embedding as number[]);
    } catch (err: unknown) {
      logError('embedTexts.batch', err);
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
    let bodyForceDebug = false;
    if (contentType.includes("multipart/form-data")) {
      formData = await req.formData();
      const qv = formData.get("q");
      q = typeof qv === "string" ? qv : "";
  const fdFlag = formData.get('force_debug');
  const fdFlagStr = fdFlag == null ? '' : String(fdFlag).toLowerCase();
  bodyForceDebug = fdFlagStr === '1' || fdFlagStr === 'true';
    } else {
      const body = await req.json();
      q = body.q || "";
      bodyForceDebug = body.force_debug === true || body.force_debug === '1' || body.force_debug === 'true';
    }

  // Determine base URL robustly: prefer explicit env, then Vercel-provided URL, then request origin, then a safe production fallback.
  const reqOrigin = typeof req !== 'undefined' ? new URL(req.url).origin : undefined;
  const safeProdDomain = 'https://newsai-earth.vercel.app';
  const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : (reqOrigin || safeProdDomain));

  // Note: do not short-circuit on force_debug here; we want to execute module fetches and then
  // return the full `settled` array if debug is requested so we can see attemptedUrl and errors.
  try {
    // parse only to determine later flags
    new URL(req.url);
  } catch {
    // ignore
  }

  // Internal handler short-circuit for debugging: call module handlers directly to avoid network fetches
  try {
    const urlObj = new URL(req.url);
    if (urlObj.searchParams.get('internal') === '1') {
      // call newsai handler directly (GET) and return its JSON
      const fakeReq = new Request(`${base}/api/newsai?q=${encodeURIComponent(q)}`);
      try {
        const r = await newsaiGET(fakeReq as Request);
        return r as Response;
      } catch (err: unknown) {
        // fall through to normal behavior
        logError('internal.newsai.call', err);
      }
    }
  } catch {
    // ignore
  }
    const modules = [
      { path: `/api/newsai`, name: "Haber & AI" },
      { path: `/api/climateai`, name: "İklim & AI" },
      { path: `/api/agricultureai`, name: "Tarım & AI" },
      { path: `/api/chemistryai`, name: "Kimya & AI" },
      { path: `/api/biologyai`, name: "Biyoloji & AI" },
      { path: `/api/elementsai`, name: "Element & Bilim" },
      { path: `/api/historyai`, name: "Tarih & AI" },
      { path: `/api/decisions`, name: "Bakanlık Kararları" },
    ];

    // Normalize a path into an absolute URL we can fetch from the server
    function makeTarget(pathOrUrl: string) {
      try {
        // already absolute?
        const maybe = new URL(pathOrUrl);
        return maybe.toString();
      } catch {
        // relative path -> join with base
        if (pathOrUrl.startsWith('/')) return `${base}${pathOrUrl}`;
        return `${base}/${pathOrUrl.replace(/^\/+/, '')}`;
      }
    }

  const settled: Array<Record<string, unknown>> = [];
  // allow quick verbose debugging from prod: POST /api/search?debug=1
  const reqUrl = new URL(req.url);
  const verboseDebug = reqUrl.searchParams.get('debug') === '1';
  // Accept force_debug from query OR body/formData OR magic ping query
  const bodyForce = bodyForceDebug;
  const pingForce = q === '__PING__';
  // Perform sequential fetches so we can capture the first failure context more clearly in logs
  for (const m of modules) {
  try {
      const target = makeTarget(m.path);
  if (formData && (m.path === "/api/newsai" || m.path === "/api/decisions")) {
        const fd = new FormData();
        fd.append("q", q);
        for (const f of formData.getAll("images")) fd.append("images", f as unknown as Blob);
        for (const f of formData.getAll("files")) fd.append("files", f as unknown as Blob);
  // Prefer internal handler call when available to avoid network fetch
  let r: unknown = null;
        try {
          if (m.path === '/api/newsai') {
            const fakeReq = new Request(`${target}`, { method: 'GET' });
            const rr = await newsaiGET(fakeReq);
            r = await normalizeResponse(rr);
          } else if (m.path === '/api/decisions') {
            const fakeReq = new Request(`${target}`, { method: 'GET' });
            const rr = await decisionsGET(fakeReq as Request);
            r = await normalizeResponse(rr);
          }
        } catch (err: unknown) {
          logError('internal.call', { path: m.path, err });
          r = null;
        }
        if (!r) {
          // Avoid performing outbound fetches from serverless runtime; prefer internal handlers.
          r = { ok: false, error: 'internal-handler-missing', attemptedUrl: target } as Record<string, unknown>;
        }
        const o = asRecord(r);
        const txt = getPreview(o, 1000);
        if (o.ok === true) {
          settled.push({ module: m.name, attemptedUrl: target, payload: o.json ?? o.text, debug: { status: o.status ?? 0, text: txt } });
        } else {
          settled.push({ module: m.name, attemptedUrl: target, error: o.error ?? 'fetch-failed', status: o.status ?? 0, textPreview: txt });
        }
      } else {
  // Try an internal handler first if available
  let r: unknown = null;
        try {
          if (m.path === '/api/newsai') {
            const fakeReq = new Request(`${target}?q=${encodeURIComponent(q)}`);
            const rr = await newsaiGET(fakeReq as Request);
            r = await normalizeResponse(rr);
          } else if (m.path === '/api/agricultureai') {
            const rr = await agricultureGET();
            r = await normalizeResponse(rr);
          } else if (m.path === '/api/climateai') {
            const rr = await climateGET();
            r = await normalizeResponse(rr);
          } else if (m.path === '/api/elementsai') {
            const rr = await elementsGET();
            r = await normalizeResponse(rr);
          } else if (m.path === '/api/chemistryai') {
            const rr = await chemistryGET();
            r = await normalizeResponse(rr);
          } else if (m.path === '/api/biologyai') {
            const rr = await biologyGET();
            r = await normalizeResponse(rr);
          } else if (m.path === '/api/historyai') {
            const rr = await historyGET();
            r = await normalizeResponse(rr);
          } else if (m.path === '/api/decisions') {
            const fakeReq = new Request(`${target}?q=${encodeURIComponent(q)}`);
            const rr = await decisionsGET(fakeReq as Request);
            r = await normalizeResponse(rr);
          }
        } catch (err: unknown) {
          logError('internal.call', { path: m.path, err });
          r = null;
        }
        if (!r) {
          // Avoid outbound fetch; signal missing internal handler
          r = { ok: false, error: 'internal-handler-missing', attemptedUrl: `${target}?q=${encodeURIComponent(q)}` } as Record<string, unknown>;
        }
        const o = asRecord(r);
        const txt = getPreview(o, 1000);
        if (o.ok === true) {
          settled.push({ module: m.name, attemptedUrl: `${target}?q=${encodeURIComponent(q)}`, payload: o.json ?? o.text, debug: { status: o.status ?? 0, text: txt } });
        } else {
          // try a simple fallback: if target didn't include base (unlikely), try with base + original path
          let fallbackTried = false;
          try {
            const fallback = target.startsWith(base) ? null : makeTarget(m.path);
            if (fallback) {
              fallbackTried = true;
              // do not perform outbound fetch; report fallback attempted but not executed
              settled.push({ module: m.name, attemptedUrl: `${fallback}?q=${encodeURIComponent(q)}`, error: 'fallback-not-performed-no-egress', fallback: true });
              continue;
            }
          } catch (e: unknown) {
            logError('module.fallback', e);
          }
          settled.push({ module: m.name, attemptedUrl: `${target}?q=${encodeURIComponent(q)}`, error: o.error ?? 'fetch-failed', status: o.status ?? 0, textPreview: txt, fallbackAttempted: fallbackTried });
        }
      }
    } catch (_: unknown) {
      // Ensure we capture detailed error info into the settled array so the prod response surfaces it
      const e = _ as unknown;
      logError('module.fetch', { path: m.path, err: e });
      const errMsg = e instanceof Error ? e.message : JSON.stringify(e);
      const errStack = e instanceof Error && e.stack ? e.stack : undefined;
      // add attemptedUrl to help debug base/relative resolution issues
      settled.push({ error: errMsg, source: m.path, attemptedUrl: m.path, stack: errStack, rawError: typeof e === 'object' ? JSON.stringify(e, Object.getOwnPropertyNames(e)).slice(0,2000) : String(e) });
      // keep going to collect other modules but note the failure
    }

  // continue loop to collect all modules' responses/errors
  }

    // Collect fetch-level errors to return for debugging (temporary)
    const fetchErrors: Array<Record<string, unknown>> = [];
    // If this is a ping debug request, return the full settled array to help diagnose prod fetch issues
    if (q === '__PING__') {
      return new Response(JSON.stringify({ ok: true, settled, debugBase: base }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    for (const s of settled) {
      if (s && typeof s === 'object' && 'error' in (s as Record<string, unknown>)) {
        const se = s as Record<string, unknown>;
        fetchErrors.push({ source: se.source ?? se.module ?? 'unknown', error: se.error ?? se, stack: se.stack ?? null });
      }
    }

    // If verbose debug requested, return the raw settled array and fetchErrors for diagnosis
    // Also support force_debug to return the full settled payload when present in query or body
  const headerForce = req.headers.get('x-force-debug') === '1' || req.headers.get('x-force-debug') === 'true';
  const forceDebugFlag = reqUrl.searchParams.get('force_debug') === '1' || headerForce || bodyForce || pingForce;
  if (verboseDebug || forceDebugFlag) {
      // limit text sizes to avoid huge responses
      const limited = settled.map((it) => {
  try {
          const copy: Record<string, unknown> = {};
          for (const k of Object.keys(it)) {
            const v = (it as Record<string, unknown>)[k];
            if (typeof v === 'string') copy[k] = v.slice(0, 2000);
            else if (typeof v === 'object' && v !== null && 'text' in (v as Record<string, unknown>)) {
              const vv = v as Record<string, unknown>;
              copy[k] = { status: vv['status'] ?? null, text: String(vv['text'] ?? '').slice(0, 2000) };
            } else copy[k] = v;
          }
          return copy;
        } catch {
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
      const client = getOpenAI();
      if (!client) throw new Error('OpenAI client not initialized');
      const queryEmbeddingResp = await client.embeddings.create({ model: "text-embedding-3-small", input: q });
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
        } catch (e: unknown) {
          logError('embedTexts', e);
        }
        // optionally upsert embeddings into Pinecone for faster future queries
        if (process.env.PINECONE_API_KEY && process.env.PINECONE_URL) {
          try {
            const vectors = resEmbeddings.map((v, i) => ({ id: `search-${Date.now()}-${i}`, values: v, metadata: { title: results[i].title, source: results[i].source } }));
            await upsertToPinecone('newsai-index', vectors);
          } catch (e: unknown) {
            logError('pinecone.upsert', e);
          }
        }
        const scored: { score: number; item: Record<string, unknown> }[] = [];
        for (let i = 0; i < results.length && i < resEmbeddings.length; i++) {
          const sc = cosine(queryEmbedding, resEmbeddings[i]);
            if (typeof sc === 'number') scored.push({ score: sc, item: results[i] });
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
              const hfObj = asRecord(hfResp);
              const hfTextPreview = getPreview(hfObj, 1000);
              logError('hf.rerank.http', { status: hfObj.status ?? hfResp.status, textPreview: hfTextPreview });
              if (hfResp.status === 404 && hfEndpointUrl === hfModelUrl) {
                console.warn('Model-level inference returned 404. Consider creating a Hugging Face Inference Endpoint for DeepSeek and set HF_ENDPOINT to its URL.');
              }
            }
            if (hfResp.ok) {
              const hfObj = asRecord(hfResp);
              let hfJson: unknown = hfObj.json ?? undefined;
              if (!hfJson && typeof hfObj.text === 'string') {
                try {
                  hfJson = JSON.parse(String(hfObj.text));
                } catch {
                  hfJson = undefined;
                }
              }
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
                      // shape to focused-only before returning
                      return new Response(JSON.stringify({ results: shapeResultsToFocused(final), errors: fetchErrors }), { status: 200, headers: { 'Content-Type': 'application/json' } });
                    }
            }
          } catch (err: unknown) {
            logError('hf.rerank', err);
          }
        }

  return new Response(JSON.stringify({ results: shapeResultsToFocused(top), errors: fetchErrors, debugBase: base }), { status: 200, headers: { "Content-Type": "application/json" } });
      } catch (err: unknown) {
        // if embedding fails, fall back to raw results
        logError('openai.embedding', err);
      }
    }

  // Fallback: return deduped results without ranking
  return new Response(JSON.stringify({ results: shapeResultsToFocused(results.slice(0, 30)), errors: fetchErrors, debugBase: base }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: unknown) {
    logError('search.route', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function GET(req: NextRequest) {
  try {
    const reqUrl = new URL(req.url);
    const forceDebug = reqUrl.searchParams.get('force_debug') === '1';
    if (forceDebug) {
      const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://newsai-earth.vercel.app');
      return new Response(JSON.stringify({ ok: true, debugBase: base, now: Date.now() }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    // lightweight info for GET
    return new Response(JSON.stringify({ ok: true, message: 'POST only for search; use POST with JSON { q }', now: Date.now() }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err: unknown) {
    logError('search.GET', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
