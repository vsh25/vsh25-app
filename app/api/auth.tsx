// app/api/auth.ts
// Слой авторизации для приложения VSH25.
//
// Сейчас:
//  - OTP-вход: requestCode / verifyCode
//  - Регистрация: registerStart / registerVerify / registerComplete
//  - Восстановление пароля: forgotStart / forgotVerify / forgotReset
//
// Реальные URL/тела потом подставим по факту бэка, сейчас работаем через моки.

import { apiFetch } from './client';

const AUTH_BASE = '/api/auth'; // заглушка; позже заменим на реальные пути

// ──────────────────────────────────────────────────────────────
//  OTP-ВХОД
// ──────────────────────────────────────────────────────────────

export type RequestCodePayload = {
  contact: string; // email или телефон
};

export type RequestCodeResponse = {
  requestId: string;
  ttl: number;
};

export type VerifyCodePayload = {
  requestId: string;
  code: string; // 6 цифр
};

export type VerifyCodeResponse = {
  token: string; // auth-токен для Session.signIn()
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

// ──────────────────────────────────────────────────────────────
//  РЕГИСТРАЦИЯ (wizard 1–3)
// ──────────────────────────────────────────────────────────────

export type RegisterChannel = 'email' | 'phone';

// Шаг 1 — отправка кода при регистрации
export type RegisterStartPayload = {
  contact: string;          // email или телефон
  channel: RegisterChannel; // "email" | "phone"
};

export type RegisterStartResponse = {
  requestId: string; // registration_token
  ttl: number;
};

export async function registerStart(
  payload: RegisterStartPayload
): Promise<RegisterStartResponse> {
  return apiFetch<RegisterStartResponse>(`${AUTH_BASE}/register/start`, {
    method: 'POST',
    body: payload,
  });
}

// Шаг 2 — подтверждение кода
export type RegisterVerifyPayload = {
  requestId: string;
  code: string;
};

export type RegisterVerifyResponse = {
  ok: boolean;
};

export async function registerVerify(
  payload: RegisterVerifyPayload
): Promise<RegisterVerifyResponse> {
  return apiFetch<RegisterVerifyResponse>(`${AUTH_BASE}/register/verify`, {
    method: 'POST',
    body: payload,
  });
}

// Шаг 3 — ввод 4 полей и завершение регистрации
export type RegisterCompletePayload = {
  requestId: string;   // тот же registration_token
  firstName: string;
  lastName: string;
  password: string;
};

export type RegisterCompleteResponse = {
  token: string;
};

export async function registerComplete(
  payload: RegisterCompletePayload
): Promise<RegisterCompleteResponse> {
  return apiFetch<RegisterCompleteResponse>(`${AUTH_BASE}/register/complete`, {
    method: 'POST',
    body: payload,
  });
}

// ──────────────────────────────────────────────────────────────
//  ВОССТАНОВЛЕНИЕ ПАРОЛЯ (forgot password, 3 шага)
// ──────────────────────────────────────────────────────────────

// Шаг 1 — отправка кода на email
export type ForgotStartPayload = {
  email: string;
};

export type ForgotStartResponse = {
  requestId: string;
  ttl: number;
};

export async function forgotStart(
  payload: ForgotStartPayload
): Promise<ForgotStartResponse> {
  return apiFetch<ForgotStartResponse>(`${AUTH_BASE}/forgot/start`, {
    method: 'POST',
    body: payload,
  });
}

// Шаг 2 — подтверждение кода
export type ForgotVerifyPayload = {
  requestId: string;
  code: string;
};

export type ForgotVerifyResponse = {
  ok: boolean;
};

export async function forgotVerify(
  payload: ForgotVerifyPayload
): Promise<ForgotVerifyResponse> {
  return apiFetch<ForgotVerifyResponse>(`${AUTH_BASE}/forgot/verify`, {
    method: 'POST',
    body: payload,
  });
}

// Шаг 3 — установка нового пароля
export type ForgotResetPayload = {
  requestId: string;
  newPassword: string;
};

export type ForgotResetResponse = {
  success: boolean;
};

export async function forgotReset(
  payload: ForgotResetPayload
): Promise<ForgotResetResponse> {
  return apiFetch<ForgotResetResponse>(`${AUTH_BASE}/forgot/reset`, {
    method: 'POST',
    body: payload,
  });
}
