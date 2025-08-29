"use client";

import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  accent?: string; // tailwind classes for accent gradient or color
  children: React.ReactNode;
};

export default function ThemedLayout({ title, subtitle, accent = "from-blue-400 via-purple-400 to-pink-400", children }: Props) {
  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br from-[#18181b] via-[#23235b] to-[#0f2027] text-gray-100`}> 
      <main className="p-8 flex-1 max-w-6xl mx-auto w-full">
        <header className="mb-8">
          <h1 className={`text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r ${accent} drop-shadow-lg`}>
            {title}
          </h1>
          {subtitle ? <p className="mb-6 text-lg text-gray-300">{subtitle}</p> : null}
        </header>

        <section className="mb-8">
          {children}
        </section>
      </main>
  {/* Footer is rendered globally in app/layout.tsx */}
    </div>
  );
}
