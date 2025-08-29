"use client";

import ThemedLayout from "../../components/ThemedLayout";
import React, { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | string>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Simple client-side demo: open mailto as fallback
    const subject = encodeURIComponent(`NewsAI İletişim - ${name}`);
    const body = encodeURIComponent(message + "\n\nGönderen: " + name + " <" + email + ">");
    window.location.href = `mailto:hello@newsai.earth?subject=${subject}&body=${body}`;
    setStatus("E-posta istemcisi açıldı.");
  }

  return (
    <ThemedLayout title="İletişim" subtitle="Bize ulaşın" accent="from-pink-400 via-orange-400 to-yellow-400">
  <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 card-glass p-6 rounded-lg">
        <div>
          <label htmlFor="contact-name" className="block text-sm text-gray-300">İsim</label>
          <input id="contact-name" name="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-4 py-2 rounded search-input" />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-sm text-gray-300">E-posta</label>
          <input id="contact-email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 px-4 py-2 rounded search-input" />
        </div>
        <div>
          <label htmlFor="contact-message" className="block text-sm text-gray-300">Mesaj</label>
          <textarea id="contact-message" name="message" value={message} onChange={(e) => setMessage(e.target.value)} className="w-full mt-1 px-4 py-2 rounded search-input h-32" />
        </div>
        <div>
          <button type="submit" className="btn btn--primary px-5 py-2">Gönder</button>
        </div>
        {status && <div className="text-green-400">{status}</div>}
      </form>
    </ThemedLayout>
  );
}
