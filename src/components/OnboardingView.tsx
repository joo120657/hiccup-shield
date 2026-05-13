"use client";

import { useState } from "react";

interface OnboardingViewProps {
  onComplete: (name: string) => void;
}

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="absolute inset-0 bg-[var(--color-deep-navy)] flex flex-col p-8 z-50 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-12">
          <p className="text-[var(--color-sky-blue)] font-bold text-xs uppercase tracking-[0.3em] mb-4">Welcome</p>
          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            당신을 어떻게<br />
            불러드리면 될까요?
          </h1>
          <p className="text-white/40 text-sm font-medium">딸꾹질 완화 가이드를 시작하기 위해<br />닉네임을 입력해 주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative group">
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/10 py-4 text-2xl font-bold text-white focus:outline-none focus:border-[var(--color-sky-blue)] transition-all placeholder:text-white/5"
              placeholder="이름이나 닉네임"
              autoFocus
            />
            <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--color-sky-blue)] to-[var(--color-mint-green)] transition-all duration-500 ${name ? 'w-full' : 'w-0'}`} />
          </div>

          <button 
            type="submit"
            disabled={!name.trim()}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all transform ${
              name.trim() 
              ? 'bg-white text-[var(--color-deep-navy)] shadow-xl translate-y-0 opacity-100' 
              : 'bg-white/5 text-white/20 translate-y-4 opacity-50 pointer-events-none'
            }`}
          >
            시작하기
          </button>
        </form>
      </div>
      
      <p className="text-center text-white/10 text-[10px] font-bold uppercase tracking-widest pb-8">
        딸꾹뚝 &copy; 2026
      </p>
    </div>
  );
}
