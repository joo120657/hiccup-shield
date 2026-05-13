"use client";

import { useState, useEffect } from "react";
import { playSound } from "@/lib/audio";

interface SettingsViewProps {
  currentName: string;
  onUpdateName: (newName: string) => void;
  onResetData: () => void;
  onClose: () => void;
}

export default function SettingsView({ currentName, onUpdateName, onResetData, onClose }: SettingsViewProps) {
  const [newName, setNewName] = useState(currentName);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    playSound("click");
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
    }
  };

  const handleSave = () => {
    if (newName.trim()) {
      onUpdateName(newName.trim());
      onClose();
    }
  };

  return (
    <div className="absolute inset-0 z-[100] bg-[var(--color-deep-navy)] flex flex-col animate-in fade-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <button onClick={onClose} className="text-white/60 text-sm font-bold">취소</button>
        <h2 className="text-lg font-bold">설정</h2>
        <button onClick={handleSave} className="text-[var(--color-sky-blue)] text-sm font-bold">저장</button>
      </div>

      <div className="flex-1 p-6 space-y-10">
        {/* Profile Section */}
        <section>
          <p className="text-[10px] text-white/30 uppercase font-bold mb-4 tracking-widest">사용자 프로필</p>
          <div className="glass-panel p-6">
            <label className="block text-xs text-white/40 mb-2">이름</label>
            <input 
              type="text" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-2 text-xl font-bold focus:outline-none focus:border-[var(--color-sky-blue)] transition-colors"
              placeholder="이름을 입력하세요"
            />
          </div>
        </section>

        {/* Data Management Section */}
        <section>
          <p className="text-[10px] text-white/30 uppercase font-bold mb-4 tracking-widest">데이터 관리</p>
          <div className="space-y-4">
            {/* PWA Install Button (Automatic or Manual) */}
            {deferredPrompt ? (
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[var(--color-sky-blue)]/20 to-[var(--color-mint-green)]/20 border border-white/10 flex flex-col gap-3">
                <div>
                  <h4 className="font-bold text-sm">🛡️ 공식 앱 설치하기</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed">
                    홈 화면에 추가하면 오프라인에서도 작동하며,<br />
                    매번 마이크 권한을 묻지 않아 훨씬 편리합니다.
                  </p>
                </div>
                <button 
                  onClick={handleInstallClick}
                  className="w-full py-3 rounded-xl bg-white text-[var(--color-deep-navy)] font-black text-xs shadow-lg active:scale-95 transition-all"
                >
                  지금 바로 설치
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs">📱</span>
                  <h4 className="font-bold text-sm text-white/80">앱 설치 방법</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2 items-start">
                    <span className="w-4 h-4 rounded-full bg-[var(--color-sky-blue)] text-[10px] flex items-center justify-center font-bold">1</span>
                    <p className="text-[10px] text-white/60 leading-relaxed">
                      아이폰(Safari): 하단 <span className="text-white font-bold">[공유 버튼 ↑]</span> 클릭
                    </p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <span className="w-4 h-4 rounded-full bg-[var(--color-sky-blue)] text-[10px] flex items-center justify-center font-bold">2</span>
                    <p className="text-[10px] text-white/60 leading-relaxed">
                      메뉴에서 <span className="text-white font-bold">[홈 화면에 추가]</span> 클릭
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={() => setShowConfirmReset(true)}
              className="w-full glass-panel p-6 flex items-center justify-between group hover:bg-red-500/10 transition-colors"
            >
              <span className="text-white/80 group-hover:text-red-400 transition-colors">데이터 초기화</span>
              <span className="text-white/20">→</span>
            </button>
            <p className="text-[10px] text-white/20 px-2">모든 히스토리와 획득한 뱃지 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</p>
          </div>
        </section>

        {/* Info Section */}
        <section>
          <p className="text-[10px] text-white/30 uppercase font-bold mb-4 tracking-widest">앱 정보</p>
          <div className="glass-panel p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/40">버전</span>
              <span className="text-white/80">1.0.0 (v1.0.2)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/40">개발자</span>
              <span className="text-white/80">Gentle Shield Team</span>
            </div>
          </div>
        </section>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-panel w-full max-w-xs p-8 flex flex-col items-center text-center animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-3xl mb-6">⚠️</div>
            <h3 className="text-xl font-bold mb-2">정말 초기화할까요?</h3>
            <p className="text-sm text-white/40 mb-8">모든 기록이 영구적으로 삭제됩니다.</p>
            
            <div className="grid grid-cols-2 gap-3 w-full">
              <button 
                onClick={() => setShowConfirmReset(false)}
                className="py-3 rounded-xl bg-white/5 font-bold border border-white/10"
              >
                취소
              </button>
              <button 
                onClick={() => {
                  onResetData();
                  onClose();
                }}
                className="py-3 rounded-xl bg-red-500/80 font-bold"
              >
                초기화
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
