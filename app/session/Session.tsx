import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { getMe, UserProfile } from '../api/me';

type SessionCtx = {
  token: string | null;
  user: UserProfile | null;
  initializing: boolean;
  reloadProfile: () => Promise<void>;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<SessionCtx | null>(null);
const TOKEN_KEY = 'auth_token';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [initializing, setInit] = useState(true);

  // начальная инициализация: читаем токен и, если он есть, загрузим /me
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        if (cancelled) return;

        if (stored) {
          setToken(stored);
          try {
            const me = await getMe();
            if (!cancelled) setUser(me);
          } catch {
            if (!cancelled) {
              setUser(null);
            }
          }
        } else {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setInit(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const reloadProfile = async () => {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  const signIn = async (t: string) => {
    setToken(t);
    await SecureStore.setItemAsync(TOKEN_KEY, t);
    await reloadProfile();
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  };

  const value = useMemo<SessionCtx>(
    () => ({
      token,
      user,
      initializing,
      reloadProfile,
      signIn,
      signOut,
    }),
    [token, user, initializing]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSession must be used inside SessionProvider');
  return v;
}
