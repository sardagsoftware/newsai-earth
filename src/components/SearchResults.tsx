"use client";
import React, { useMemo, useState } from "react";
import Image from "next/image";

export default function SearchResults({ results }: { results: unknown[] }) {
  // call hooks unconditionally to satisfy React rules
  const [visibleCount, setVisibleCount] = useState(9);
  const [expanded, setExpanded] = useState<number | null>(null);

  // normalize results: prefer server-shaped { focused } but be tolerant of legacy shapes
  const normalized = useMemo(() => {
    if (!Array.isArray(results)) return [] as Record<string, unknown>[];
    return results
      .map((r) => (typeof r === 'object' && r !== null ? (r as Record<string, unknown>) : { value: String(r) }))
      .map((it) => {
        const focused = (typeof it.focused === 'string' && it.focused.trim())
          ? (it.focused as string).trim()
          : ((it.content as string) || (it.answer as string) || (it.summary as string) || (it.description as string) || (it.title as string) || (it.value as string) || '').trim();
        return { ...it, focused: focused ? focused.slice(0, 2000) : '' };
      })
      .filter((it) => typeof it.focused === 'string' && it.focused.trim());
  }, [results]);

  const total = normalized.length;
  const visible = useMemo(() => normalized.slice(0, visibleCount), [normalized, visibleCount]);

  if (!normalized || normalized.length === 0) return null;

  function toggleExpand(i: number) {
    setExpanded((prev) => (prev === i ? null : i));
  }

  return (
    <div className="w-full mt-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-300">Arama sonuçları ({total})</div>
          {total > visibleCount && (
            <button
              className="text-xs px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-100"
              onClick={() => setVisibleCount((v) => Math.min(total, v + 9))}
            >
              Daha fazla yükle
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((r, i) => {
            const item = r as Record<string, unknown>;
            // server now returns { focused } but fall back to other fields if needed
            const focused = (typeof item.focused === 'string' && item.focused.trim()) ? item.focused as string : ((item["content"] ?? item["answer"] ?? item["summary"] ?? item["description"] ?? item["title"] ?? item["value"]) as string | undefined);
            const source = (item["source"] ?? "Kaynak") as string;
            const url = (item["url"] ?? item["link"] ?? item["source_url"] ?? item["href"]) as string | undefined;
            const image = (item["image"] ?? item["thumbnail"] ?? item["img"]) as string | undefined;

            const globalIndex = i; // i is fine inside visible slice

            return (
                <article
                key={globalIndex}
                className="p-4 rounded-lg border border-gray-800 hover:shadow-2xl transition-shadow bg-gradient-to-br from-[#07121a] to-[#061018] cursor-pointer card-appear"
                onClick={() => toggleExpand(globalIndex)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white" onClick={(e) => e.stopPropagation()}>
                          {focused ?? '(Başlık yok)'}
                        </a>
                      ) : (
                        <span>{focused ?? '(Başlık yok)'}</span>
                      )}
                    </h3>

                    {image ? (
                      // use Next.js Image for better LCP and optimization; unoptimized to avoid loader config for external icons
                      <div className="w-full h-36 mb-2 rounded-md overflow-hidden">
            <Image src={String(image)} alt={String(focused ?? 'resim').slice(0,50)} width={600} height={216} className="object-cover w-full h-full" unoptimized />
                      </div>
                    ) : null}
          {focused ? <p className="text-sm text-gray-100">{focused}</p> : <p className="text-sm text-gray-400">(İçerik yok)</p>}
                  </div>

                    <div className="mt-3 flex items-center justify-between">
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 bg-gray-800 rounded-md hover:bg-gray-700" onClick={(e) => e.stopPropagation()}>
                        Kaynağa git
                      </a>
                    ) : null}
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{source}</div>
                  </div>

                  {/* expanded detail panel */}
                  {expanded === globalIndex && (
                    <div className="mt-3 p-3 bg-black/30 rounded-md border border-gray-800 text-sm text-gray-200">
                      <div className="font-medium mb-1">Detaylar</div>
                      {/* show query-focused snippet if present, otherwise full summary */}
                      {item["snippet"] ? (
                        <div className="text-sm text-gray-100">{String(item["snippet"])}</div>
                      ) : (
                        <div className="text-sm text-gray-100">{focused || JSON.stringify(item).slice(0, 1000)}</div>
                      )}

                      {/* optional meta */}
                      <div className="mt-2 text-xs text-gray-400">
                        {url && (
                          <div>
                            Kaynak: <a href={url} target="_blank" rel="noreferrer" className="underline">{url}</a>
                          </div>
                        )}
                        <div>Kaynak türü: {String(item["type"] ?? "- ")}</div>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* show overall pagination / load more control */}
        {visibleCount < total && (
          <div className="mt-6 flex justify-center">
            <button
              className="px-4 py-2 rounded-md btn-gradient text-black font-semibold shadow-lg"
              onClick={() => setVisibleCount((v) => Math.min(total, v + 12))}
            >
              Daha fazla göster
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
