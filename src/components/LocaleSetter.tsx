"use client";
import { useEffect } from "react";

const SUPPORTED = ['tr','en','de','fr'];

function pickLocale(lang?: string) {
  if (!lang) return 'tr';
  const code = lang.split(/[-_]/)[0];
  if (SUPPORTED.includes(code)) return code;
  // fallback mapping for a few common locales
  if (code === 'es') return 'en';
  if (code === 'pt') return 'en';
  return 'tr';
}

export default function LocaleSetter() {
  useEffect(() => {
    try {
      const nav = typeof navigator !== 'undefined' ? (navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage) : undefined;
      const chosen = pickLocale(nav);
      // set cookie for server-side reads (30 days)
      document.cookie = `user-locale=${chosen}; Path=/; Max-Age=${60*60*24*30}`;
      // set document lang attribute
      document.documentElement.lang = chosen;
      // expose on document for client components
      (document as unknown as Record<string, unknown>).userLocale = chosen;
    } catch {
      // ignore
    }
  }, []);
  return null;
}
