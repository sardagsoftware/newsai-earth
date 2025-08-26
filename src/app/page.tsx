"use client";

import Link from "next/link";
import Footer from "../components/Footer";
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
                const r = (res as unknown as Record<string, unknown>)?.results ?? (Array.isArray(res) ? res : null);
                (window as unknown as Record<string, unknown>).__newsai_latest_results = r as unknown;
                const ev = new CustomEvent("newsai:results", { detail: r });
                window.dispatchEvent(ev);
              } catch {
                // ignore
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
      <Footer />
    </div>
  );
}
