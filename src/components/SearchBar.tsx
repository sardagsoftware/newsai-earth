"use client";
import React, { useEffect, useRef, useState } from "react";

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
    r.onresult = (ev) => {
      // results shape is implementation-defined, string extraction may vary
      try {
        const maybe = ev as unknown as { results?: ArrayLike<unknown> };
        const first = maybe.results?.[0] as unknown;
        // try to access transcript if available (safely navigate nested arrays)
        const transcript = (first as unknown) && (Array.isArray(first) ? (first[0] as unknown as { transcript?: string })?.transcript : undefined);
        if (typeof transcript === "string") setQ((prev) => (prev ? prev + " " + transcript : transcript));
      } catch (e) {
        console.warn("speech result parse failed", e);
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
      } catch (e) {
        console.warn("speech start failed", e);
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
    <div className="w-full">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ara: örn. iklim değişikliği, tarım uygulamaları..."
            className="flex-1 px-4 py-3 rounded-full bg-[#0b1220] border border-gray-800 text-gray-100 focus:outline-none"
          />
          <button type="button" onClick={toggleRecord} title="Sesle arama" className={`px-4 py-2 rounded-full ${recording ? "bg-red-600" : "bg-gray-800"} text-white`}>{recording ? "● Kaydediliyor" : "🎤"}</button>
          <button type="submit" disabled={loading} className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white">{loading ? "Araıyor..." : "Ara"}</button>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-300">
          <label className="cursor-pointer px-3 py-2 bg-gray-900 rounded-md border border-gray-700">
            📷 Görsel
            <input type="file" accept="image/*" onChange={onImageChange} multiple className="hidden" />
          </label>
          <label className="cursor-pointer px-3 py-2 bg-gray-900 rounded-md border border-gray-700">
            📎 Dosya
            <input type="file" onChange={onFileChange} multiple className="hidden" />
          </label>
          <div className="text-xs text-gray-400">{images.length} görsel, {files.length} dosya seçildi</div>
        </div>

        {results.length > 0 && (
          <div className="mt-3 bg-[#071018] border border-gray-800 rounded-lg p-3 max-h-80 overflow-auto">
            {results.map((r, i) => {
              const item = r as unknown as Record<string, unknown>;
              const header = (item["source"] ?? item["category"]) as string | undefined;
              const body = (item["title"] ?? item["summary"]) as string | undefined;
              return (
                <div key={i} className="mb-2 border-b border-gray-800 pb-2">
                  <div className="text-sm text-gray-300 font-semibold">{header ?? "Sonuç"}</div>
                  <div className="text-sm text-gray-200">{body ?? JSON.stringify(item).slice(0, 200)}</div>
                </div>
              );
            })}
          </div>
        )}
      </form>
    </div>
  );
}
