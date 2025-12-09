// app/api/calendar.ts
// Календарь прогресса: 14 дней.

import { apiFetch } from './client';

export type CalendarDay = {
  date: string;          // YYYY-MM-DD
  bioCompleted: boolean;
  pillCompleted: boolean;
  earnedSeconds: number;
};

export type CalendarResponse = {
  days: CalendarDay[];
};

export async function getCalendar14d(): Promise<CalendarDay[]> {
  // client.ts при включённых моках отправит этот запрос в mockFetch,
  // который вернёт days из app/api/mocks.ts
  const res = await apiFetch<CalendarResponse>('/api/calendar/14d', {
    method: 'GET',
  });
  return res.days;
}
