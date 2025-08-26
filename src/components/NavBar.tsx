"use client";
import React from "react";
export default function NavBar() {
  return (
    <header className="w-full py-3 border-b border-gray-800 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-white font-semibold">newsai.earth</div>
        </div>
        <nav className="hidden md:flex items-center gap-4 text-sm text-gray-300">
          <a href="/decisions" className="hover:text-white">Decisions</a>
          <a href="/about" className="hover:text-white">Hakkında</a>
          <a href="/contact" className="hover:text-white">İletişim</a>
        </nav>
      </div>
    </header>
  );
}
