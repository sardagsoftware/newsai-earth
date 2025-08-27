"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import Footer from "../../../components/Footer";

type NewsItem = { title?: string; url?: string; value?: string; summary?: string; description?: string; body?: string; source?: string };

/* Client-side hydrated news detail (demo): tries window cache then /api/newsai */
export default function NewsDetail() {
  const params = useParams() as { slug?: string | string[] | undefined } | undefined;
  const slug = String((params && params.slug) ? (Array.isArray(params.slug) ? params.slug.join('/') : params.slug) : "");
  const [item, setItem] = useState<NewsItem | null>(null);

  useEffect(() => {
    try {
      const latest = (window as unknown as { __newsai_latest_results?: NewsItem[] }).__newsai_latest_results;
      if (latest && latest.length) {
        const found = latest.find((r) => ((r.title || r.url || r.value || "") + "").toString().toLowerCase().includes(decodeURIComponent(slug).replace(/-/g, " ").toLowerCase()));
        if (found) { setItem(found); return; }
      }
    } catch {
      // ignore
    }

    (async () => {
      try {
        const res = await fetch('/api/newsai');
        if (!res.ok) return;
        const json = await res.json();
  const arr: NewsItem[] = json.articles || [];
  const found = arr.find((a) => ((a.title || '') + '').toString().toLowerCase().includes(decodeURIComponent(slug).replace(/-/g, ' ').toLowerCase()));
        if (found) setItem(found);
      } catch {
        // ignore
      }
    })();
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1113] via-[#0b1220] to-[#081018] text-gray-100">
      <main className="max-w-4xl mx-auto p-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/news" className="text-sm text-gray-400 hover:text-white flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M15 18l-6-6 6-6"/></svg>
            Geri
          </Link>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">{decodeURIComponent(slug.replace(/-/g, " "))}</h1>
        </div>

        <article className="bg-[#07121a] p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-2">{item?.title ?? decodeURIComponent(slug.replace(/-/g, ' '))}</h2>
          <div className="text-gray-300 mb-4">{item?.summary ?? item?.description ?? 'Bu makale demo içeriğidir.'}</div>
          <div className="prose prose-invert max-w-none text-gray-200">
            <p>{item?.body ?? 'İçerik burada görünecek. Bu sayfa demo bir detay görünümüdür.'}</p>
            {item?.source && (<p className="text-sm text-gray-400">Kaynak: <a href={item.source} target="_blank" rel="noreferrer" className="text-blue-300 underline">{item.source}</a></p>)}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
