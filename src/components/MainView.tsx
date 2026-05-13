"use client";

import { useState } from "react";
import ReportView from "./ReportView";
import VacuumView from "./VacuumView";
import SipView from "./SipView";
import RitualView from "./RitualView";
import BadgePopup from "./BadgePopup";
import SettingsView from "./SettingsView";
import { saveHistory, Badge, resetAllData } from "@/lib/storage";
import { playSound } from "@/lib/audio";

interface MainViewProps {
  userName: string;
  onUpdateName: (newName: string) => void;
}

export default function MainView({ userName, onUpdateName }: MainViewProps) {
  const [activeMode, setActiveMode] = useState<"vacuum" | "sip" | "ritual" | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);

  const handleComplete = (success: boolean) => {
    if (activeMode) {
      const newUnlocked = saveHistory({
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        mode: activeMode,
        success
      });

      if (newUnlocked.length > 0) {
        playSound("success");
        setUnlockedBadges(newUnlocked);
      }
    }
    setActiveMode(null);
  };

  const handleReset = () => {
    if (confirm("모든 데이터를 초기화할까요? 이 작업은 되돌릴 수 없습니다.")) {
      resetAllData();
    }
  };

  if (unlockedBadges.length > 0) {
    return <BadgePopup badges={unlockedBadges} onClose={() => setUnlockedBadges([])} />;
  }

  if (showReport) {
    return <ReportView userName={userName} onClose={() => setShowReport(false)} />;
  }

  if (activeMode === "vacuum") {
    return <VacuumView onCancel={() => setActiveMode(null)} onComplete={handleComplete} />;
  }

  if (activeMode === "sip") {
    return <SipView onCancel={() => setActiveMode(null)} onComplete={handleComplete} />;
  }

  if (activeMode === "ritual") {
    return <RitualView userName={userName} onCancel={() => setActiveMode(null)} onComplete={handleComplete} />;
  }

  return (
    <div className="absolute inset-0 flex flex-col p-6 pb-24 bg-[var(--color-deep-navy)] text-white overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-sky-blue)] to-[var(--color-mint-green)] flex items-center justify-center text-lg shadow-lg">🛡️</div>
            <div>
              <p className="text-white/40 text-xs font-medium">딸꾹뚝</p>
              <h1 className="text-xl font-bold tracking-tight">{userName}님, 안녕하세요!</h1>
            </div>
          </div>
          <button 
            onClick={() => {
              playSound("click");
              setShowSettings(true);
            }}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-white/10 transition-colors"
          >
            ⚙️
          </button>
        </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Button 1: Vacuum Hold */}
        <button 
          onClick={() => {
            playSound("click");
            setActiveMode("vacuum");
          }}
          className="flex-1 rounded-[32px] bg-[var(--color-sky-blue)]/10 border border-[var(--color-sky-blue)]/20 p-6 flex flex-col justify-end text-left relative overflow-hidden group transition-all hover:bg-[var(--color-sky-blue)]/20 active:scale-[0.98]"
        >
          <div className="absolute top-6 right-6 w-14 h-14 rounded-2xl bg-[var(--color-sky-blue)]/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            🫁
          </div>
          <div>
            <h2 className="text-[var(--color-sky-blue)] font-black text-2xl mb-1">숨참기</h2>
            <p className="text-white/80 text-[13px] font-medium leading-snug mb-1">
              물이 없을 때 · 어디서나 조용히<br />
              클래식한 방법이죠
            </p>
            <p className="text-white/30 text-[10px] uppercase tracking-tighter">No water? Stay quiet. The classic way.</p>
          </div>
        </button>

        {/* Button 2: Silent Sip */}
        <button 
          onClick={() => {
            playSound("click");
            setActiveMode("sip");
          }}
          className="flex-1 rounded-[32px] bg-[var(--color-mint-green)]/10 border border-[var(--color-mint-green)]/20 p-6 flex flex-col justify-end text-left relative overflow-hidden group transition-all hover:bg-[var(--color-mint-green)]/20 active:scale-[0.98]"
        >
          <div className="absolute top-6 right-6 w-14 h-14 rounded-2xl bg-[var(--color-mint-green)]/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            🥤
          </div>
          <div>
            <h2 className="text-[var(--color-mint-green)] font-black text-2xl mb-1">90도 음수</h2>
            <p className="text-white/80 text-[13px] font-medium leading-snug mb-1">
              물은 있고 창피한 건 싫을 때<br />
              사실 그냥 물 마신다는 의미예요
            </p>
            <p className="text-white/30 text-[10px] uppercase tracking-tighter">Water's here, but keep it low-key. Just a sip.</p>
          </div>
        </button>

        {/* Button 3: Master Ritual */}
        <button 
          onClick={() => {
            playSound("click");
            setActiveMode("ritual");
          }}
          className="flex-1 rounded-[32px] bg-[var(--color-vibrant-orange)]/10 border border-[var(--color-vibrant-orange)]/20 p-6 flex flex-col justify-end text-left relative overflow-hidden group transition-all hover:bg-[var(--color-vibrant-orange)]/20 active:scale-[0.98]"
        >
          <div className="absolute top-6 right-6 w-14 h-14 rounded-2xl bg-[var(--color-vibrant-orange)]/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            🧭
          </div>
          <div>
            <h2 className="text-[var(--color-vibrant-orange)] font-black text-2xl mb-1">동서남북</h2>
            <p className="text-white/80 text-[13px] font-medium leading-snug mb-1">
              현재까지 성공률 99.9% · 소리 내도 괜찮을 때<br />
              제작자 추천 필살기
            </p>
            <p className="text-white/30 text-[10px] uppercase tracking-tighter">99.9% Success Rate. Loud and Proud.</p>
          </div>
        </button>
      </div>

      {/* Bottom Sheet Handle */}
      <button 
        onClick={() => {
          playSound("click");
          setShowReport(true);
        }}
        className="absolute bottom-0 left-0 right-0 h-20 flex flex-col items-center justify-center pb-4 bg-gradient-to-t from-[var(--color-deep-navy)] to-transparent hover:from-white/5 transition-all group"
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mb-2 group-hover:bg-white/40 transition-colors"></div>
        <span className="text-[10px] font-bold text-white/40 tracking-[0.2em] group-hover:text-white/60 transition-colors">MY REPORT</span>
      </button>
      {/* Settings Modal */}
      {showSettings && (
        <SettingsView 
          currentName={userName}
          onUpdateName={onUpdateName}
          onResetData={handleReset}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
