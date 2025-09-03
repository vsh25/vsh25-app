import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

type SessionCtx = {
  token: string | null;
  initializing: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<SessionCtx | null>(null);
const TOKEN_KEY = 'auth_token';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInit] = useState(true);

  // загружаем токен при старте
  useEffect(() => {
    (async () => {
      try {
        const t = await SecureStore.getItemAsync(TOKEN_KEY);
        setToken(t ?? null);
      } finally {
        setInit(false);
      }
    })();
  }, []);

  const signIn = async (t: string) => {
    setToken(t);
    await SecureStore.setItemAsync(TOKEN_KEY, t);
  };

  const signOut = async () => {
    setToken(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  };

  return <Ctx.Provider value={{ token, initializing, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSession must be used inside SessionProvider');
  return v;
}