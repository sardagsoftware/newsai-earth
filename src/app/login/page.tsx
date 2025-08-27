"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
  // basic validation
  if (!email.includes('@')) { setError('Geçerli bir e-posta girin'); return; }
  if (password.length < 6) { setError('Parola en az 6 karakter olmalı'); return; }
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Hata'); return; }
    router.push('/settings');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={submit} className="w-full max-w-md bg-[#0f1720] p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Giriş Yap</h2>
        {error && <div className="text-red-400 mb-2">{error}</div>}
  <input className="w-full mb-2 p-2 rounded bg-[#081018]" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
  <input type="password" className="w-full mb-4 p-2 rounded bg-[#081018]" placeholder="Parola" value={password} onChange={(e) => setPassword(e.target.value)} />
  <button className="w-full bg-gradient-to-r from-green-400 to-teal-500 p-2 rounded font-semibold">Giriş</button>
  <div className="mt-3 text-sm text-gray-400">Henüz hesabınız yok mu? <a href="/register" className="text-blue-400 underline">Kayıt olun</a></div>
      </form>
    </div>
  );
}
