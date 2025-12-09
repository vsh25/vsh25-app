// app/api/calendar.ts
// Календарь прогресса: 14 дней с флагами выполнения и набранными секундами.

import { apiFetch } from './client';

export type CalendarDay = {
  date: string;          // YYYY-MM-DD
  bioCompleted: boolean; // биопрограмма выполнена
  pillCompleted: boolean;// таблетка выполнена
  earnedSeconds: number; // набрано за день, сек.
};

export type CalendarResponse = {
  days: CalendarDay[];
};

export async function getCalendar14d(): Promise<CalendarDay[]> {
  // Пока path условный, будем работать через моки.
  const res = await apiFetch<CalendarResponse>('/api/calendar/14d', {
    method: 'GET',
  });
  return res.days;
}
