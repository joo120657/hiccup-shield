"use client";

import { useState, useEffect } from "react";
import SplashView from "@/components/SplashView";
import OnboardingView from "@/components/OnboardingView";
import MainView from "@/components/MainView";

type AppState = "splash" | "onboarding" | "main";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("splash");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => console.log("SW registration failed:", err));
    }
  }, []);

  useEffect(() => {
    // Check local storage for user name
    const storedName = localStorage.getItem("hiccup_user_name");
    
    // Simulate splash screen delay
    const splashTimer = setTimeout(() => {
      if (storedName) {
        setUserName(storedName);
        setAppState("main");
      } else {
        setAppState("onboarding");
      }
    }, 1200); // 1.2s splash screen

    return () => clearTimeout(splashTimer);
  }, []);

  const handleOnboardingComplete = (name: string) => {
    const finalName = name.trim() || "User";
    setUserName(finalName);
    localStorage.setItem("hiccup_user_name", finalName);
    setAppState("main");
  };

  const handleUpdateName = (newName: string) => {
    setUserName(newName);
    localStorage.setItem("hiccup_user_name", newName);
  };

  return (
    <main className="flex-1 flex flex-col relative w-full h-full max-w-md mx-auto overflow-hidden">
      {appState === "splash" && <SplashView />}
      {appState === "onboarding" && (
        <OnboardingView onComplete={handleOnboardingComplete} />
      )}
      {appState === "main" && <MainView userName={userName} onUpdateName={handleUpdateName} />}
    </main>
  );
}
