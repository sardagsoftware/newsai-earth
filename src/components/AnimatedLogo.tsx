"use client";
import React from "react";

export default function AnimatedLogo({ size = 40 }: { size?: number }) {
  return (
    <div className="logo-wrap inline-flex items-center gap-3" aria-hidden>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
      >
        <defs>
          <linearGradient id="g1" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" stroke="url(#g1)" strokeWidth="3" fill="rgba(255,255,255,0.02)" />
        <g className="logo-inner" transform="translate(12,12)">
          <path d="M12 2 C16 2 20 6 20 10 C20 14 16 18 12 18 C8 18 4 14 4 10 C4 6 8 2 12 2 Z" fill="url(#g1)" opacity="0.95" />
        </g>
      </svg>
      <style jsx>{`
        .logo-svg{display:block}
        .logo-wrap{transform-origin:center;}
        .logo-svg{animation: logo-rotate 8s linear infinite;}
        .logo-inner{animation: logo-bob 3s ease-in-out infinite; transform-origin:12px 12px}
        @keyframes logo-rotate{0%{transform:rotate(0)}50%{transform:rotate(12deg)}100%{transform:rotate(0deg)}}
        @keyframes logo-bob{0%{transform:translateY(0)}50%{transform:translateY(-3px)}100%{transform:translateY(0)}}
        @media (prefers-reduced-motion: reduce){
          .logo-svg,.logo-inner{animation:none}
        }
      `}</style>
    </div>
  );
}
