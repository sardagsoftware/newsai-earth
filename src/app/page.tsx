"use client";

import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#23272f] via-[#1a1d23] to-[#0a0a0a] text-gray-100 font-sans flex flex-col">
      <header className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
        <span className="mr-2 animate-spin-slow">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="chatgpt-orange" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFB347" />
                <stop offset="1" stopColor="#FF7F50" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#chatgpt-orange)" />
            <ellipse cx="20" cy="20" rx="10" ry="6" fill="#fff" opacity="0.15" />
            <ellipse cx="20" cy="20" rx="6" ry="10" fill="#fff" opacity="0.10" />
            <text x="10" y="26" fontSize="16" fontWeight="bold" fill="#fff">AI</text>
          </svg>
        </span>
        <span className="text-xl font-bold tracking-tight">BİLİMSEL YAPAY ZEKA PLATFORM</span>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl flex flex-col items-center gap-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent animate-gradient">BİLİMSEL YAPAY ZEKA PLATFORM</h1>
          <p className="text-gray-400 text-center mb-4 text-lg">Dünya genelinden AI ile özetlenmiş haberler, bilim ve teknoloji içerikleri.</p>
          <input type="text" placeholder="Komut veya anahtar kelime yazın..." className="w-full bg-gray-950 border border-gray-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 shadow-lg" />
          <nav className="w-full">
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { href: "/news", icon: "🌍", label: "Haber & AI" },
                { href: "/agriculture", icon: "🌱", label: "Tarım & AI" },
                { href: "/climate", icon: "�️", label: "İklim & AI" },
                { href: "/elements", icon: "🧪", label: "Element & Bilim" },
                { href: "/chemistry", icon: "🔬", label: "Kimya & AI" },
                { href: "/biology", icon: "🧬", label: "Biyoloji & AI" },
                { href: "/history", icon: "📜", label: "Tarih & AI" },
              ].map((modul, i) => (
                <li key={modul.href} className="relative group">
                  <Link href={modul.href} className="block bg-gradient-to-br from-orange-400 via-yellow-300 to-orange-500 text-gray-900 rounded-2xl shadow-xl p-6 text-center font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <span className="text-3xl block mb-2 animate-bounce">{modul.icon}</span>
                    <span className="block animate-gradient-move group-hover:animate-gradient-move-fast">{modul.label}</span>
                  </Link>
                  <span className="absolute top-2 right-2 text-xs text-orange-500 animate-pulse">{modul.label}</span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
}
