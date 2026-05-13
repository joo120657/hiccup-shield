"use client";

import { Badge } from "@/lib/storage";
import { useEffect, useState } from "react";

interface BadgePopupProps {
  badges: Badge[];
  onClose: () => void;
}

export default function BadgePopup({ badges, onClose }: BadgePopupProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Play sound or vibration if needed
    if (window.navigator.vibrate) window.navigator.vibrate([100, 50, 100]);
  }, []);

  const currentBadge = badges[currentIndex];

  const handleNext = () => {
    if (currentIndex < badges.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-sm p-8 bg-gradient-to-b from-white/10 to-transparent flex flex-col items-center text-center animate-in zoom-in duration-500 delay-200">
        <div className="text-6xl mb-6 animate-bounce">
          {currentBadge.icon}
        </div>
        <p className="text-[var(--color-sky-blue)] font-bold text-sm tracking-widest uppercase mb-2">NEW BADGE UNLOCKED!</p>
        <h2 className="text-2xl font-black mb-4">{currentBadge.name}</h2>
        <p className="text-white/60 text-sm mb-8">{currentBadge.description}</p>
        
        <button 
          onClick={handleNext}
          className="w-full py-4 rounded-[20px] bg-white text-[var(--color-deep-navy)] font-black hover:bg-opacity-90 active:scale-95 transition-all"
        >
          {currentIndex < badges.length - 1 ? "다음 확인" : "멋져요!"}
        </button>

        {/* Progress indicators for multiple badges */}
        {badges.length > 1 && (
          <div className="flex gap-1.5 mt-6">
            {badges.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full ${i === currentIndex ? 'bg-white' : 'bg-white/20'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
