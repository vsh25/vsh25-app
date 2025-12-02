// app/api/progress.ts
// Обёртка над /wp-json/vsh25/v1/progress

import { apiFetch } from './client';

export type ProgressData = {
  earned_seconds: number;
  today_seconds: number;
  streak_days: number;
};

export async function getProgress(): Promise<ProgressData> {
  // path тот же, что в PHP-плагине
  return apiFetch<ProgressData>('/wp-json/vsh25/v1/progress');
}