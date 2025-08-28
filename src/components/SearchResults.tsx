"use client";
import React from "react";

export default function SearchResults({ results }: { results: unknown[] }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="w-full mt-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-sm text-gray-400 mb-2">Arama sonuçları ({results.length})</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((r, i) => {
            const item = r as unknown as Record<string, unknown>;
            const title = (item["title"] ?? item["url"] ?? item["value"] ?? "(Başlık yok)") as string;
            const source = (item["source"] ?? "Kaynak") as string;
            const summary = (item["summary"] ?? item["description"] ?? "") as string;
            // try common url fields
            const url = (item["url"] ?? item["link"] ?? item["source_url"] ?? item["href"]) as string | undefined;
            return (
              <article key={i} className="p-4 bg-gradient-to-br from-[#07121a] to-[#061018] rounded-lg border border-gray-800 hover:shadow-2xl transition-shadow">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-100 mb-1">
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                          {title}
                        </a>
                      ) : (
                        <span>{title}</span>
                      )}
                    </h3>
                    {summary ? <p className="text-xs sm:text-sm text-gray-400">{summary}</p> : null}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 bg-gray-800 rounded-md hover:bg-gray-700">Kaynağa git</a>
                    ) : null}
                    <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{source}</div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
