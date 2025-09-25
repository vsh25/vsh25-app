// app/services/api.ts
// Минимальный клиент: baseURL, токен из Session, мок-режим.

import { useSession } from '../session/Session';

const BASE_URL = 'https://vsh25.net/wp-json/vsh25/v1'; // поправим при необходимости
const MOCK = true; // переключатель мок/реальный API

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

async function http<T>(method: HttpMethod, url: string, body?: any, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return (await res.json()) as T;
}

// Хуки-обёртки, чтобы доставать токен из Session
export function useApi() {
  const { token } = useSession();

  return {
    get:  <T,>(path: string) => http<T>('GET',  `${BASE_URL}${path}`, undefined, token || undefined),
    post: <T,>(path: string, body?: any) => http<T>('POST', `${BASE_URL}${path}`, body, token || undefined),
    patch:<T,>(path: string, body?: any) => http<T>('PATCH',`${BASE_URL}${path}`, body, token || undefined),
    del:  <T,>(path: string) => http<T>('DELETE',`${BASE_URL}${path}`, undefined, token || undefined),

    MOCK,
  };
}