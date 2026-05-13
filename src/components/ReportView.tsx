"use client";

import { useState, useEffect } from "react";
import { getHistory, getBadges, HistoryItem, Badge } from "@/lib/storage";
import BadgeArchive from "./BadgeArchive";

interface ReportViewProps {
  userName: string;
  onClose: () => void;
}

export default function ReportView({ userName, onClose }: ReportViewProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [showArchive, setShowArchive] = useState(false);

  useEffect(() => {
    setHistory(getHistory());
    setBadges(getBadges());
  }, []);

  if (showArchive) {
    return <BadgeArchive onClose={() => setShowArchive(false)} />;
  }

  const successes = history.filter(h => h.success);
  const successRate = history.length > 0 ? Math.round((successes.length / history.length) * 100) : 0;
  
  const ritualSuccess = successes.filter(h => h.mode === "ritual").length;
  const sipSuccess = successes.filter(h => h.mode === "sip").length;
  const vacuumSuccess = successes.filter(h => h.mode === "vacuum").length;
  const totalSuccess = successes.length;

  // Find the most effective mode
  const counts = [
    { mode: "숨참기", count: vacuumSuccess, color: "var(--color-sky-blue)" },
    { mode: "90도 음수", count: sipSuccess, color: "var(--color-mint-green)" },
    { mode: "동서남북", count: ritualSuccess, color: "var(--color-vibrant-orange)" }
  ].sort((a, b) => b.count - a.count);

  const bestMode = totalSuccess > 0 ? counts[0] : { mode: "...", color: "white" };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "vacuum": return "🫁";
      case "sip": return "🥤";
      case "ritual": return "🧭";
      default: return "✨";
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "vacuum": return "var(--color-sky-blue)";
      case "sip": return "var(--color-mint-green)";
      case "ritual": return "var(--color-vibrant-orange)";
      default: return "white";
    }
  };

  // Chart data calculation
  const getChartSegment = () => {
    if (totalSuccess === 0) return "rgba(255,255,255,0.1) 0% 100%";
    const vacuumPct = (vacuumSuccess / totalSuccess) * 100;
    const sipPct = (sipSuccess / totalSuccess) * 100;
    return `
      var(--color-sky-blue) 0% ${vacuumPct}%, 
      var(--color-mint-green) ${vacuumPct}% ${vacuumPct + sipPct}%, 
      var(--color-vibrant-orange) ${vacuumPct + sipPct}% 100%
    `;
  };

  return (
    <div className="absolute inset-0 z-50 bg-[var(--color-deep-navy)] flex flex-col animate-in fade-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-white/10 transition-colors"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold text-white/40">MY REPORT</h2>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        {/* Profile & Overall Stat */}
        <div className="mb-10">
          <p className="text-white/60 mb-1">{userName}님의 히스토리</p>
          <h1 className="text-3xl font-bold mb-4 leading-tight">
            현재까지의 딸꾹질 중단 성공률은<br />
            <span className="text-[var(--color-sky-blue)]">{successRate}%</span> 입니다.
          </h1>
          
          <div className="glass-panel p-5 bg-gradient-to-br from-white/10 to-transparent border-white/20">
            <p className="text-sm text-white/80 leading-relaxed">
              💡 <span className="font-bold">Insight:</span> {totalSuccess > 0 ? (
                <>현재 {userName}님에게는 <span style={{ color: bestMode.color }} className="font-bold">[{bestMode.mode}]</span> 방법이 가장 효과적이에요!</>
              ) : (
                <>아직 충분한 기록이 없습니다. 완화 방법을 시도해 보세요!</>
              )}
            </p>
          </div>
        </div>

        {/* Analytics Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">성공률 분석</h3>
          </div>
          
          <div className="flex items-center gap-8 py-4">
            {/* Donut Chart Mockup using Conic Gradient */}
            <div 
              className="relative w-32 h-32 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: `conic-gradient(${getChartSegment()})`
              }}
            >
              <div className="absolute inset-2 bg-[var(--color-deep-navy)] rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-[10px] text-white/40">Success</span>
                <span className="text-xl font-bold">{totalSuccess}</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-sky-blue)]" />
                <span className="text-xs text-white/60 flex-1">숨참기</span>
                <span className="text-xs font-bold text-white/80">{vacuumSuccess}회</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-mint-green)]" />
                <span className="text-xs text-white/60 flex-1">90도 음수</span>
                <span className="text-xs font-bold text-white/80">{sipSuccess}회</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-vibrant-orange)]" />
                <span className="text-xs text-white/60 flex-1">동서남북</span>
                <span className="text-xs font-bold text-white/80">{ritualSuccess}회</span>
              </div>
            </div>
          </div>
        </section>

        {/* Badges Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">수집한 뱃지</h3>
            <button 
              onClick={() => setShowArchive(true)}
              className="text-xs text-[var(--color-sky-blue)] font-bold px-2 py-1 bg-white/5 rounded-lg active:scale-95 transition-all"
            >
              전체 보기
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {badges.slice(0, 6).map((badge) => (
              <div 
                key={badge.id}
                className={`glass-panel p-4 flex flex-col items-center justify-center text-center transition-all ${badge.isUnlocked ? 'opacity-100 scale-100' : 'opacity-30 grayscale scale-95'}`}
              >
                <div className="text-2xl mb-2">{badge.icon}</div>
                <p className="text-[10px] font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* History Timeline */}
        <section className="mb-10 pb-10">
          <h3 className="text-xl font-bold mb-4">최근 기록</h3>
          <div className="flex flex-col gap-3">
            {history.map((item) => (
              <div key={item.id} className="glass-panel p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${getModeColor(item.mode)}20` }}
                >
                  {getModeIcon(item.mode)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">{item.date}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.success ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {item.success ? 'SUCCESS' : 'FAIL'}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white/90">
                    {item.mode === 'vacuum' ? '숨참기' : item.mode === 'sip' ? '90도 음수' : '동서남북'}
                  </p>
                  {item.note && <p className="text-[11px] text-white/40 mt-1 truncate italic">"{item.note}"</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
