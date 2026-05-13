"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { playSound } from "@/lib/audio";

interface RitualViewProps {
  userName: string;
  onComplete: (success: boolean) => void;
  onCancel: () => void;
}

type Direction = "east" | "west" | "south" | "north";

export default function RitualView({ userName, onComplete, onCancel }: RitualViewProps) {
  const [step, setStep] = useState<number>(0); // 0: Ready, 1: East, 2: West, 3: South, 4: North, 5: Done
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);

  const directions: Direction[] = ["east", "west", "south", "north"];
  const directionLabels = {
    east: { kr: "동!", en: "East!" },
    west: { kr: "서!", en: "West!" },
    south: { kr: "남!", en: "South!" },
    north: { kr: "북!", en: "North!" },
  };

  const nextStep = useCallback(() => {
    if (step < 4) {
      playSound("progress");
      setStep(step + 1);
      setTranscript("");
      if (window.navigator.vibrate) window.navigator.vibrate(100);
    } else {
      playSound("success");
      setStep(5);
    }
  }, [step]);

  // Voice Recognition Persistence
  useEffect(() => {
    if (step >= 1 && step <= 4 && !recognitionRef.current) {
      // @ts-ignore
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = "ko-KR";

          recognition.onstart = () => {
            setIsListening(true);
            setError(null);
          };

          recognition.onresult = (event: any) => {
            const current = event.results[event.results.length - 1][0].transcript.toLowerCase();
            setTranscript(current);
          };

          recognition.onerror = (event: any) => {
            console.error("Speech Recognition Error:", event.error);
            if (event.error === 'not-allowed') {
              setError("마이크 권한이 필요합니다. 브라우저 설정을 확인해주세요.");
            } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
              setError(`인식 오류: ${event.error}`);
            }
          };

          recognition.onend = () => {
            setIsListening(false);
            // Auto-restart only if we haven't stopped it intentionally
            if (step >= 1 && step <= 4 && recognitionRef.current) {
              try { recognition.start(); } catch(e) {}
            }
          };

          recognition.start();
          recognitionRef.current = recognition;
        } catch (e) {
          setIsSupported(false);
        }
      } else {
        setIsSupported(false);
      }
    }

    // Stop recognition when finished or canceled
    if ((step === 0 || step === 5) && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    return () => {
      // Don't stop unless we are really leaving or done
      if (step === 5 && recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [step]);

  // Handle result checking separately to avoid re-initializing recognition
  useEffect(() => {
    if (step >= 1 && step <= 4 && transcript) {
      const target = directionLabels[directions[step - 1]];
      const targetKr = target.kr.replace("!", "");
      const targetEn = target.en.replace("!", "").toLowerCase();
      
      if (transcript.includes(targetKr) || transcript.includes(targetEn)) {
        nextStep();
      }
    }
  }, [transcript, step, nextStep]);

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
        <span className="text-[var(--color-vibrant-orange)] font-bold text-sm tracking-widest uppercase">Master Ritual</span>
        <div className="w-10" />
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2 mb-12">
        {directions.map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${step > i ? 'bg-[var(--color-vibrant-orange)]' : 'bg-white/10'}`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Visual Compass/Target */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-12">
          {/* Compass Ring */}
          <div className="absolute inset-0 rounded-full border border-white/5" />
          <div 
            className="absolute inset-4 rounded-full border-2 border-[var(--color-vibrant-orange)]/20 transition-transform duration-700"
            style={{ 
              transform: `rotate(${
                step === 1 ? 0 :   // East
                step === 2 ? 180 : // West
                step === 3 ? 270 : // South
                step === 4 ? 90 :  // North
                0
              }deg)` 
            }}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[var(--color-vibrant-orange)] rounded-full shadow-[0_0_15px_var(--color-vibrant-orange)]" />
          </div>

          <div className="text-center z-10">
            <span className="text-6xl mb-4 block">
              {step === 0 ? "🧭" : step === 5 ? "✅" : "🎙️"}
            </span>
            <p className="text-2xl font-black text-[var(--color-vibrant-orange)] uppercase">
              {step >= 1 && step <= 4 ? directions[step - 1] : ""}
            </p>
          </div>
        </div>

        {/* Guidance Text */}
        <div className="text-center px-4 mb-12 h-24">
          <h3 className="text-xl font-bold mb-2">
            {step === 0 && `준비되셨나요? ${userName}님의 정면을 '동쪽'으로 설정합니다.`}
            {step === 1 && "정면을 보고 크게 외치세요: '동!'"}
            {step === 2 && "180도 뒤로 돌아보고 외치세요: '서!'"}
            {step === 3 && "왼쪽으로 90도 돌아보고 외치세요: '남!'"}
            {step === 4 && "다시 180도 뒤를 보고 외치세요: '북!'"}
            {step === 5 && "미션 클리어! 이제 정면을 보고 숨을 고르세요."}
          </h3>
          <p className="text-white/40 text-sm">
            {step >= 1 && step <= 4 && (
              !isSupported ? (
                <span className="text-amber-400/80 text-xs">이 브라우저에서는 음성 인식을 지원하지 않습니다. 수동 패스를 사용해 주세요.</span>
              ) : error ? (
                <span className="text-red-400/80 text-xs">{error}</span>
              ) : isListening ? (
                `음성 인식 중... (들린 말: ${transcript || "..."})`
              ) : (
                "마이크를 활성화하는 중..."
              )
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          {step === 0 && (
            <button 
              onClick={nextStep}
              className="w-full py-5 rounded-[24px] bg-[var(--color-vibrant-orange)] text-[var(--color-deep-navy)] font-black text-lg shadow-lg shadow-[var(--color-vibrant-orange)]/20"
            >
              확인, 준비 완료!
            </button>
          )}

          {step >= 1 && step <= 4 && (
            <button 
              onClick={nextStep}
              className="w-full py-5 rounded-[24px] bg-white/5 text-white/80 font-bold border border-white/10"
            >
              인식 성공 (수동 패스)
            </button>
          )}

          {step === 5 && (
            <>
              <button 
                onClick={() => onComplete(true)}
                className="w-full py-5 rounded-[24px] bg-[var(--color-vibrant-orange)] text-[var(--color-deep-navy)] font-black text-lg"
              >
                성공! 멈췄어요
              </button>
              <button 
                onClick={() => onComplete(false)}
                className="w-full py-4 rounded-[24px] bg-white/5 text-white/60 font-bold"
              >
                아직 안 멈췄어요
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
