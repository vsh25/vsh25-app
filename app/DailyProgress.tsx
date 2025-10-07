import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type VideoId = 'bio' | 'pill';
type DayISO = string; // 'YYYY-MM-DD'
type DayStatus = {
  bio?: boolean;  // true = просмотр засчитан
  pill?: boolean; // true = просмотр засчитан
  rating?: number; // оценка сессии (если есть)
};

type Ctx = {
  isCompletedToday: (id: VideoId) => boolean;
  markCompletedToday: (id: VideoId) => void;
  setDayStatus: (date: DayISO, partial: Partial<DayStatus>) => void;
  getDayStatus: (date: DayISO) => DayStatus | undefined;
};

const KEY = 'vsh25:progress';
const C = createContext<Ctx | null>(null);

function todayISO(): DayISO {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Храним статусы по дням, чистим старше 30 дней
function prune(obj: Record<DayISO, DayStatus>) {
  const entries = Object.entries(obj).sort(([a], [b]) => (a < b ? 1 : -1));
  const sliced = entries.slice(0, 30);
  return Object.fromEntries(sliced);
}

export function DailyProgressProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<Record<DayISO, DayStatus>>({});

  // загрузка из SecureStore
  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<DayISO, DayStatus>;
          setMap(prune(parsed));
        }
      } catch {}
    })();
  }, []);

  // удобная запись и немедленное сохранение
  const write = (updater: (prev: Record<DayISO, DayStatus>) => Record<DayISO, DayStatus>) => {
    setMap(prev => {
      const next = prune(updater(prev));
      // не ждём эффекта — сохраняем сразу
      SecureStore.setItemAsync(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const isCompletedToday = (id: VideoId) => {
    const st = map[todayISO()];
    return id === 'bio' ? !!st?.bio : !!st?.pill;
  };

  const markCompletedToday = (id: VideoId) => {
    const day = todayISO();
    write(prev => {
      const cur = prev[day] ?? {};
      const next: DayStatus = { ...cur, [id]: true };
      return { ...prev, [day]: next };
    });
  };

  const setDayStatus = (date: DayISO, partial: Partial<DayStatus>) => {
    write(prev => {
      const cur = prev[date] ?? {};
      const next: DayStatus = { ...cur, ...partial };
      return { ...prev, [date]: next };
    });
  };

  const getDayStatus = (date: DayISO) => map[date];

  return (
    <C.Provider value={{ isCompletedToday, markCompletedToday, setDayStatus, getDayStatus }}>
      {children}
    </C.Provider>
  );
}

export function useDailyProgress() {
  const ctx = useContext(C);
  if (!ctx) throw new Error('useDailyProgress must be used within DailyProgressProvider');
  return ctx;
}