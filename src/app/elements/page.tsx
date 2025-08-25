"use client";
import React, { useState } from "react";

export default function ElementsPage() {
  const [data, setData] = useState<{ title: string; summary: string; category: string; source?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const categories = ["Genel", "Keşif", "Kimya", "Biyoloji", "Analiz"];

  async function fetchElements() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/elementsai");
      if (!res.ok) throw new Error("Veri alınamadı");
      const result = await res.json();
      setData(result.articles || []);
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

  const filteredData = data.filter(
    (item) =>
      (!category || item.category === category || category === "Genel") &&
      (item.title.toLowerCase().includes(search.toLowerCase()) || item.summary.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Elementler & AI</h1>
      <p className="mb-8">Yapay zeka destekli elementler, kimya ve biyoloji haberleri.</p>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Başlık veya özet ara..."
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          onClick={fetchElements}
          className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          disabled={loading}
        >
          {loading ? "Yükleniyor..." : "AI ile Element Verilerini Getir"}
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredData.map((item, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 hover:scale-[1.02] transition-transform">
            <div className="text-lg font-semibold mb-1">{item.title}</div>
            <div className="text-gray-700 mb-2">{item.summary}</div>
            <div className="text-xs text-yellow-600 font-medium">Kategori: {item.category}</div>
            {item.source && (
              <a href={item.source} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 underline">Kaynak</a>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
