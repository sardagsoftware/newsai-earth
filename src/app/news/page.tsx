"use client";
"use client";
import Footer from "../../components/Footer";
import React, { useState } from "react";
import Head from "next/head";

export default function NewsPage() {
  const [news, setNews] = useState<{ title: string; summary: string; category: string; source?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = ["Genel", "İklim", "Tarım", "Bilim", "Tarih", "Teknoloji"];

  async function fetchNews() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/newsai");
      if (!res.ok) throw new Error("Haberler alınamadı");
      const data = await res.json();
      setNews(data.articles || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  }

  const filteredNews = news.filter(
    (item) =>
      (!category || item.category === category || category === "Genel") &&
      (item.title.toLowerCase().includes(search.toLowerCase()) || item.summary.toLowerCase().includes(search.toLowerCase()))
  );

  return (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#18181b] via-[#23235b] to-[#0f2027]">
      <Head>
        <title>Dünya Haberleri & AI | newsai.earth</title>
        <meta name="description" content="Yapay zeka destekli, dünya genelinden haberler ve özetler. Tarım, iklim, bilim, tarih ve daha fazlası." />
        <meta name="keywords" content="haber, yapay zeka, bilim, tarım, iklim, element, kimya, biyoloji, tarih, nextjs, vercel" />
        <meta property="og:title" content="Dünya Haberleri & AI | newsai.earth" />
        <meta property="og:description" content="Yapay zeka destekli, dünya genelinden haberler ve özetler." />
        <meta property="og:url" content="https://newsai.earth/news" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://newsai.earth/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dünya Haberleri & AI | newsai.earth" />
        <meta name="twitter:description" content="Yapay zeka destekli, dünya genelinden haberler ve özetler." />
        <meta name="twitter:image" content="https://newsai.earth/og-image.png" />
        <link rel="canonical" href="https://newsai.earth/news" />
        {/* JSON-LD script CSP nedeniyle kaldırıldı */}
      </Head>
      <main className="p-8 flex-1">
        <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-lg">Dünya Haberleri & AI</h1>
        <p className="mb-8 text-lg text-gray-200">Yapay zeka destekli, dünya genelinden haberler ve özetler.</p>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gradient-to-r from-[#23235b] to-[#0f2027] text-white border-none rounded-lg px-4 py-2 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#18181b] text-white">{cat}</option>
            ))}
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Haber veya özet ara..."
            className="bg-gradient-to-r from-[#23235b] to-[#0f2027] text-white border-none rounded-lg px-4 py-2 flex-1 shadow focus:outline-none focus:ring-2 focus:ring-pink-400 placeholder:text-gray-400"
          />
          <button
            onClick={fetchNews}
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-5 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform duration-200"
            disabled={loading}
          >
            {loading ? "Yükleniyor..." : "AI ile Haberleri Getir"}
          </button>
        </div>
        {error && <div className="text-red-400 mb-4 font-semibold">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {filteredNews.map((item, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#23235b] via-[#18181b] to-[#0f2027] border-2 border-transparent rounded-2xl shadow-xl p-6 flex flex-col gap-2 hover:border-pink-400 hover:shadow-2xl hover:scale-[1.03] transition-all duration-200">
              <div className="text-xl font-bold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">{item.title}</div>
              <div className="text-gray-200 mb-2 text-base">{item.summary}</div>
              <div className="text-xs text-pink-400 font-medium">Kategori: {item.category}</div>
              {item.source && (
                <a href={item.source} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 underline hover:text-pink-400 transition-colors">Kaynak</a>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
