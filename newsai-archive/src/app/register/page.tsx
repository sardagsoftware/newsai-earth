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
  <form onSubmit={submit} className="w-full max-w-md card-glass p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Kayıt Ol</h2>
        {error && <div className="text-red-400 mb-2">{error}</div>}
  <div>
    <label htmlFor="register-name" className="sr-only">İsim</label>
    <input id="register-name" name="name" className="w-full mb-2 p-2 rounded search-input" placeholder="İsim" value={name} onChange={(e) => setName(e.target.value)} />
  </div>
  <div>
    <label htmlFor="register-email" className="sr-only">E-posta</label>
    <input id="register-email" name="email" className="w-full mb-2 p-2 rounded search-input" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
  </div>
  <div>
    <label htmlFor="register-password" className="sr-only">Parola</label>
    <input id="register-password" name="password" type="password" className="w-full mb-4 p-2 rounded search-input" placeholder="Parola" value={password} onChange={(e) => setPassword(e.target.value)} />
  </div>
  <button className="w-full btn btn--primary">Kayıt Ol</button>
  <div className="mt-3 text-sm text-gray-400">Zaten hesabınız var mı? <a href="/login" className="text-blue-400 underline">Giriş yapın</a></div>
      </form>
    </div>
  );
}
