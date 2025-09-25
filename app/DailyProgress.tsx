import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Статус дня: что выполнено и оценка (если была)
 */
export type DayStatus = {
  bio?: boolean;      // Биопрограмма выполнена
  pill?: boolean;     // Таблетка выполнена
  rating?: number;    // 1..5 (опционально)
};

/**
 * История: ключ — YYYY-MM-DD, значение — DayStatus
 * Пример: { "2025-09-10": { bio: true, pill: false, rating: 4 } }
 */
type HistoryMap = Record<string, DayStatus>;

type Ctx = {
  // ← текущая логика (оставляем совместимость)
  markCompletedToday: (id: 'bio' | 'pill') => void;
  isCompletedToday: (id: 'bio' | 'pill') => boolean;

  // ↓ новые методы (пригодятся в следующих шагах)
  getDayStatus: (dateISO: string) => DayStatus | undefined;
  setDayStatus: (dateISO: string, patch: Partial<DayStatus>) => void;
  history: HistoryMap; // полная история (на будущее для календаря)
};

const DailyProgressContext = createContext<Ctx | null>(null);

/** Старый ключ (совместимость): { [id]: 'YYYY-MM-DD' } */
const STORAGE_KEY_OLD = 'vsh25:dailyProgress';
/** Новый ключ: история по датам */
const STORAGE_KEY = 'vsh25:history';
/** Сегодня в формате YYYY-MM-DD */
const todayISO = () => new Date().toISOString().slice(0, 10);

export function DailyProgressProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<HistoryMap>({});

  // --- Загрузка: мигрируем старый формат в новый (один раз) ---
  useEffect(() => {
    (async () => {
      try {
        // Пытаемся прочитать новый формат
        const rawNew = await AsyncStorage.getItem(STORAGE_KEY);
        if (rawNew) {
          setHistory(JSON.parse(rawNew));
          return;
        }

        // Если нового нет — читаем старый и мигрируем
        const rawOld = await AsyncStorage.getItem(STORAGE_KEY_OLD);
        if (rawOld) {
          const old: Record<'bio' | 'pill' | string, string> = JSON.parse(rawOld);
          const t = todayISO();
          const migrated: HistoryMap = { [t]: {} };
          if (old['bio'] === t) migrated[t].bio = true;
          if (old['pill'] === t) migrated[t].pill = true;

          setHistory(migrated);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          // старый ключ можно удалить позже; пока оставим, чтобы не потерять данные
          return;
        }

        // Ничего не было — старт с пустой историей
        setHistory({});
      } catch {
        setHistory({});
      }
    })();
  }, []);

  // --- Сохранение истории при каждом изменении ---
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history)).catch(() => {});
  }, [history]);

  // ---- Хелперы записи/чтения ----
  const setDayStatus = (dateISO: string, patch: Partial<DayStatus>) => {
    setHistory(prev => {
      const prevDay = prev[dateISO] ?? {};
      const nextDay: DayStatus = { ...prevDay, ...patch };
      return { ...prev, [dateISO]: nextDay };
    });
  };

  const getDayStatus = (dateISO: string) => history[dateISO];

  // ---- Совместимость со старым API (используется в Player/Home) ----
  const markCompletedToday = (id: 'bio' | 'pill') => {
    const t = todayISO();
    setDayStatus(t, { [id]: true } as Partial<DayStatus>);
  };

  const isCompletedToday = (id: 'bio' | 'pill') => {
    const t = todayISO();
    const day = history[t];
    return Boolean(day?.[id]);
  };

  const value = useMemo<Ctx>(
    () => ({
      markCompletedToday,
      isCompletedToday,
      getDayStatus,
      setDayStatus,
      history,
    }),
    [history]
  );

  return (
    <DailyProgressContext.Provider value={value}>
      {children}
    </DailyProgressContext.Provider>
  );
}

export function useDailyProgress() {
  const ctx = useContext(DailyProgressContext);
  if (!ctx) throw new Error('useDailyProgress must be used inside DailyProgressProvider');
  return ctx;
}