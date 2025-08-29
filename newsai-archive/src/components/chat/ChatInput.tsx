"use client";
import React, { useEffect, useRef, useState } from 'react';

export default function ChatInput({ onSendAction, disabled }: { onSendAction: (text: string) => Promise<void>; disabled?: boolean }) {
  const [text, setText] = useState('');
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // '/' focuses the textarea
      if (e.key === '/' && document.activeElement !== taRef.current) {
        e.preventDefault();
        taRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

    async function submit() {
    const t = text.trim();
    if (!t) return;
    setText('');
      await onSendAction(t);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Ctrl+Enter or Cmd+Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      void submit();
    }
  }

  return (
    <div className="w-full">
      <textarea
        ref={taRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={4}
        placeholder="Sorunuzu yazın — Enter yerine Ctrl/Cmd+Enter ile gönderin. '/' ile odaklayın."
        className="w-full p-4 rounded-lg search-input resize-none"
        aria-label="Chat input"
        disabled={disabled}
      />
      <div className="mt-2 flex items-center justify-end gap-2">
        <button onClick={() => setText('')} className="btn" type="button">Temizle</button>
        <button onClick={() => void submit()} className="btn btn--primary" type="button" disabled={disabled}>Gönder</button>
      </div>
    </div>
  );
}
