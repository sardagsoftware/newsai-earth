"use client";
import React from "react";

export default function SearchResults({ results }: { results: unknown[] }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="w-full mt-6 max-w-3xl mx-auto">
      <div className="bg-[#071018] border border-gray-800 rounded-lg p-3">
        <div className="text-sm text-gray-400 mb-2">Arama sonuçları ({results.length})</div>
        <ul className="space-y-3 max-h-64 overflow-auto">
          {results.map((r, i) => {
            const item = r as unknown as Record<string, unknown>;
            const title = (item["title"] ?? item["url"] ?? item["value"] ?? "(Başlık yok)") as string;
            const source = (item["source"] ?? "Kaynak") as string;
            const summary = (item["summary"] ?? item["description"] ?? "") as string;
            // try common url fields
            const url = (item["url"] ?? item["link"] ?? item["source_url"] ?? item["href"]) as string | undefined;
            return (
              <li key={i} className="p-3 bg-gradient-to-r from-[#07121a] to-[#061018] rounded-md border border-gray-800 hover:scale-101 transition-transform">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-100">
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                          {title}
                        </a>
                      ) : (
                        <span>{title}</span>
                      )}
                    </div>
                    {summary ? <div className="text-xs text-gray-400 mt-1">{summary}</div> : null}
                    <div className="mt-2 flex items-center gap-2">
                      {url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 bg-gray-800 rounded-md hover:bg-gray-700">Kaynağa git</a>
                      ) : null}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 whitespace-nowrap">{source}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
