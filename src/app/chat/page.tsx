"use client";
import React, { useEffect, useMemo, useState } from 'react';
import SessionList from '@/components/chat/SessionList';
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';

type Msg = { id: string; role: 'user'|'assistant'|'system'; text: string };

const STORAGE_KEY = 'newsai_chat_sessions_v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [] as {id:string;title:string}[], messages: {} as Record<string, Msg[]> };
    return JSON.parse(raw);
  } catch (e) {
    return { sessions: [] as {id:string;title:string}[], messages: {} as Record<string, Msg[]> };
  }
}

function saveState(state: any) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<{id:string;title:string}[]>([]);
  const [messages, setMessages] = useState<Record<string, Msg[]>>({});
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const s = loadState();
    setSessions(s.sessions || []);
    setMessages(s.messages || {});
    setActiveId(s.sessions && s.sessions[0] ? s.sessions[0].id : undefined);
  }, []);

  useEffect(() => {
    saveState({ sessions, messages });
  }, [sessions, messages]);

  const activeMessages = useMemo(() => (activeId ? (messages[activeId] || []) : []), [messages, activeId]);

  function createSession() {
    const id = String(Date.now());
    const title = 'Yeni Sohbet';
    const nextSessions = [{ id, title }, ...sessions];
    setSessions(nextSessions);
    setMessages({ ...messages, [id]: [] });
    setActiveId(id);
  }

  function selectSession(id: string) {
    setActiveId(id);
  }

  async function onSend(text: string) {
    if (!activeId) createSession();
    const id = activeId ?? String(Date.now());
    const userMsg: Msg = { id: `m-${Date.now()}`, role: 'user', text };
    setMessages(prev => ({ ...prev, [id]: [...(prev[id] || []), userMsg] }));
    setSending(true);
    try {
      // Try calling server aggregator; fallback to simple echo if shape unknown
      const res = await fetch(`/api/search?q=${encodeURIComponent(text)}`);
      if (res.ok) {
        const data = await res.json();
        let reply = '';
        if (Array.isArray(data.results) && data.results.length) {
          const r = data.results[0] as Record<string, unknown>;
          reply = (typeof r.focused === 'string' && r.focused.trim()) ? r.focused.trim() : (typeof r.answer === 'string' ? r.answer : typeof r.summary === 'string' ? r.summary : typeof r.content === 'string' ? r.content : '');
        } else if (typeof data.answer === 'string') {
          reply = data.answer;
        } else {
          // last resort: try to stringify a short portion
          try { reply = JSON.stringify(data).slice(0, 1000); } catch { reply = ''; }
        }
        reply = (reply || '').trim().slice(0, 2000);
        const assistantMsg: Msg = { id: `m-${Date.now()+1}`, role: 'assistant', text: reply || 'Üzgünüm, arama sonuçlarından anlamlı bir yanıt elde edemedim.' };
        setMessages(prev => ({ ...prev, [id]: [...(prev[id] || []), assistantMsg] }));
      } else {
        const txt = await res.text();
        const assistantMsg: Msg = { id: `m-${Date.now()+2}`, role: 'assistant', text: `Sunucudan beklenmeyen cevap: ${txt.slice(0,400)}` };
        setMessages(prev => ({ ...prev, [id]: [...(prev[id] || []), assistantMsg] }));
      }
    } catch (err:any) {
      const assistantMsg: Msg = { id: `m-${Date.now()+3}`, role: 'assistant', text: `İstek sırasında hata: ${err?.message ?? String(err)}` };
      setMessages(prev => ({ ...prev, [id]: [...(prev[id] || []), assistantMsg] }));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#001219] to-[#001827] text-gray-100">
      <SessionList sessions={sessions} activeId={activeId} onSelectAction={selectSession} onNewAction={createSession} />
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex-1 overflow-auto flex flex-col gap-3 p-4">
          {activeId ? (
            activeMessages.length ? activeMessages.map(m => (
              <ChatMessage key={m.id} role={m.role} text={m.text} />
            )) : (
              <div className="text-sm text-gray-400">Yeni sohbete hoş geldiniz — sorularınızı yazın.</div>
            )
          ) : (
            <div className="text-sm text-gray-400">Sol üstte "Yeni" butonuyla bir sohbet başlatın.</div>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <ChatInput onSendAction={async (t) => { await onSend(t); }} disabled={sending} />
        </div>
      </div>
    </div>
  );
}
