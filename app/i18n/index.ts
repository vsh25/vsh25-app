import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: { translation: {
    home: { title: 'Главная' },
    player: { completed: 'засчитано' },
    auth: { login: 'Вход', getCode: 'Получить код', confirm: 'Подтвердить' },
    profile: { title: 'Профиль', language: 'Язык интерфейса', ru: 'Русский', en: 'English' },
    buttons: { profile: 'Профиль', reminders: 'Напоминания' },
    kb: { title: 'База знаний' },
    paywall: { title: 'Подписка', buy: 'Купить', restore: 'Восстановить покупку' },

  }},
  en: { translation: {
    home: { title: 'Home' },
    player: { completed: 'completed' },
    auth: { login: 'Sign in', getCode: 'Get code', confirm: 'Confirm' },
    profile: { title: 'Profile', language: 'Interface language', ru: 'Russian', en: 'English' },
    buttons: { profile: 'Profile', reminders: 'Reminders' },
    kb: { title: 'Knowledge base' },
    paywall: { title: 'Subscription', buy: 'Buy', restore: 'Restore purchase' },

  }},
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
});

export default i18n;