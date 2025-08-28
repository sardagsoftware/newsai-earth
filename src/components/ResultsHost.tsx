"use client";
import React, { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import DebugResults from "./DebugResults";
import { useSearchParams } from "next/navigation";

export default function ResultsHost() {
  const [results, setResults] = useState<unknown[]>([]);
  const [showDebug, setShowDebug] = useState(true);
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
      <SearchResults results={results} />
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
