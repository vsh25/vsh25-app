import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: {
    translation: {
      home: { title: 'Главная' },
      player: { completed: 'засчитано' },
      auth: { login: 'Вход', getCode: 'Получить код', confirm: 'Подтвердить' },
      profile: { title: 'Профиль', language: 'Язык интерфейса', ru: 'Русский', en: 'English' },
      buttons: { profile: 'Профиль', reminders: 'Напоминания' },
      kb: { title: 'База знаний' },

      // Виджет «Продление жизни»
      life: {
        title: 'Продление жизни',
        done: 'Выполнено сегодня',
        bio: 'Биопрограмма',
        pill: 'Таблетка',
      },

      paywall: {
        title: 'Подписка',
        heroTitle: 'Подписка VSH25',
        heroCaption: 'Доступ к Биопрограмме и Цифровой таблетке, календарю и напоминаниям.',
        benefitsTitle: 'Что получите',
        b1: '• Ежедневные видео-сессии',
        b2: '• Учёт прогресса и календарь',
        b3: '• Напоминания и рекомендации',
        buy: 'Купить',
        restore: 'Восстановить покупку',
        mockOff: 'Отключить подписку (MOCK)',
        activated: 'Подписка активирована',
        restored: 'Подписка восстановлена',
      },
    },
  },
  en: {
    translation: {
      home: { title: 'Home' },
      player: { completed: 'completed' },
      auth: { login: 'Sign in', getCode: 'Get code', confirm: 'Confirm' },
      profile: { title: 'Profile', language: 'Interface language', ru: 'Russian', en: 'English' },
      buttons: { profile: 'Profile', reminders: 'Reminders' },
      kb: { title: 'Knowledge base' },

      // Life widget
      life: {
        title: 'Life extension',
        done: 'Completed today',
        bio: 'Bio-program',
        pill: 'Digital Pill',
      },

      paywall: {
        title: 'Subscription',
        heroTitle: 'VSH25 Subscription',
        heroCaption: 'Access to Bio-program, Digital Pill, calendar and reminders.',
        benefitsTitle: 'What you get',
        b1: '• Daily video sessions',
        b2: '• Progress tracking and calendar',
        b3: '• Reminders and tips',
        buy: 'Buy',
        restore: 'Restore purchase',
        mockOff: 'Disable subscription (MOCK)',
        activated: 'Subscription activated',
        restored: 'Subscription restored',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
});

export default i18n;