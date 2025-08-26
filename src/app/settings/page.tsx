"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [user, setUser] = useState<{ email: string; id: string; name?: string } | null>(null);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => { fetch('/api/auth/me').then(r => r.json()).then(d => { setUser(d.user); setName(d.user?.name || ''); }); }, []);

  async function update() {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, password }) });
      const d = await res.json();
      if (res.ok) { setUser(d.user); alert('Güncellendi'); }
      else alert(d.error || 'Hata');
    } finally { setLoading(false); }
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <p className="mb-4">Giriş yapılmadı. Lütfen giriş yapın.</p>
        <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Giriş Yap</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-[#0f1720] p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Kullanıcı Ayarları</h2>
        <div className="mb-2">E-posta: {user.email}</div>
        <input className="w-full mb-2 p-2 rounded" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="w-full mb-4 p-2 rounded" placeholder="Yeni parola" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex gap-2">
          <button onClick={update} disabled={loading} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded">
            {loading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
          <button onClick={logout} className="flex-1 bg-red-500 p-2 rounded">Çıkış</button>
        </div>
      </div>
    </div>
  );
}
