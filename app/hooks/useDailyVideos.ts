// app/hooks/useDailyVideos.ts
export type DailyVideo = {
    id: 'bio' | 'pill';
    title: string;
    src: string;
    minPercent: number;   // порог засчёта
    durationSec: number;  // подсказка на карточке
  };
  
  export function useDailyVideos(date: Date = new Date()): { bio: DailyVideo; pill: DailyVideo } {
    // Пока MOCK. Потом заменим на запрос к API.
    const bio: DailyVideo = {
      id: 'bio',
      title: 'Биопрограмма (10 минут)',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      minPercent: 0.9,
      durationSec: 10 * 60,
    };
  
    const pill: DailyVideo = {
      id: 'pill',
      title: 'Цифровая таблетка (30 сек)',
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      minPercent: 0.8,
      durationSec: 30,
    };
  
    return { bio, pill };
  }