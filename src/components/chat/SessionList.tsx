"use client";
import React from 'react';

export default function SessionList({ sessions, activeId, onSelectAction, onNewAction }:
  { sessions: {id:string;title:string}[]; activeId?: string; onSelectAction: (id:string)=>void; onNewAction: ()=>void }) {
  return (
    <div className="w-64 p-3 border-r border-gray-800 hidden md:block">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold">Sohbetler</div>
        <button className="btn" onClick={onNewAction}>Yeni</button>
      </div>
      <div className="flex flex-col gap-2">
        {sessions.map(s => (
          <button key={s.id} onClick={() => onSelectAction(s.id)} className={`text-left p-2 rounded ${s.id===activeId ? 'bg-[#002b45] text-white' : 'bg-transparent text-gray-200 hover:bg-[#07121a]'}`}>{s.title || 'Yeni Sohbet'}</button>
        ))}
      </div>
    </div>
  );
}
