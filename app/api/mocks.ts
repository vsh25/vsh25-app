// app/api/mocks.ts
//
// Моки для разработки без реального сервера.
//
// Мокируем:
//  - /wp-json/vsh25/v1/me
//  - /wp-json/vsh25/v1/progress
//  - /api/auth/request-code
//  - /api/auth/verify-code
//  - /api/auth/register/start
//  - /api/auth/register/verify
//  - /api/auth/register/complete
//  - /api/auth/forgot/start
//  - /api/auth/forgot/verify
//  - /api/auth/forgot/reset
//  - /api/calendar/14d

import type { ApiOptions } from './client';

export async function mockFetch<T>(
  path: string,
  options: ApiOptions
): Promise<T> {
  const { method = 'GET', body } = options;

  // ──────────────────────────────────────────────
  // Профиль пользователя (ME)
  // ──────────────────────────────────────────────
  if (path === '/wp-json/vsh25/v1/me' && method === 'GET') {
    return {
      id: 1,
      email: 'demo@vsh25.net',
      username: 'demo',
      display_name: 'Demo User',
      birth_date: '1980-01-01',
      gender: 'm',
      registration_date: '2024-01-01',
      initial_age_seconds: 123456789,
      access: {
        type: 'default',
        expires: null,
      },
      subscription: {
        status: 'active',
        expires: null,
      },
    } as any;
  }

  // ──────────────────────────────────────────────
  // Прогресс (PROGRESS)
  // ──────────────────────────────────────────────
  if (path === '/wp-json/vsh25/v1/progress' && method === 'GET') {
    return {
      earned_seconds: 36000,
      today_seconds: 600,
      streak_days: 3,
    } as any;
  }

  // ──────────────────────────────────────────────
  // OTP-вход
  // ──────────────────────────────────────────────

  // Запрос кода (email/телефон)
  if (path === '/api/auth/request-code' && method === 'POST') {
    const contact = (body as any)?.contact || '';
    console.log('[MOCK] request-code for', contact);

    return {
      requestId: 'mock-request-id-123',
      ttl: 60,
    } as any;
  }

  // Проверка кода
  if (path === '/api/auth/verify-code' && method === 'POST') {
    const { code, requestId } = (body || {}) as any;
    console.log('[MOCK] verify-code', { requestId, code });

    if (code !== '123456') {
      throw new Error('Неверный код. Для теста используйте 123456.');
    }

    return {
      token: 'demo-token',
    } as any;
  }

  // ──────────────────────────────────────────────
  // РЕГИСТРАЦИЯ (wizard 1–3)
  // ──────────────────────────────────────────────

  // Шаг 1 — отправка кода
  if (path === '/api/auth/register/start' && method === 'POST') {
    const { contact, channel } = (body || {}) as any;
    console.log('[MOCK] register-start', { contact, channel });

    return {
      requestId: 'mock-register-id-123',
      ttl: 60,
    } as any;
  }

  // Шаг 2 — подтверждение кода
  if (path === '/api/auth/register/verify' && method === 'POST') {
    const { requestId, code } = (body || {}) as any;
    console.log('[MOCK] register-verify', { requestId, code });

    if (code !== '123456') {
      throw new Error('Неверный код регистрации. Для теста используйте 123456.');
    }

    return {
      ok: true,
    } as any;
  }

  // Шаг 3 — завершение регистрации
  if (path === '/api/auth/register/complete' && method === 'POST') {
    const { requestId, firstName, lastName } = (body || {}) as any;
    console.log('[MOCK] register-complete', { requestId, firstName, lastName });

    return {
      token: 'demo-token',
    } as any;
  }

  // ──────────────────────────────────────────────
  // ВОССТАНОВЛЕНИЕ ПАРОЛЯ (forgot password)
  // ──────────────────────────────────────────────

  // Шаг 1 — отправка кода на email
  if (path === '/api/auth/forgot/start' && method === 'POST') {
    const { email } = (body || {}) as any;
    console.log('[MOCK] forgot-start', { email });

    return {
      requestId: 'mock-forgot-id-123',
      ttl: 60,
    } as any;
  }

  // Шаг 2 — проверка кода
  if (path === '/api/auth/forgot/verify' && method === 'POST') {
    const { requestId, code } = (body || {}) as any;
    console.log('[MOCK] forgot-verify', { requestId, code });

    if (code !== '123456') {
      throw new Error('Неверный код восстановления. Для теста используйте 123456.');
    }

    return {
      ok: true,
    } as any;
  }

  // Шаг 3 — установка нового пароля
  if (path === '/api/auth/forgot/reset' && method === 'POST') {
    const { requestId } = (body || {}) as any;
    console.log('[MOCK] forgot-reset', { requestId });

    return {
      success: true,
    } as any;
  }

  // ──────────────────────────────────────────────
  // КАЛЕНДАРЬ 14 ДНЕЙ
  // ──────────────────────────────────────────────
  if (path === '/api/calendar/14d' && method === 'GET') {
    // Простая заглушка: 14 дней, сегодня + 13 назад
    const today = new Date();

    const days = Array.from({ length: 14 }).map((_, idx) => {
      const d = new Date(today);
      d.setDate(today.getDate() - idx);
      const date = d.toISOString().slice(0, 10); // YYYY-MM-DD

      // Для демонстрации: через день — всё выполнено
      const bioCompleted = idx % 2 === 0;
      const pillCompleted = idx % 3 === 0;
      const earnedSeconds =
        (bioCompleted ? 10 * 60 : 0) + (pillCompleted ? 30 : 0);

      return {
        date,
        bioCompleted,
        pillCompleted,
        earnedSeconds,
      };
    }).reverse(); // чтобы первый элемент — самый старый, последний — сегодня

    return { days } as any;
  }

  // ──────────────────────────────────────────────
  // Если не нашли мок — явно ругаемся
  // ──────────────────────────────────────────────

  if (path === '/api/rating' && method === 'POST') {
    const { contentId, score } = (body || {}) as any;
    console.log('[MOCK] rating', { contentId, score });

    return {
      ok: true,
    } as any;
  }
  
  throw new Error(`No mock implemented for path: ${method} ${path}`);
}
