import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

type Ctx = {
  markCompletedToday: (id: string) => void;
  isCompletedToday: (id: string) => boolean;
};

const DailyProgressContext = createContext<Ctx | null>(null);
const todayISO = () => new Date().toISOString().slice(0, 10);

export function DailyProgressProvider({ children }: { children: ReactNode }) {
  const [byId, setById] = useState<Record<string, string>>({});

  const markCompletedToday = (id: string) => setById(prev => ({ ...prev, [id]: todayISO() }));
  const isCompletedToday = (id: string) => byId[id] === todayISO();

  const value = useMemo(() => ({ markCompletedToday, isCompletedToday }), [byId]);
  return <DailyProgressContext.Provider value={value}>{children}</DailyProgressContext.Provider>;
}

export function useDailyProgress() {
  const ctx = useContext(DailyProgressContext);
  if (!ctx) throw new Error('useDailyProgress must be used inside DailyProgressProvider');
  return ctx;
}