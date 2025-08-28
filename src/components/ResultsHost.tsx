"use client";
import React, { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import DebugResults from "./DebugResults";
import { useSearchParams } from "next/navigation";

export default function ResultsHost() {
  const [results, setResults] = useState<unknown[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const normalizeIncoming = (incoming: unknown): unknown[] => {
      try {
        // Accept many shapes: array, { results: [] }, { settled: [...] }, single object, string
        if (!incoming) return [];
        // If array already, use it
        if (Array.isArray(incoming)) {
          return incoming.map((it) => {
            if (typeof it === "string") return { focused: it };
            if (it && typeof it === "object") {
              const rec = it as Record<string, unknown>;
              if (typeof rec.focused === "string") return rec;
              const focused = (rec.content || rec.answer || rec.summary || rec.description || rec.title) as string | undefined;
              if (typeof focused === "string") return { ...rec, focused };
              return rec;
            }
            return it;
          });
        }

        if (typeof incoming === "object") {
          const rec = incoming as Record<string, unknown>;
          if (Array.isArray(rec.results)) return normalizeIncoming(rec.results);
          // Fall back to settled flattening (module payloads)
          if (Array.isArray(rec.settled)) {
            const flat: unknown[] = [];
            for (const s of rec.settled as unknown[]) {
              try {
                if (!s || typeof s !== 'object') { flat.push(s); continue; }
                const payload = (s as Record<string, unknown>).payload ?? s;
                if (payload && typeof payload === 'object') {
                  const pRec = payload as Record<string, unknown>;
                  if (Array.isArray(pRec.articles)) {
                    for (const a of pRec.articles as unknown[]) flat.push(a);
                  } else if (Array.isArray(payload as unknown[])) {
                    for (const a of payload as unknown[]) flat.push(a);
                  } else {
                    flat.push(payload);
                  }
                } else {
                  flat.push(payload);
                }
              } catch {
                // ignore per-item errors
              }
            }
            return normalizeIncoming(flat);
          }

          // single-record object -> try to extract focused text
          const focused = (rec.content || rec.answer || rec.summary || rec.description || rec.title) as string | undefined;
          if (focused) return [{ ...rec, focused }];
        }
      } catch (err) {
        try { console.warn('[ResultsHost] normalizeIncoming failed', err); } catch {}
      }
      return [];
    };

    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      try { console.debug('[ResultsHost] event received, detail:', ce.detail); } catch {}
      const normalized = normalizeIncoming(ce.detail);
      try { console.debug('[ResultsHost] normalized results count:', Array.isArray(normalized) ? normalized.length : 0); } catch {}
      setResults(normalized);
    };
    window.addEventListener("newsai:results", handler as EventListener);
    // Also check for a cached results object that might have been set before this
    try {
      const g = (window as unknown as Record<string, unknown>).__newsai_latest_results as unknown | undefined;
      if (g) {
        try { console.debug('[ResultsHost] using cached global results (raw):', g); } catch {}
        const normalized = normalizeIncoming(g);
        try { console.debug('[ResultsHost] normalized cached results count:', Array.isArray(normalized) ? normalized.length : 0); } catch {}
        setResults(normalized);
      }
    } catch {
      // ignore
    }

  // Debug UI forced on for temporary prod debugging (will be reverted)

    return () => window.removeEventListener("newsai:results", handler as EventListener);
  }, [searchParams]);

  return (
    <div>
      {/* High-visibility debug banner to prove results rendered in DOM */}
      {Array.isArray(results) && results.length > 0 && (
        <div className="fixed top-4 right-4 z-50 px-3 py-2 bg-red-600 text-white rounded shadow-lg opacity-95">
          <div className="text-xs font-semibold">DEBUG VISIBLE</div>
          <div className="text-sm">Sonuç: {results.length}</div>
          <div className="text-xs opacity-90 mt-1">
            {(() => {
              const first = results[0];
              if (!first) return null;
              if (typeof first === 'object' && first !== null) {
                const rec = first as Record<string, unknown>;
                if (typeof rec.focused === 'string' && rec.focused) return rec.focused;
              }
              try { return JSON.stringify(first).slice(0, 60); } catch { return null; }
            })()}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-2">
        <div />
        {Array.isArray(results) && results.length > 0 && (
          <div className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">Sonuç: {results.length}</div>
        )}
      </div>
      <SearchResults results={results} />
      {/* Quick DOM preview for debugging: show first 3 normalized items plainly */}
      {Array.isArray(results) && results.length > 0 && (
        <div className="mt-3 p-3 bg-black/20 rounded text-sm text-gray-200">
          <div className="font-medium mb-2">Hızlı Önizleme (ilk 3)</div>
          {results.slice(0, 3).map((r, i) => {
            const it = r as Record<string, unknown>;
            const focused = (it['focused'] ?? it['summary'] ?? it['title'] ?? it['content'] ?? it['answer']) as string | undefined;
            return (
              <div key={i} className="mb-2 border-b border-gray-800 pb-2">
                <div className="text-sm text-gray-100">{focused ? focused : JSON.stringify(it).slice(0, 200)}</div>
              </div>
            );
          })}
        </div>
      )}
      {showDebug && (
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-300">Debug: </label>
            <button onClick={() => setShowDebug((s) => !s)} className="text-sm text-blue-300 underline">toggle raw payload</button>
          </div>
          <DebugResults data={results} />
        </div>
      )}
    </div>
  );
}
