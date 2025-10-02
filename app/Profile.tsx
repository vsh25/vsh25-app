import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import UIButton from './ui/Button';
import { theme } from './theme';
import * as Notifications from 'expo-notifications';
import { useSession } from './session/Session';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { setLanguage } from './i18n/lang';
import { H2, Subtle } from './ui/Typography';
import { toast } from './ui/toast';

export default function Profile() {
  const { signOut } = useSession();
  const { t } = useTranslation();
  const current = (i18n.language as 'ru' | 'en') || 'ru';

  // — уведомления —
  const ensurePerms = async () => {
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') ({ status } = await Notifications.requestPermissionsAsync());
    if (status !== 'granted') {
      Alert.alert('Уведомления выключены', 'Разрешите уведомления в настройках системы.');
      return false;
    }
    return true;
  };

  const enable21 = async () => {
    if (!(await ensurePerms())) return;
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: { title: 'VSH25', body: 'Время биопрограммы. 10 минут — и день засчитан.' },
      trigger: { hour: 21, minute: 0, repeats: true },
    });
    toast('Ежедневное напоминание в 21:00 включено');
  };

  const disableAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    toast('Ежедневные напоминания отключены');
  };

  return (
    <View style={styles.container}>
      <H2>{t('profile.title', 'Профиль')}</H2>

      <Subtle style={{ marginBottom: 8 }}>
        {t('profile.language', 'Язык интерфейса')}
      </Subtle>
      <View style={styles.row}>
        <UIButton
          title={t('profile.ru', 'Русский')}
          variant={current === 'ru' ? 'primary' : 'outline'}
          onPress={() => setLanguage('ru')}
        />
        <View style={{ width: 8 }} />
        <UIButton
          title={t('profile.en', 'English')}
          variant={current === 'en' ? 'primary' : 'outline'}
          onPress={() => setLanguage('en')}
        />
      </View>

      <View style={{ height: 20 }} />

      <UIButton title={t('buttons.reminders', 'Напоминания 21:00')} onPress={enable21} fullWidth />
      <View style={{ height: 12 }} />
      <UIButton title="Отключить напоминания" variant="outline" onPress={disableAll} fullWidth />

      <View style={{ height: 20 }} />

      <UIButton title={t('auth.logout', 'Выйти')} variant="outline" onPress={signOut} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: theme.color.bg },
  row: { flexDirection: 'row', alignItems: 'center' },
});