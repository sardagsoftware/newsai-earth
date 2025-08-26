"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
  // basic validation
  if (!name.trim()) { setError('İsim gerekli'); return; }
  if (!email.includes('@')) { setError('Geçerli bir e-posta girin'); return; }
  if (password.length < 6) { setError('Parola en az 6 karakter olmalı'); return; }
  const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Hata'); return; }
    router.push('/login');
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <form onSubmit={submit} className="w-full max-w-md bg-[#0f1720] p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Kayıt Ol</h2>
        {error && <div className="text-red-400 mb-2">{error}</div>}
        <input className="w-full mb-2 p-2 rounded" placeholder="İsim" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full mb-2 p-2 rounded" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="w-full mb-4 p-2 rounded" placeholder="Parola" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded font-semibold">Kayıt Ol</button>
      </form>
    </div>
  );
}
