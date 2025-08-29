"use client";

import Link from "next/link";
import SearchBar from "../components/SearchBar";
import ResultsHost from "../components/ResultsHost";
import AnimatedLogo from "../components/AnimatedLogo";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#23272f] via-[#1a1d23] to-[#0a0a0a] text-gray-100 font-sans flex flex-col">
  {/* header removed to keep homepage focused and professional */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <AnimatedLogo />
            <p className="text-gray-400 text-center text-lg">Dünya genelinden AI ile özetlenmiş haberler, bilim ve teknoloji içerikleri.</p>
          </div>
          <div className="w-full">
            <SearchBar onResultAction={(res: unknown) => {
              try {
                // DEBUG: trace incoming result payload from /api/search
                try { console.debug('[SearchBar] onResultAction payload:', res); } catch {}

                // Try to use explicit results array if provided
                const asObj = res as unknown as Record<string, unknown>;
                let r = asObj?.results ?? (Array.isArray(res) ? res : null);

                // If the server returned a `settled` array (module payloads), flatten it into a results[]
                try {
                  if ((!r || (Array.isArray(r) && r.length === 0)) && Array.isArray(asObj?.settled)) {
                    const flat: unknown[] = [];
                    for (const s of (asObj.settled as unknown[])) {
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
                        // ignore per-item flatten errors
                      }
                    }
                    if (flat.length > 0) {
                      try { console.debug('[SearchBar] flattened settled -> results count', flat.length); } catch {}
                      r = flat;
                    }
                  }
                } catch {}

                // Ensure we always store and dispatch an array to simplify downstream handling
                const arr = Array.isArray(r) ? r : (r ? [r] : []);
                // store global cache
                (window as unknown as Record<string, unknown>).__newsai_latest_results = arr as unknown;
                // Dispatch after a microtask to avoid race where ResultsHost hasn't mounted yet
                try {
                  setTimeout(() => {
                    const ev = new CustomEvent("newsai:results", { detail: arr });
                    try { console.debug('[SearchBar] dispatching newsai:results (delayed) count:', Array.isArray(arr) ? arr.length : 0); } catch {}
                    window.dispatchEvent(ev);
                  }, 0);
                } catch {
                  const ev = new CustomEvent("newsai:results", { detail: arr });
                  window.dispatchEvent(ev);
                }
              } catch (err) {
                try { console.error('[SearchBar] onResultAction error', err); } catch {}
              }
            }} />

              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                {[
                  { href: "/news", label: "Haber & AI" },
                  { href: "/agriculture", label: "Tarım & AI" },
                  { href: "/climate", label: "İklim & AI" },
                  { href: "/elements", label: "Element & Bilim" },
                  { href: "/chemistry", label: "Kimya & AI" },
                  { href: "/biology", label: "Biyoloji & AI" },
                  { href: "/history", label: "Tarih & AI" },
                  { href: "/decisions", label: "Bakanlık Kararları" },
                ].map((modul) => (
                  <Link key={modul.href} href={modul.href} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white font-semibold transform transition-all hover:scale-105 animate-bounce">
                    {modul.label}
                  </Link>
                ))}
              </div>
              <div className="w-full">
                <ResultsHost />
              </div>
            </div>
        </div>
      </main>
  {/* Footer provided by layout */}
    </div>
  );
}
