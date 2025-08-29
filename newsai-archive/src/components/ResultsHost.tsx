"use client";
import React, { useEffect, useState, useCallback } from "react";
import SearchResults from "./SearchResults";
import { useSearchParams } from "next/navigation";

export default function ResultsHost() {
  // Accept many shapes for incoming payloads and always return an array
  const normalizeIncoming = useCallback((incoming: unknown): unknown[] => {
    try {
      if (!incoming) return [];
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

        const focused = (rec.content || rec.answer || rec.summary || rec.description || rec.title) as string | undefined;
        if (focused) return [{ ...rec, focused }];
        return [rec];
      }
    } catch (err) {
      try { console.warn('[ResultsHost] normalizeIncoming failed', err); } catch {}
    }
    return [];
  }, []);

  const searchParams = useSearchParams();
  const [results, setResults] = useState<unknown[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const g = (window as unknown as Record<string, unknown>).__newsai_latest_results as unknown | undefined;
      return normalizeIncoming(g);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      const payload = (ce && 'detail' in ce) ? (ce as CustomEvent).detail : ce;
      const normalized = normalizeIncoming(payload);
      setResults(normalized);
    };
    window.addEventListener("newsai:results", handler as EventListener);

    return () => window.removeEventListener("newsai:results", handler as EventListener);
  }, [searchParams, normalizeIncoming]);

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
