// app/api/mocks.ts
//
// Простейшие моки для разработки без реального сервера.
// Сейчас мокируем:
//  - /wp-json/vsh25/v1/me
//  - /wp-json/vsh25/v1/progress
//  - /api/auth/request-code
//  - /api/auth/verify-code

import type { ApiOptions } from './client';

export async function mockFetch<T>(
  path: string,
  options: ApiOptions
): Promise<T> {
  const { method = 'GET', body } = options;

  // Профиль пользователя (макет)
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

  // Прогресс (макет)
  if (path === '/wp-json/vsh25/v1/progress' && method === 'GET') {
    return {
      earned_seconds: 36000,
      today_seconds: 600,
      streak_days: 3,
    } as any;
  }

  // ----- АВТОРИЗАЦИЯ ЧЕРЕЗ КОД -----

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

  // Если для конкретного path нет мока — бросаем ошибку,
  // чтобы сразу увидеть, что запрос забыли замокать.
  throw new Error(`No mock implemented for path: ${method} ${path}`);
}
