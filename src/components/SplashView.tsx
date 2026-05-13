"use client";

import { useEffect, useState } from "react";

export default function SplashView() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 bg-[var(--color-deep-navy)] flex flex-col items-center justify-center z-[100] overflow-hidden">
      {/* Background Decorative Circles */}
      <div className={`absolute w-[400px] h-[400px] rounded-full bg-[var(--color-sky-blue)]/5 blur-3xl transition-all duration-1000 ${isAnimating ? 'scale-150 opacity-100' : 'scale-50 opacity-0'}`} />
      
      <div className={`flex flex-col items-center transition-all duration-700 transform ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* New Official Logo Image */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-8">
          <div className={`absolute inset-0 rounded-[40px] bg-white shadow-2xl transition-all duration-700 ${isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
          <img 
            src="/icon.png" 
            alt="딸꾹뚝 로고"
            className={`relative z-10 w-32 h-32 object-contain transition-all duration-700 delay-100 ${isAnimating ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
          />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">딸꾹뚝</h1>
          <p className="text-[var(--color-sky-blue)]/60 text-xs font-bold uppercase tracking-[0.4em]">딸꾹질을 뚝!</p>
        </div>
      </div>
      
      {/* Loading Bar */}
      <div className="absolute bottom-16 w-32 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r from-[var(--color-sky-blue)] to-[var(--color-mint-green)] transition-all duration-1100 ease-out ${isAnimating ? 'w-full' : 'w-0'}`} 
        />
      </div>
    </div>
  );
}
