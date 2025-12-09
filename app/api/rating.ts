// app/api/rating.ts
// Отправка оценки видео/эпизода.

import { apiFetch } from './client';

export type RatingPayload = {
  contentId: string; // id эпизода / видео
  score: number;     // 1..5
};

export type RatingResponse = {
  ok: boolean;
};

export async function sendRating(
  payload: RatingPayload
): Promise<RatingResponse> {
  return apiFetch<RatingResponse>('/api/rating', {
    method: 'POST',
    body: payload,
  });
}
