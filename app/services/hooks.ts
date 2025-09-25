// app/services/hooks.ts
import { useApi } from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Типы данных
export type DailyVideo = { id: 'bio' | 'pill'; title: string; url: string; durationSec: number };

export function useDailyVideos() {
  const api = useApi();

  return useQuery({
    queryKey: ['daily-videos'],
    queryFn: async (): Promise<DailyVideo[]> => {
      if (api.MOCK) {
        // Мок-данные
        return [
          { id: 'bio',  title: 'Биопрограмма (10 мин)',  url: 'https://…/bio.m3u8',  durationSec: 600 },
          { id: 'pill', title: 'Таблетка (30 сек)',     url: 'https://…/pill.m3u8', durationSec: 30  },
        ];
      }
      // Реальный вызов (когда MOCK=false)
      return api.get<DailyVideo[]>('/daily-videos');
    },
    staleTime: 60 * 1000,
  });
}

// Пример мутации “оценка видео”
export function useRateVideo() {
  const api = useApi();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (p: { id: 'bio' | 'pill'; rating: number }) => {
      if (api.MOCK) {
        // В мок-режиме просто возвращаем успех
        return { ok: true };
      }
      return api.post<{ ok: true }>('/rate', p);
    },
    onSuccess: () => {
      // при необходимости обновим связанные кэши
      qc.invalidateQueries({ queryKey: ['daily-videos'] });
    },
  });
}