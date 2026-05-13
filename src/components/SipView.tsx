"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { playSound } from "@/lib/audio";

interface SipViewProps {
  onComplete: (success: boolean) => void;
  onCancel: () => void;
}

export default function SipView({ onComplete, onCancel }: SipViewProps) {
  const [tilt, setTilt] = useState(0);
  const [isActivated, setIsActivated] = useState(false);
  const [hasCompletedAction, setHasCompletedAction] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      // beta ranges from -180 to 180. 0 is flat on back, 90 is standing up.
      // Bowing 90 degrees while looking at the screen means the phone becomes horizontal (beta near 0).
      const beta = event.beta || 0;
      setTilt(beta);
      
      // If tilted to horizontal (approx 0 degrees), activate
      if (Math.abs(beta) < 25) {
        if (!isActivated) {
          playSound("progress");
        }
        setIsActivated(true);
      } else {
        if (isActivated) {
          // If was activated and now tilted back, consider action completed
          setHasCompletedAction(true);
        }
        setIsActivated(false);
      }
    };

    window.addEventListener("deviceorientation", handleOrientation);
    
    // Check if permission is needed (iOS 13+)
    // @ts-ignore
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Permission might be needed, handled via a button click
    }

    return () => window.removeEventListener("deviceorientation", handleOrientation);
  }, [isActivated]);

  const requestPermission = async () => {
    // @ts-ignore
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        // @ts-ignore
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState !== 'granted') {
          setPermissionDenied(true);
        }
      } catch (error) {
        setPermissionDenied(true);
      }
    }
  };

  return (
    <div className={`absolute inset-0 flex flex-col p-6 animate-in fade-in duration-300 transition-colors duration-500 ${isActivated ? 'bg-[var(--color-mint-green)]' : 'bg-[var(--color-deep-navy)]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onCancel}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors ${isActivated ? 'bg-black/10 text-black' : 'bg-white/5 text-white'}`}
        >
          ✕
        </button>
        <span className={`font-bold text-sm tracking-widest uppercase ${isActivated ? 'text-black/60' : 'text-[var(--color-mint-green)]'}`}>Silent Sip</span>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Character/Icon Guide */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-12">
          <div className={`absolute inset-0 rounded-full border-2 border-dashed transition-colors ${isActivated ? 'border-black/20' : 'border-white/10 animate-spin-slow'}`} />
          <div className={`text-7xl transition-transform duration-300 ${isActivated ? 'scale-110' : 'scale-100'}`}>
            🥤
          </div>
          {/* Tilt Indicator */}
          <div 
            className="absolute -bottom-4 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold"
            style={{ color: isActivated ? 'black' : 'white' }}
          >
            TILT: {Math.round(tilt)}°
          </div>
        </div>

        {/* Guidance Text */}
        <div className="text-center px-4 mb-12">
          <h3 className={`text-xl font-bold mb-2 transition-colors ${isActivated ? 'text-black' : 'text-white'}`}>
            {isActivated ? "지금입니다! 물을 조금씩 마시세요." : "컵을 들고 허리를 90도로 숙여주세요."}
          </h3>
          <p className={`text-sm transition-colors ${isActivated ? 'text-black/60' : 'text-white/40'}`}>
            {isActivated ? "컵 반대편의 물을 삼킨다고 생각하세요" : "화면이 초록색으로 바뀔 때까지 숙이세요"}
          </p>
        </div>

        {/* Leveler UI */}
        <div className="w-full max-w-[200px] h-2 bg-white/10 rounded-full overflow-hidden mb-12 relative">
          <div 
            className={`absolute top-0 bottom-0 transition-all duration-300 ${isActivated ? 'bg-black' : 'bg-[var(--color-mint-green)]'}`}
            style={{ left: '0', width: `${Math.min(Math.max((tilt / 90) * 100, 0), 100)}%` }}
          />
          {/* 90 degree mark */}
          <div className="absolute top-0 bottom-0 left-[83%] w-0.5 bg-white/30" />
        </div>

        {/* Fallback/Action Buttons */}
        <div className="w-full max-w-xs flex flex-col gap-3">
          {permissionDenied && (
            <p className="text-[10px] text-red-400 text-center mb-2">센서 접근 권한이 거부되었습니다. 수동으로 진행해 주세요.</p>
          )}
          
          {hasCompletedAction && (
            <>
              <button 
                onClick={() => {
                  playSound("success");
                  onComplete(true);
                }}
                className="w-full py-5 rounded-[24px] bg-[var(--color-mint-green)] text-[var(--color-deep-navy)] font-black text-lg shadow-lg shadow-[var(--color-mint-green)]/20 active:scale-95 transition-all"
              >
                성공! 멈췄어요
              </button>
              
              <button 
                onClick={() => onComplete(false)}
                className="w-full py-4 rounded-[24px] bg-white/5 text-white/60 font-bold active:scale-95 transition-all"
              >
                아직 안 멈췄어요
              </button>
            </>
          )}

          {!hasCompletedAction && isActivated && (
            <div className="text-center py-4 text-black animate-pulse font-bold">
              물을 마시는 중...
            </div>
          )}

          {/* iOS Permission Trigger */}
          <button 
            onClick={requestPermission}
            className="text-[10px] text-white/20 underline mt-4"
          >
            센서 동작이 안 되나요? (권한 요청)
          </button>
        </div>
      </div>
    </div>
  );
}
