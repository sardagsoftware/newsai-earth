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
    const handler = (e: Event) => {
      const ce = e as CustomEvent;
      try { console.debug('[ResultsHost] event received, detail:', ce.detail); } catch {}
      setResults((ce.detail as unknown as unknown[]) ?? []);
    };
    window.addEventListener("newsai:results", handler as EventListener);
    // Also check for a cached results object that might have been set before this
    try {
      const g = (window as unknown as Record<string, unknown>).__newsai_latest_results as unknown[] | undefined;
      if (Array.isArray(g) && g.length > 0) {
        try { console.debug('[ResultsHost] using cached global results', g); } catch {}
        setResults(g);
      }
    } catch {
      // ignore
    }

    // show debug UI automatically in dev or when ?debug_ui=1 is present
    try {
      if (process.env.NODE_ENV !== 'production' || searchParams?.get('debug_ui') === '1') {
        setShowDebug(true);
      }
    } catch {}

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
