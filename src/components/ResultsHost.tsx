"use client";
import React, { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import { useSearchParams } from "next/navigation";

export default function ResultsHost() {
  const [results, setResults] = useState<unknown[]>([]);
  // production: no debug UI state
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
      const normalized = normalizeIncoming(ce.detail);
      setResults(normalized);
    };
    window.addEventListener("newsai:results", handler as EventListener);
    // Also check for a cached results object that might have been set before this
    try {
      const g = (window as unknown as Record<string, unknown>).__newsai_latest_results as unknown | undefined;
      if (g) {
        const normalized = normalizeIncoming(g);
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
      <div className="flex items-center justify-between mb-2">
        <div />
        {Array.isArray(results) && results.length > 0 && (
          <div className="text-sm text-gray-300 bg-gray-800 px-2 py-1 rounded">Sonuç: {results.length}</div>
        )}
      </div>
      <SearchResults results={results} />
    </div>
  );
}
