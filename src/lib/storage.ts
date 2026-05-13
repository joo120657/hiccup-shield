"use client";

export interface HistoryItem {
  id: string;
  date: string;
  mode: "vacuum" | "sip" | "ritual";
  success: boolean;
  note?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  isUnlocked: boolean;
  description: string;
  unlockedAt?: string;
}

const DEFAULT_BADGES: Badge[] = [
  { id: "first_shield", name: "첫 번째 방패", icon: "🛡️", isUnlocked: false, description: "첫 방어 성공" },
  { id: "all_rounder", name: "올라운더", icon: "🌈", isUnlocked: false, description: "모든 방법 1회 이상 성공" },
  { id: "winning_streak", name: "연승 행진", icon: "🔥", isUnlocked: false, description: "3회 연속 성공" },
  { id: "persistent_guard", name: "끈기 있는 가드", icon: "🦾", isUnlocked: false, description: "실패 후 다시 시도하여 성공" },
  { id: "east_master", name: "동쪽의 지배자", icon: "🧭", isUnlocked: false, description: "동서남북 5회 성공" },
  { id: "night_owl", name: "심야의 수호자", icon: "🌙", isUnlocked: false, description: "새벽 시간 방어 성공" },
  { id: "silent_ninja", name: "침묵의 마스터", icon: "🥷", isUnlocked: false, description: "90도 음수 10회 성공" },
  { id: "king_of_lungs", name: "폐활량 왕", icon: "🫁", isUnlocked: false, description: "숨참기 15회 성공" },
  { id: "legendary_guard", name: "전설의 가드", icon: "🏆", isUnlocked: false, description: "모든 방법 10회 이상" },
];

export const getHistory = (): HistoryItem[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("hiccup_history");
  return stored ? JSON.parse(stored) : [];
};

export const saveHistory = (item: HistoryItem) => {
  const history = getHistory();
  const newHistory = [item, ...history];
  localStorage.setItem("hiccup_history", JSON.stringify(newHistory));
  return checkBadges(newHistory);
};

export const getBadges = (): Badge[] => {
  if (typeof window === "undefined") return DEFAULT_BADGES;
  const stored = localStorage.getItem("hiccup_badges");
  return stored ? JSON.parse(stored) : DEFAULT_BADGES;
};

const checkBadges = (history: HistoryItem[]): Badge[] => {
  const currentBadges = getBadges();
  const successes = history.filter(h => h.success);
  const now = new Date();
  let newlyUnlocked: Badge[] = [];

  const updateBadge = (id: string, condition: boolean) => {
    const badge = currentBadges.find(b => b.id === id);
    if (badge && !badge.isUnlocked && condition) {
      badge.isUnlocked = true;
      badge.unlockedAt = now.toISOString();
      newlyUnlocked.push(badge);
    }
  };

  // 1. First Shield
  updateBadge("first_shield", successes.length >= 1);

  // 2. All-Rounder (Success in all 3 modes)
  const modes = new Set(successes.map(h => h.mode));
  updateBadge("all_rounder", modes.has("vacuum") && modes.has("sip") && modes.has("ritual"));

  // 3. Winning Streak (3 consecutive successes)
  let streak = 0;
  for (let i = 0; i < history.length; i++) {
    if (history[i].success) streak++;
    else break;
  }
  updateBadge("winning_streak", streak >= 3);

  // 4. Persistent Guard (Fail then Success)
  let hasPersistent = false;
  for (let i = 0; i < history.length - 1; i++) {
    if (history[i].success && !history[i+1].success) {
      hasPersistent = true;
      break;
    }
  }
  updateBadge("persistent_guard", hasPersistent);

  // 5. East Master (Ritual 5 times)
  updateBadge("east_master", successes.filter(h => h.mode === "ritual").length >= 5);

  // 3. Night Owl (Between 00:00 and 06:00)
  updateBadge("night_owl", successes.some(h => {
    const hour = new Date(h.date).getHours();
    return hour >= 0 && hour < 6;
  }));

  // 4. Silent Ninja (Sip 10 times)
  updateBadge("silent_ninja", successes.filter(h => h.mode === "sip").length >= 10);

  // 5. King of Lungs (Vacuum 15 times)
  updateBadge("king_of_lungs", successes.filter(h => h.mode === "vacuum").length >= 15);

  // 6. Legendary Guard (All modes 10 times)
  const ritualCount = successes.filter(h => h.mode === "ritual").length;
  const sipCount = successes.filter(h => h.mode === "sip").length;
  const vacuumCount = successes.filter(h => h.mode === "vacuum").length;
  updateBadge("legendary_guard", ritualCount >= 10 && sipCount >= 10 && vacuumCount >= 10);

  localStorage.setItem("hiccup_badges", JSON.stringify(currentBadges));
  return newlyUnlocked;
};

export const resetAllData = () => {
  localStorage.removeItem("hiccup_history");
  localStorage.removeItem("hiccup_badges");
  localStorage.removeItem("hiccup_user_name");
  window.location.reload();
};
