"use client";
import React, { useEffect, useRef, useState } from "react";
import { t } from "../lib/i18n";

type ResultHandler = (res: unknown) => void;

export default function SearchBar({ onResultAction }: { onResultAction?: ResultHandler }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<unknown[]>([]);
  const [recording, setRecording] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const recognitionRef = useRef<{
    start: () => void;
    stop: () => void;
  } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // detect user locale from browser and store on document for server-aware parts
    try { const lang = navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage; (document as unknown as Record<string, unknown>).userLocale = lang; } catch { }
  const SpeechRecognition = (window as unknown) && ((window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition || (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition);
    if (!SpeechRecognition) return;
    type Recog = {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
  onresult?: (ev: { results: ArrayLike<unknown> }) => void;
      onend?: () => void;
      start: () => void;
      stop: () => void;
    };

    const SR = SpeechRecognition as unknown as { new (): Recog };
    const r = new SR();
    r.lang = "tr-TR";
    r.interimResults = false;
    r.maxAlternatives = 1;
    r.onresult = (ev: { results?: ArrayLike<unknown> }) => {
      // results shape is implementation-defined, string extraction may vary
      try {
        const maybe = ev as { results?: ArrayLike<unknown> };
        const first = maybe.results?.[0] as unknown;
        // try to access transcript if available (safely navigate nested arrays)
        const transcript = (first as unknown) && (Array.isArray(first) ? (first[0] as unknown as { transcript?: string })?.transcript : undefined);
        if (typeof transcript === "string") setQ((prev) => (prev ? prev + " " + transcript : transcript));
      } catch {
        console.warn("speech result parse failed");
      }
    };
    r.onend = () => setRecording(false);
    recognitionRef.current = { start: r.start.bind(r), stop: r.stop.bind(r) };
  }, []);

  function toggleRecord() {
    if (!recognitionRef.current) return;
    if (recording) {
      recognitionRef.current.stop();
      setRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setRecording(true);
      } catch (_err: unknown) {
        console.warn("speech start failed", _err);
      }
    }
  }

  function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  }

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
  if (!q && images.length === 0 && files.length === 0) return;
    setLoading(true);
    setResults([]);

  try {
      // If there are files/images, use FormData so blobs are sent.
  let res: unknown;
      if (images.length > 0 || files.length > 0) {
        const fd = new FormData();
        fd.append("q", q);
        images.forEach((f) => fd.append("images", f));
        files.forEach((f) => fd.append("files", f));
        const r = await fetch("/api/search", { method: "POST", body: fd });
        res = await r.json();
      } else {
        const r = await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q }) });
        res = await r.json();
      }

  // try to read results property if present
  const asObj = res as unknown as Record<string, unknown>;
  let maybeResults: unknown[] | undefined = undefined;
  if (Array.isArray(asObj["results"])) maybeResults = asObj["results"] as unknown[];
  else if (Array.isArray(res)) maybeResults = res as unknown[];
  setResults(maybeResults ?? []);
  onResultAction?.(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full search-container px-4 sm:px-0">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex items-center gap-3 w-full">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara: örn. iklim değişikliği, tarım uygulamaları..."
            aria-label="Arama"
            className="search-input flex-1 w-full px-4 py-3 rounded text-white placeholder:text-gray-400"
          />

          <button type="button" onClick={toggleRecord} title="Sesle arama" aria-pressed={recording} className={`icon-btn ${recording ? "recording" : ""} p-2`}> 
            {recording ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-6 h-6 sm:w-7 sm:h-7">
                <circle cx="12" cy="12" r="6"></circle>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="w-6 h-6 sm:w-7 sm:h-7">
                <path d="M12 1v11"></path>
                <path d="M8 11a4 4 0 0 0 8 0"></path>
                <path d="M19 11v2a7 7 0 0 1-14 0v-2"></path>
              </svg>
            )}
          </button>

          <button type="submit" disabled={loading} className="icon-btn p-2 btn--primary rounded" aria-busy={loading} data-tooltip={t('showcase',(typeof document !== 'undefined' && (document as unknown as Record<string, unknown>).userLocale as string) || undefined)}>
            {loading ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin w-5 h-5" aria-hidden>
                <path d="M21 12a9 9 0 0 1-9 9"></path>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="w-5 h-5">
                <circle cx="11" cy="11" r="7"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            )}
          </button>
          {q && (
            <button type="button" onClick={() => setQ("")} className="icon-btn p-2" data-tooltip="Temizle" aria-label="Aramayı temizle">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="w-5 h-5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <label className="cursor-pointer">
            <div className="icon-btn" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21v-3a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v3"/></svg>
              <span className="sr-only">Görsel yükle</span>
            </div>
            <input type="file" accept="image/*" onChange={onImageChange} multiple className="hidden" />
          </label>

          <label className="cursor-pointer">
            <div className="icon-btn" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/></svg>
              <span className="sr-only">Dosya yükle</span>
            </div>
            <input type="file" onChange={onFileChange} multiple className="hidden" />
          </label>

          <div className="small-chip">{images.length} görsel · {files.length} dosya</div>
        </div>

        {results.length > 0 && (
          <div className="mt-3 search-results-card rounded-lg p-3 max-h-80 overflow-auto card-appear">
            {results.map((r, i) => {
              const item = r as unknown as Record<string, unknown>;
              // For best UX, if the result contains an explicit 'content' or 'answer', surface only that
              const focused = (item['content'] || item['answer'] || item['summary'] || item['description'] || item['title']) as string | undefined;
              return (
                <div key={i} className="mb-2 border-b border-gray-800 pb-2">
                  <div className="text-sm text-gray-200">{focused ? focused : JSON.stringify(item).slice(0, 200)}</div>
                </div>
              );
            })}
          </div>
        )}
      </form>
    </div>
  );
}
