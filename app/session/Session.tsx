// app/session/Session.tsx
// Контекст сессии VSH25:
// - хранит auth-токен (пока абстрактный, потом свяжем с реальным логином);
// - подтягивает профиль пользователя через /wp-json/vsh25/v1/me;
// - даёт signIn/signOut, чтобы экраны логина/профиля могли работать
//   в стиле нашего UI-кита (скриншоты сайта + тёмный мобильный UI).

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
  /** Текущий auth-токен (будем получать его от API логина) */
  token: string | null;
  /** Профиль пользователя с бэка (/me), либо null если не залогинен */
  user: UserProfile | null;
  /** Идёт ли начальная инициализация (чтение токена + попытка /me) */
  initializing: boolean;
  /** Явно грузим профиль (например, после логина или в экране профиля) */
  reloadProfile: () => Promise<void>;
  /** Вход: сохраняем токен и подтягиваем профиль */
  signIn: (token: string) => Promise<void>;
  /** Выход: чистим токен и профиль */
  signOut: () => Promise<void>;
};

const Ctx = createContext<SessionCtx | null>(null);
const TOKEN_KEY = 'auth_token';

export function SessionProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [initializing, setInit] = useState(true);

  // начальная инициализация: читаем токен и, если он есть, пытаемся загрузить /me
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
            // если /me отвалилась (например, токен устарел) —
            // не падаем, просто считаем, что юзер не залогинен
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
      // если не залогинен/ошибка — считаем, что профиля нет
      setUser(null);
    }
  };

  const signIn = async (t: string) => {
    // здесь t — это токен, который мы получим от настоящего API логина
    setToken(t);
    await SecureStore.setItemAsync(TOKEN_KEY, t);

    // сразу пытаемся подтянуть профиль
    await reloadProfile();
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    // при необходимости позже добавим вызов logout-эндпоинта
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
