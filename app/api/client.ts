// app/api/client.ts
//
// Базовый HTTP-клиент для работы с API VSH25.
// Берёт базовый адрес из app.json (extra.apiBaseUrl).
// Пока не добавляем авторизацию по токену — на бэке она cookie-based (WordPress).
// Позже сюда добавим Bearer/refresh, когда определим точный контракт логина.

import Constants from 'expo-constants';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean;         // резерв на будущее (Bearer и т.п.)
  signal?: AbortSignal;
}

// Читаем настройки из app.json → expo.expoConfig.extra
const extra = (Constants.expoConfig?.extra || {}) as any;

const API_BASE: string = extra.apiBaseUrl || '';
const USE_MOCKS: boolean = !!extra.useMocks;

/**
 * Универсальный запрос к API.
 *
 * path — относительный путь (например, "/wp-json/vsh25/v1/me")
 * T    — ожидаемый тип ответа (определим позже в типах).
 */
export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, auth = false, signal } = options;

  // 1) Режим моков — для разработки без реального бэка.
  if (USE_MOCKS) {
    const { mockFetch } = await import('./mocks');
    return mockFetch<T>(path, options);
  }

  // 2) Проверяем, что базовый адрес задали
  if (!API_BASE) {
    throw new Error('API base url is not configured (extra.apiBaseUrl)');
  }

  // Если path уже абсолютный (начинается с http), используем его как есть.
  // Иначе приклеиваем к API_BASE.
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  let fetchBody: string | undefined;

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  }

  // auth сейчас не используем, потому что авторизация cookie-based (WordPress).
  // Позже сюда добавим Authorization: Bearer <token>, когда будет контракт.

  const response = await fetch(url, {
    method,
    headers,
    body: fetchBody,
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `HTTP ${response.status}`);
  }

  const text = await response.text();

  if (!text) {
    // иногда API может вернуть пустой ответ с 204 и т.п.
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    // если вдруг это не JSON, возвращаем сырой текст
    return text as unknown as T;
  }
}