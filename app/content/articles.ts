import type { IconName } from '../ui/Icon';

export type KBItem = {
  id: string;
  title: string;
  url: string;
  tag?: string;
  iconName?: IconName;
};

export const articles: KBItem[] = [
  {
    id: 'a1',
    title: 'Влияние меньшинства',
    url: 'https://vsh25.net/',               // временная ссылка
    tag: '#Социальная психология',
    iconName: 'brain',
  },
  {
    id: 'a2',
    title: 'Как мы судим об окружающих',
    url: 'https://vsh25.net/o-proekte/',
    tag: '#Социальная психология',
    iconName: 'people',
  },
  {
    id: 'a3',
    title: 'А часики-то тикают',
    url: 'https://vsh25.net/novosti/',
    tag: '#Эндокринная система',
    iconName: 'hourglass',
  },
];