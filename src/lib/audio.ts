"use client";

const SOUND_URLS = {
  success: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
  click: "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
  progress: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
  fail: "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3",
};

export const playSound = (type: keyof typeof SOUND_URLS) => {
  if (typeof window === "undefined") return;
  
  const audio = new Audio(SOUND_URLS[type]);
  audio.volume = 0.5;
  audio.play().catch(e => console.log("Audio play failed (user interaction might be required):", e));
};
