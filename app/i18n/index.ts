import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ru: { translation: {
    home: { title: 'Главная' },
    player: { completed: 'засчитано' },
    auth: { login: 'Вход', getCode: 'Получить код', confirm: 'Подтвердить' },
    profile: { title: 'Профиль', language: 'Язык интерфейса', ru: 'Русский', en: 'English' },
    buttons: { profile: 'Профиль', reminders: 'Напоминания' },
  }},
  en: { translation: {
    home: { title: 'Home' },
    player: { completed: 'completed' },
    auth: { login: 'Sign in', getCode: 'Get code', confirm: 'Confirm' },
    profile: { title: 'Profile', language: 'Interface language', ru: 'Russian', en: 'English' },
    buttons: { profile: 'Profile', reminders: 'Reminders' },
  }},
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
});

export default i18n;