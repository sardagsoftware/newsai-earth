"use client";

import React from "react";
import Link from "next/link";

type Props = {
  title: string;
  summary?: string;
  category?: string;
  source?: string;
  href?: string;
  accent?: string;
};

export default function ArticleCard({ title, summary, category, source, href, accent = "from-blue-400 via-purple-400 to-pink-400" }: Props) {
  const isInternal = href && href.startsWith('/');
  return (
    <article className="p-6 rounded-2xl shadow-xl bg-gradient-to-br from-[#0b0f14] to-[#07121a] border border-transparent hover:shadow-2xl transition-all">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className={`text-lg font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r ${accent}`}>
            {href ? (isInternal ? <Link href={href}>{title}</Link> : <a href={href} target="_blank" rel="noopener noreferrer">{title}</a>) : <span>{title}</span>}
          </h3>
          {summary ? <p className="text-sm text-gray-300 mb-3">{summary}</p> : null}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="text-xs text-gray-400">{category}</div>
          <div className="flex items-center gap-2">
            {source ? <a href={source} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-300 underline">Kaynak</a> : null}
            {href ? (isInternal ? <Link href={href} className="px-3 py-1 text-xs bg-gray-800 rounded">Oku</Link> : <a href={href} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-xs bg-gray-800 rounded">Oku</a>) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
