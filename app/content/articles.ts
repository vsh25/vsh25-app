// app/content/articles.ts
export type KBItem = { id: string; title: string; url: string; tag?: string };

export const articles: KBItem[] = [
  {
    id: 'a1',
    title: 'Влияние меньшинства',
    url: 'https://vsh25.net/',                 // ВРЕМЕННО: главная. Потом подставим реальную статью.
    tag: '#Социальная психология',
  },
  {
    id: 'a2',
    title: 'Как мы судим об окружающих',
    url: 'https://vsh25.net/o-proekte/',       // ВРЕМЕННО: «О проекте».
    tag: '#Социальная психология',
  },
  {
    id: 'a3',
    title: 'А часики-то тикают',
    url: 'https://vsh25.net/novosti/',         // ВРЕМЕННО: «Новости».
    tag: '#Эндокринная система',
  },
];