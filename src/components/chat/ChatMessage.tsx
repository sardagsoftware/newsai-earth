"use client";
import React from 'react';

export default function ChatMessage({ role, text }: { role: 'user' | 'assistant' | 'system'; text: string }) {
  return (
    <div className={`py-3 px-4 rounded-lg ${role === 'user' ? 'bg-[#06202a] self-end text-white' : 'bg-[#07121a] text-gray-200 self-start'}`}>
      <div className="whitespace-pre-wrap text-sm">{text}</div>
    </div>
  );
}
