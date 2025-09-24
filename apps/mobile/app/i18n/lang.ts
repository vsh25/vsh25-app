import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './index';

const LANG_KEY = 'vsh25:lang';

export async function loadSavedLanguage() {
  try {
    const saved = await AsyncStorage.getItem(LANG_KEY);
    if (saved === 'ru' || saved === 'en') {
      await i18n.changeLanguage(saved);
    }
  } catch {}
}

export async function setLanguage(lang: 'ru' | 'en') {
  try {
    await AsyncStorage.setItem(LANG_KEY, lang);
    await i18n.changeLanguage(lang);
  } catch {}
}