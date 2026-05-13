"use client";

import { useState, useEffect } from "react";
import { playSound } from "@/lib/audio";

interface VacuumViewProps {
  onComplete: (success: boolean) => void;
  onCancel: () => void;
}

type Phase = "ready" | "inhale" | "hold" | "exhale" | "done";

export default function VacuumView({ onComplete, onCancel }: VacuumViewProps) {
  const [phase, setPhase] = useState<Phase>("ready");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === "inhale") {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else {
        setPhase("hold");
        setTimeLeft(15);
        playSound("progress");
        // Haptic feedback simulation
        if (window.navigator.vibrate) window.navigator.vibrate(200);
      }
    } else if (phase === "hold") {
      if (timeLeft > 0) {
        timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
          // Pulse vibration every second
          if (window.navigator.vibrate) window.navigator.vibrate(50);
        }, 1000);
      } else {
        setPhase("exhale");
        setTimeLeft(5);
        playSound("progress");
        if (window.navigator.vibrate) window.navigator.vibrate(200);
      }
    } else if (phase === "exhale") {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else {
        setPhase("done");
        playSound("success");
      }
    }

    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  const startBreathing = () => {
    setPhase("inhale");
    setTimeLeft(5);
  };

  return (
    <div className="absolute inset-0 bg-[var(--color-deep-navy)] flex flex-col p-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onCancel}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl hover:bg-white/10"
        >
          ✕
        </button>
        <span className="text-[var(--color-sky-blue)] font-bold text-sm tracking-widest uppercase">Vacuum Hold</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Breathing Circle */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
          {/* Inner Circle (The one that scales) */}
          <div 
            className={`absolute rounded-full bg-[var(--color-sky-blue)]/20 border-2 border-[var(--color-sky-blue)]/40 transition-all duration-1000 ease-in-out ${
              phase === "inhale" ? "w-full h-full" : 
              phase === "hold" ? "w-full h-full animate-pulse-soft" : 
              phase === "exhale" ? "w-24 h-24" : "w-32 h-32"
            }`}
          />
          
          {/* Static Border */}
          <div className="absolute w-full h-full rounded-full border border-white/5" />

          {/* Text Info */}
          <div className="z-10 text-center">
            <p className="text-white/40 text-sm uppercase font-bold tracking-widest mb-1">
              {phase === "ready" ? "Ready" : 
               phase === "inhale" ? "Inhale" : 
               phase === "hold" ? "Hold" : 
               phase === "exhale" ? "Exhale" : "Complete"}
            </p>
            <p className="text-5xl font-black">
              {phase === "ready" ? "🫁" : timeLeft}
            </p>
          </div>
        </div>

        {/* Guidance Text */}
        <div className="text-center px-4 mb-12">
          <h3 className="text-xl font-bold mb-2">
            {phase === "ready" && "등을 펴고 편안하게 앉으세요."}
            {phase === "inhale" && "5초간 깊게 숨을 들이마십니다."}
            {phase === "hold" && "멈추세요! 15초간 유지합니다."}
            {phase === "exhale" && "천천히, 끝까지 내뱉으세요."}
            {phase === "done" && "몸의 긴장을 풀고 잠시 기다려보세요."}
          </h3>
          <p className="text-white/40 text-sm">
            {phase === "hold" && "진동과 타이머에 집중하세요"}
            {phase === "done" && "성공했다면 아래 버튼을 눌러주세요"}
          </p>
        </div>

        {/* Action Button */}
        {phase === "ready" ? (
          <button 
            onClick={startBreathing}
            className="w-full max-w-xs py-5 rounded-[24px] bg-[var(--color-sky-blue)] text-[var(--color-deep-navy)] font-black text-lg shadow-lg shadow-[var(--color-sky-blue)]/20 active:scale-95 transition-all"
          >
            가이드 시작하기
          </button>
        ) : phase === "done" ? (
          <div className="w-full max-w-xs flex flex-col gap-3">
            <button 
              onClick={() => onComplete(true)}
              className="w-full py-5 rounded-[24px] bg-[var(--color-sky-blue)] text-[var(--color-deep-navy)] font-black text-lg"
            >
              성공! 멈췄어요
            </button>
            <button 
              onClick={() => onComplete(false)}
              className="w-full py-4 rounded-[24px] bg-white/5 text-white/60 font-bold"
            >
              아직 안 멈췄어요
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
