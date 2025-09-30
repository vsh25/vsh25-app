import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

type SubCtx = {
  active: boolean;
  loading: boolean;
  activate: () => Promise<void>;
  deactivate: () => Promise<void>;
};

const Ctx = createContext<SubCtx | null>(null);
const KEY = 'vsh25:subscription';

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const v = await SecureStore.getItemAsync(KEY);
        setActive(v === '1');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activate = async () => {
    await SecureStore.setItemAsync(KEY, '1');
    setActive(true);
  };

  const deactivate = async () => {
    await SecureStore.deleteItemAsync(KEY);
    setActive(false);
  };

  return (
    <Ctx.Provider value={{ active, loading, activate, deactivate }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider');
  return ctx;
}