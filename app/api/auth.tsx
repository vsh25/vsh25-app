// app/api/auth.ts
// Слой авторизации: запрос кода и проверка кода.
// Пока пути условные. Когда будет точный backend, поменяем AUTH_BASE и хвосты.

import { apiFetch } from './client';

const AUTH_BASE = '/api/auth'; // потом заменим на реальный префикс с бэка

// Вход: пользователь вводит email или телефон
export type RequestCodePayload = {
  contact: string; // email или телефон, как на экране "Вход"
};

export type RequestCodeResponse = {
  requestId: string;
  ttl: number; // через сколько секунд можно повторить запрос
};

// Проверка кода
export type VerifyCodePayload = {
  requestId: string;
  code: string; // 6 цифр
};

export type VerifyCodeResponse = {
  token: string; // auth-токен, который отдадим в signIn()
};

export async function requestCode(
  payload: RequestCodePayload
): Promise<RequestCodeResponse> {
  return apiFetch<RequestCodeResponse>(`${AUTH_BASE}/request-code`, {
    method: 'POST',
    body: payload,
  });
}

export async function verifyCode(
  payload: VerifyCodePayload
): Promise<VerifyCodeResponse> {
  return apiFetch<VerifyCodeResponse>(`${AUTH_BASE}/verify-code`, {
    method: 'POST',
    body: payload,
  });
}
