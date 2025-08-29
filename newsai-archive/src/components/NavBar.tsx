"use client";
import React, { useState, useEffect } from "react";
import { t } from "../lib/i18n";
import Link from "next/link";

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d: unknown) => {
        try {
          const obj = d as Record<string, unknown>;
          setUser((obj.user as {name?:string;email?:string}) ?? null);
        } catch {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="w-full py-3 border-b border-gray-800 backdrop-blur-sm bg-black/40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00467f] via-[#0077b6] to-[#00b4d8] flex items-center justify-center text-white font-bold">NA</div>
              <div className="text-white font-semibold">newsai.earth</div>
            </Link>
            {/* small showcase area next to brand */}
            <div className="hidden sm:flex items-center ml-4 small-chip text-xs">
              Multimodal arama • AI destekli
            </div>
        </div>
  <button className="md:hidden text-gray-300" aria-label="Menü" aria-expanded={open} onClick={() => setOpen((v) => !v)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v); }}>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        <nav className={`hidden md:flex items-center gap-3 text-sm ${open ? 'block' : ''}`}>
          <a href="/decisions" className="btn btn-gradient">{t('decisions', typeof document !== 'undefined' ? (document as unknown as Record<string, unknown>).userLocale as string | undefined : undefined)}</a>
          <a href="/about" className="btn">Hakkında</a>
          <a href="/contact" className="btn">İletişim</a>
          {!user ? (
            <>
              <a href="/login" className="btn" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' }}>Giriş</a>
              <a href="/register" className="btn btn--primary">Kayıt Ol</a>
            </>
          ) : (
            <>
              <a href="/settings" className="btn">{user.name ?? user.email}</a>
            </>
          )}
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-2">
            <a href="/decisions" className="btn btn-gradient text-center">Kararlar</a>
            <a href="/about" className="btn text-center">Hakkında</a>
            <a href="/contact" className="btn text-center">İletişim</a>
            {!user ? (
              <>
                <a href="/login" className="btn text-center" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' }}>Giriş</a>
                <a href="/register" className="btn btn--primary text-center">Kayıt Ol</a>
              </>
            ) : (
            <a href="/settings" className="btn text-center">{user.name ?? user.email}</a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
