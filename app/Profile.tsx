import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import UIButton from './ui/Button';
import { useSession } from './session/Session';
import { theme } from './theme';
import * as Notifications from 'expo-notifications';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { signOut } = useSession();
  const { t } = useTranslation();

  // Включить ежедневное напоминание на 21:00
  const enableDailyReminder = async () => {
    try {
      // права на уведомления
      let { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        ({ status } = await Notifications.requestPermissionsAsync());
      }
      if (status !== 'granted') {
        Alert.alert(
          t('reminders.noPermTitle', 'Уведомления выключены'),
          t('reminders.noPermBody', 'Разрешите уведомления в настройках системы.')
        );
        return;
      }

      // снимаем старые расписания и ставим новое
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'VSH25',
          body: t('reminders.body', 'Время биопрограммы. 10 минут — и день засчитан.'),
        },
        trigger: { hour: 21, minute: 0, repeats: true }, // локальное время
      });

      Alert.alert(
        t('reminders.enabledTitle', 'Готово'),
        t('reminders.enabledBody', 'Ежедневное напоминание в 21:00 включено')
      );
    } catch (e: any) {
      Alert.alert('Ошибка', String(e?.message ?? e));
    }
  };

  // Отключить все запланированные напоминания
  const disableReminders = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert(
        t('reminders.offTitle', 'Готово'),
        t('reminders.offBody', 'Ежедневные напоминания отключены')
      );
    } catch (e: any) {
      Alert.alert('Ошибка', String(e?.message ?? e));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('profile.title', 'Профиль')}</Text>

      <UIButton
        title={t('buttons.reminders', 'Напоминания')}
        onPress={enableDailyReminder}
        fullWidth
      />

      <View style={{ height: 12 }} />

      <UIButton
        title={t('reminders.turnOff', 'Отключить напоминания')}
        variant="outline"
        onPress={disableReminders}
        fullWidth
      />

      <View style={{ height: 12 }} />

      <UIButton
        title={t('auth.logout', 'Выйти')}
        variant="outline"
        onPress={signOut}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: theme.color.bg },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 16, color: theme.color.text },
});