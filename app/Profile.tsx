// app/Profile.tsx
import React from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import UIButton from './ui/Button';
import { theme } from './theme';
import * as Notifications from 'expo-notifications';
import { useSession } from './session/Session';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { setLanguage } from './i18n/lang';

export default function Profile() {
  const { signOut } = useSession();
  const { t } = useTranslation();
  const current = i18n.language as 'ru' | 'en';

  // --- уведомления ---
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
      content: { title: 'VSH25', body: t('reminders.body', 'Время биопрограммы. 10 минут — и день засчитан.') },
      trigger: { hour: 21, minute: 0, repeats: true },
    });
    const list = await Notifications.getAllScheduledNotificationsAsync();
    Alert.alert('Готово', `Напоминание в 21:00 включено. Всего запланировано: ${list.length}.`);
  };

  const disableAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert('Отключено', 'Ежедневные напоминания удалены.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.title', 'Профиль')}</Text>

      {/* Язык */}
      <Text style={styles.sectionTitle}>{t('profile.language', 'Язык интерфейса')}</Text>
      <View style={styles.row}>
        <UIButton
          title={t('profile.ru', 'Русский')}
          variant={current === 'ru' ? 'primary' : 'outline'}
          onPress={() => setLanguage('ru')}
        />
        <UIButton
          title={t('profile.en', 'English')}
          variant={current === 'en' ? 'primary' : 'outline'}
          onPress={() => setLanguage('en')}
          style={{ marginLeft: 8 }}
        />
      </View>

      {/* Напоминания */}
      <View style={styles.spacer} />
      <UIButton title={t('buttons.reminders', 'Напоминания 21:00')} onPress={enable21} fullWidth />
      <View style={{ height: 12 }} />
      <UIButton title={t('reminders.turnOff', 'Отключить напоминания')} variant="outline" onPress={disableAll} fullWidth />

      {/* Выход */}
      <View style={styles.spacer} />
      <UIButton title={t('auth.logout', 'Выйти')} variant="outline" onPress={signOut} fullWidth />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: theme.color.bg },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16, color: theme.color.text },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: theme.color.muted },
  row: { flexDirection: 'row' },
  spacer: { height: 24 },
});