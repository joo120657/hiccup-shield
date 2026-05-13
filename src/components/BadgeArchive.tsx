"use client";

import { Badge, getBadges } from "@/lib/storage";
import { useEffect, useState } from "react";

interface BadgeArchiveProps {
  onClose: () => void;
}

export default function BadgeArchive({ onClose }: BadgeArchiveProps) {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    setAllBadges(getBadges());
  }, []);

  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
  };

  return (
    <div className="absolute inset-0 z-[60] bg-[var(--color-deep-navy)] flex flex-col animate-in fade-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-white/10 transition-colors"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold text-white/40 uppercase tracking-widest">The Collection</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-2">뱃지 아카이브</h1>
          <p className="text-white/40 text-sm">획득한 뱃지를 터치하여 상세 정보를 확인하세요.</p>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-3 gap-4 pb-12">
          {allBadges.map((badge) => (
            <button 
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`glass-panel aspect-square flex flex-col items-center justify-center p-4 transition-all active:scale-95 ${
                badge.isUnlocked 
                ? 'bg-gradient-to-br from-white/10 to-transparent border-white/20' 
                : 'opacity-20 grayscale border-white/5'
              }`}
            >
              <div className="text-3xl mb-2">{badge.icon}</div>
              <p className="text-[10px] font-bold text-center leading-tight">
                {badge.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Badge Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-sm p-8 bg-gradient-to-b from-white/10 to-transparent flex flex-col items-center text-center animate-in zoom-in duration-300">
            <div className="text-6xl mb-6">{selectedBadge.icon}</div>
            <h3 className="text-2xl font-black mb-2">{selectedBadge.name}</h3>
            <p className="text-[var(--color-sky-blue)] font-bold text-xs uppercase tracking-widest mb-4">
              {selectedBadge.isUnlocked ? 'Unlocked' : 'Locked'}
            </p>
            
            <div className="w-full h-[1px] bg-white/10 mb-6" />
            
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-[10px] text-white/30 uppercase font-bold mb-1 tracking-wider">획득 조건</p>
                <p className="text-sm text-white/80">{selectedBadge.description}</p>
              </div>
              
              {selectedBadge.isUnlocked && selectedBadge.unlockedAt && (
                <div>
                  <p className="text-[10px] text-white/30 uppercase font-bold mb-1 tracking-wider">획득 날짜</p>
                  <p className="text-sm text-white/80">{formatDate(selectedBadge.unlockedAt)}</p>
                </div>
              )}
            </div>

            <button 
              onClick={() => setSelectedBadge(null)}
              className="w-full py-4 rounded-[20px] bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 active:scale-95 transition-all"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
