// app/api/progress.ts
// Прогресс пользователя: общее заработанное время, сегодня и серия дней.

import { apiFetch } from './client';

export type ProgressData = {
  earned_seconds: number; // всего заработано (сек)
  today_seconds: number;  // сегодня (сек)
  streak_days: number;    // серия дней подряд
};

export async function getProgress(): Promise<ProgressData> {
  // Когда extra.useMocks = true, client.ts сам перекинет этот запрос в mockFetch.
  return apiFetch<ProgressData>('/wp-json/vsh25/v1/progress', {
    method: 'GET',
  });
}
