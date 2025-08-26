"use client";
import React, { useState } from "react";
import AnimatedLogo from "./AnimatedLogo";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    router.push(`/news?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="w-full py-4 border-b border-gray-800 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AnimatedLogo />
          <div className="text-white font-semibold">newsai.earth</div>
        </div>
        <form onSubmit={submit} className="flex items-center gap-2 flex-1 max-w-2xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hızlı arama... (ör. iklim değişikliği)"
            className="w-full px-4 py-2 rounded-full bg-[#111827] text-gray-200 placeholder:text-gray-400 border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button type="submit" className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium">Ara</button>
        </form>
        <nav className="hidden md:flex items-center gap-4 text-sm text-gray-300">
          <a href="/decisions" className="hover:text-white">Decisions</a>
          <a href="/about" className="hover:text-white">Hakkında</a>
          <a href="/contact" className="hover:text-white">İletişim</a>
        </nav>
      </div>
    </header>
  );
}
