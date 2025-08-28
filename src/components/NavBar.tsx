"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user ?? null)).catch(() => setUser(null)); }, []);

  return (
    <header className="w-full py-3 border-b border-gray-800 backdrop-blur-sm bg-black/40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">NA</div>
              <div className="text-white font-semibold">newsai.earth</div>
            </Link>
        </div>
  <button className="md:hidden text-gray-300" aria-label="Menü" aria-expanded={open} onClick={() => setOpen((v) => !v)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v); }}>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        <nav className={`hidden md:flex items-center gap-4 text-sm text-gray-300 ${open ? 'block' : ''}`}>
          <a href="/decisions" className="hover:text-white">Kararlar</a>
          <a href="/about" className="hover:text-white">Hakkında</a>
          <a href="/contact" className="hover:text-white">İletişim</a>
          {!user ? (
            <>
              <a href="/login" className="hover:text-white">Giriş</a>
              <a href="/register" className="hover:text-white">Kayıt Ol</a>
            </>
          ) : (
            <>
              <a href="/settings" className="hover:text-white">{user.name ?? user.email}</a>
            </>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-2 text-gray-300">
            <a href="/decisions" className="hover:text-white">Kararlar</a>
            <a href="/about" className="hover:text-white">Hakkında</a>
            <a href="/contact" className="hover:text-white">İletişim</a>
            {!user ? (
              <>
                <a href="/login" className="hover:text-white">Giriş</a>
                <a href="/register" className="hover:text-white">Kayıt Ol</a>
              </>
            ) : (
              <a href="/settings" className="hover:text-white">{user.name ?? user.email}</a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
