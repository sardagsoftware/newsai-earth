"use client";
import { useEffect, useState } from "react";
import { countries, ministries, decisionTypes, languages, Decision } from "../api/decisions/schema";

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [country, setCountry] = useState("");
  const [ministry, setMinistry] = useState("");
  const [type, setType] = useState("");
  const [lang, setLang] = useState("tr");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
      async function load() {
        setLoading(true);
        setError("");
        try {
          const params = new URLSearchParams();
          if (country) params.append("country", country);
          if (ministry) params.append("ministry", ministry);
          if (type) params.append("type", type);
          if (lang) params.append("lang", lang);
          const res = await fetch(`/api/decisions?${params.toString()}`);
          if (!res.ok) throw new Error("Veri alınamadı");
          const data = await res.json();
          setDecisions(data.decisions || []);
        } catch {
          setError("Veri alınamadı");
        } finally {
          setLoading(false);
        }
      }

      load();
  }, [country, ministry, type, lang]);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Dünya Genelinde Bakanlık Kararları</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <select value={country} onChange={e => setCountry(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Ülke Seçin</option>
          {countries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={ministry} onChange={e => setMinistry(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Bakanlık Seçin</option>
          {ministries.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Karar Tipi</option>
          {decisionTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={lang} onChange={e => setLang(e.target.value)} className="border rounded px-3 py-2">
          {languages.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </select>
      </div>
      {loading && <div className="mb-4">Yükleniyor...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {decisions.map((d, idx) => (
          <div key={idx} className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-2">
            <div className="text-lg font-semibold mb-1">{d.subject}</div>
            <div className="text-gray-300 mb-2">{d.description}</div>
            <div className="text-xs text-blue-400 font-medium">Ülke: {d.country} | Bakanlık: {d.ministry} | Tip: {d.type}</div>
            <div className="text-xs text-gray-400">Tarih: {d.date}</div>
            <a href={d.source} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 underline">Kaynak</a>
          </div>
        ))}
      </div>
    </div>
  );
}
