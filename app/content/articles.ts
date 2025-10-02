export type KBItem = { id: string; title: string; url: string; tag?: string; icon?: string };

export const articles: KBItem[] = [
  {
    id: 'a1',
    title: 'Влияние меньшинства',
    url: 'https://vsh25.net/',               // временно
    tag: '#Социальная психология',
    icon: '🧠',
  },
  {
    id: 'a2',
    title: 'Как мы судим об окружающих',
    url: 'https://vsh25.net/o-proekte/',     // временно
    tag: '#Социальная психология',
    icon: '🫂',
  },
  {
    id: 'a3',
    title: 'А часики-то тикают',
    url: 'https://vsh25.net/novosti/',       // временно
    tag: '#Эндокринная система',
    icon: '⏳',
  },
];