/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Footer from "../../../components/Footer";

export default async function ElementsDetail({ params }: any) {
  const title = decodeURIComponent(String(params?.slug || '').replace(/-/g, " "));
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071218] via-[#08141a] to-[#061018] text-gray-100">
      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600">{title}</h1>
        <p className="text-gray-300 mb-6">Elementler modülü detay sayfası — demo içerik.</p>
        <article className="bg-[#07121a] p-6 rounded-2xl shadow-lg">
          <p className="text-gray-300">Detay içerik burada gösterilecek. Bu sayfa Haber AI detay tasarımının elementlere uyarlanmış versiyonudur.</p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
