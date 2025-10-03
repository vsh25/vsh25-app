import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export type ResourceId = 'bio' | 'pill' | 'kb';
type GateMode = 'free' | 'pay';

const DEFAULTS: Record<ResourceId, GateMode> = {
  bio: 'free',
  pill: 'free',
  kb: 'free',
};

const KEY = 'vsh25:gating';

type Ctx = {
  mode: Record<ResourceId, GateMode>;
  isPaywalled: (id: ResourceId) => boolean;
  setMode: (id: ResourceId, m: GateMode) => Promise<void>;
  loading: boolean;
};

const GatingCtx = createContext<Ctx | null>(null);

export function GatingProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Record<ResourceId, GateMode>>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<Record<ResourceId, GateMode>>;
          setModeState({ ...DEFAULTS, ...saved });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const setMode = async (id: ResourceId, m: GateMode) => {
    setModeState(prev => {
      const next = { ...prev, [id]: m };
      SecureStore.setItemAsync(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  const isPaywalled = (id: ResourceId) => mode[id] === 'pay';

  return (
    <GatingCtx.Provider value={{ mode, isPaywalled, setMode, loading }}>
      {children}
    </GatingCtx.Provider>
  );
}

export function useGating() {
  const ctx = useContext(GatingCtx);
  if (!ctx) throw new Error('useGating must be used inside GatingProvider');
  return ctx;
}