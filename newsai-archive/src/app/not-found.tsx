import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 — Sayfa bulunamadı</h1>
        <p className="mb-4 text-gray-400">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
  <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded">Ana Sayfaya Dön</Link>
      </div>
    </div>
  );
}
