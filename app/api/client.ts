// app/api/client.ts
//
// Базовый HTTP-клиент для работы с API VSH25.
// Берёт базовый адрес из app.json (extra.apiBaseUrl).
// При extra.useMocks = true все запросы уходят в mockFetch из ./mocks.
//
// Позже сюда можно добавить:
//  - Authorization: Bearer <token> (auth = true),
//  - обработку refresh-токена.

import Constants from 'expo-constants';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions {
  method?: HttpMethod;
  body?: unknown;
  auth?: boolean; // резерв на будущее (Bearer и т.п.)
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

// Читаем настройки из app.json → expo.expoConfig.extra
const extra = (Constants.expoConfig?.extra || {}) as any;

const API_BASE: string = extra.apiBaseUrl || '';
const USE_MOCKS: boolean = !!extra.useMocks;

/**
 * Универсальный запрос к API.
 *
 * path — относительный путь (например, "/wp-json/vsh25/v1/me" или "wp-json/vsh25/v1/me")
 * T    — ожидаемый тип ответа.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, auth = false, signal, headers: extraHeaders } = options;

  // 1) Режим моков — для разработки без реального бэка.
  if (USE_MOCKS) {
    const { mockFetch } = await import('./mocks');
    return mockFetch<T>(path, options);
  }

  // 2) Проверяем, что базовый адрес задан
  if (!API_BASE) {
    throw new Error('API base url is not configured (extra.apiBaseUrl)');
  }

  // Если path уже абсолютный (начинается с http), используем его как есть.
  // Иначе аккуратно приклеиваем к API_BASE.
  let url: string;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    url = path;
  } else {
    const base = API_BASE.replace(/\/+$/, '');
    const rel = path.startsWith('/') ? path : `/${path}`;
    url = base + rel;
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(extraHeaders || {}),
  };

  let fetchBody: string | undefined;

  if (body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    fetchBody = JSON.stringify(body);
  }

  // auth сейчас не используем, потому что авторизация cookie-based (WordPress).
  // Позже сюда можно добавить:
  // if (auth) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers,
    body: fetchBody,
    signal,
  });

  const text = await response.text().catch(() => '');

  if (!response.ok) {
    // пробуем вытащить сообщение из JSON-ответа, если это он
    try {
      const data = text ? JSON.parse(text) : null;
      const msg =
        (data && (data.message || data.error || data.detail)) ||
        `HTTP ${response.status}`;
      throw new Error(msg);
    } catch {
      throw new Error(text || `HTTP ${response.status}`);
    }
  }

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
